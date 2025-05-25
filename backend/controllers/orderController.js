import Product from "../models/Product.js";
import Order from "../models/Order.js";
import stripe from "stripe";
import User from "../models/User.js";

//Place order  COD : /api/order/cod

export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.user.id;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    //calcualte amount of items

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);

      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    //Add Tax 2%

    amount += Math.floor(amount * 0.02);

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Get Orders By User Id   :/api/order/user

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product") // ✅ Fixed
      .populate("address") // ✅ Fixed
      .sort({ createdAt: -1 });

    console.log(orders); // Optional log for debug

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Get all order for(seller/admin) : /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Place order Strip : /api/order/stripe

export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;

    const userId = req.user.id;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    //After adding the *** stripe ***
    let productsData = [];

    //Cart Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productsData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    //   calcualte amount of items before add ***** stripe ****

    // let amount = await items.reduce(async (acc, item) => {
    //   const product = await Product.findById(item.product);
    //   return (await acc) + product.offerPrice * item.quantity;
    // }, 0);

    //Add Tax 2%
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    //Stripe Gateway initialize

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    //Create line items from stripe

    const line_items = productsData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // amount + amount * tax  -> *** cents ***
        },
        quantity: item.quantity,
      };
    });

    //create sessions
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//----------- ---------------- -------------------------------------------------

//Stripe webhooks to verify payment actions :/stripe

export const stripeWebHooks = async (request, response) => {
  //Stripe Gateway initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const signature = request.headers["stripe-signature"];

  let event;

  // construct event is used to get the check the raw data from body convert to clean object

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature error:", error.message);
    return response.status(400).send(`Webhook Error : ${error.message}`);
  }

  //Hanlde the event

  switch (event.type) {
    case "checkout.session.completed": {
      // const paymentIntent = event.data.object;
      // const paymentIntentId = paymentIntent.id;

      // //Getting Session metadata
      // const session = await stripeInstance.checkout.sessions.list({
      //   payment_intent: paymentIntentId,
      // });
      const sessionId = event.data.object.id;
      const session = await stripeInstance.checkout.sessions.retrieve(
        sessionId
      );

      const { userId, orderId } = session.metadata;

      // const { userId, orderId } = session.data[0].metadata;

      //Mark Payment as Paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });

      //Clear Cart User
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //Getting Session metadata

      const sessionId = event.data.object.id;
      const session = await stripeInstance.checkout.sessions.retrieve(
        sessionId
      );

      const { userId, orderId } = session.metadata;

      //Delete the order because payment failes

      await Order.findByIdAndDelete(orderId);
      break;
    }
    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }

  response.json({ received: true });
};
