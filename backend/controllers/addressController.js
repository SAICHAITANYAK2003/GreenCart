import Address from "../models/Address.js";
//Add Address : /api/address/add

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    await Address.create({
      ...address,
      userId,
    });

    return res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: true, message: error.message });
  }
};

//GET Address : /api/address/get

export const getAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId });
    return res.json({ success: true, addresses });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};
