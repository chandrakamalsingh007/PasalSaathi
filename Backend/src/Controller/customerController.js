import shopModel from "../Model/shopModel.js";
import customerModel from "../Model/customerModel.js";
import hashids from "../services/hashIds.js";

const addCustomer = async (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    const selectedShop = await shopModel.findOne({
      _id: req.user.id,
      email: req.user.email,
    });

    if (!selectedShop) {
      return res.status(403).json({ message: "Unauthorized or invalid shop." });
    }
    const lastCustomer = await customerModel
      .findOne({ shop: req.user.id })
      .sort({ customerNo: -1 });

    const newCustomerNo = lastCustomer ? lastCustomer.customerNo + 1 : 1;
    const hashId = hashids.encode(newCustomerNo);

    const addCustomer = await customerModel.create({
      name: name,
      email: email,
      phone: phone,
      address: address,
      shop: req.user.id,
      customerNo: newCustomerNo,
      hashedId: hashId,
    });

    

    res.status(200).json({
      success: true,
      message: "Customer added successfully",
      customer: {
        ...addCustomer.toObject(),
        hashId: hashId,
      },
    });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding customer",
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find({ shop: req.user.id });
    if(!customers || customers.length === 0){
        res.status(404).json({
            success:false,
            message:"No customers found for this shop."
        })
    }

    const allCustomers = customers.map((customer) => {
      return {
        ...customer.toObject(),
      };
    });

    res.status(200).json({
      success: true,
      customers: allCustomers,
    });
  } catch (err) {
    console.error("Error fetching customers:",err.message);
    res.status(500).json({
      success: false,
      message: "Error fetching customers",
    });
  }
};

const getCustomerById = async (req, res) => {
  const { hashId } = req.params;
  if (!hashId) {
    return res.status(400).json({
      message: "Customer hashId is required !!",
    });
  }

  const customerNo = hashids.decode(hashId)[0];
  if (!customerNo) {
    return res.status(400).json({
      message: "Customer No is not decoded !!",
    });
  }
  const customer = await customerModel.findOne({
    shop: req.user.id,
    customerNo: customerNo,
  });

  if (!customer) {
    return res.status(404).json({
      message: "Customer not found",
    });
  }
  res.status(201).json({
    success: true,
    message: "Customer found",
    customer: customer,
  });
};

export { addCustomer, getCustomerById, getAllCustomers };
