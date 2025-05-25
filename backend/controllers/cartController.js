import User from "../models/User.js";

// Update UserCart Data :/api/cart/update

export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { cartItems });

    return res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
