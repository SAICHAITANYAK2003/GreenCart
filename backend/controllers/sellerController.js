import jwt from "jsonwebtoken";
//SELLER LOGIN  : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Admin Details Not Found" });
    }

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "7d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true, //Prevent Jacasript to access cookie
        secure: process.env.NODE_ENV === "production", //Use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF Protection

        maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
      });

      return res.json({ success: true, message: "Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid Admin Credentials" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//checkAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Seller Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
