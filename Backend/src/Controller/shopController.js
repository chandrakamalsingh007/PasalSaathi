import shopModel from "../Model/shopModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import sendMail from "../services/mailSender.js";
import validatePhoneNumber from "nepali-phone-number-validator";
import dotenv from "dotenv";
dotenv.config();

// register user
const registerShop = async (req, res) => {
  const {
    shopName,
    ownerName,
    email,
    phone,
    ownerAddress,
    shopAddress,
    password,
  } = req.body;
  
  if (
    !shopName ||
    !ownerName ||
    !email ||
    !phone ||
    !ownerAddress ||
    !shopAddress ||
    !password
  ) {
    res.status(400).json({
      message: "Please provide all data",
    });
    return;
  }
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  }

  if(!validatePhoneNumber(phone)){
    return res.json({ success: false, message: "Please enter a valid Phone No." });
  }
  const exits = await shopModel.findOne({ email });

  if (exits) {
    return res.json({ success: false, message: "User already exits" });
  }

  if (password.length < 8) {
    return res.json({
      success: false,
      message: "Please enter a strong password",
    });
  }

  const newShop = await shopModel.create({
    shopName: shopName,
    ownerName: ownerName,
    email: email,
    phone: phone,
    ownerAddress: ownerAddress,
    shopAddress: shopAddress,
    password: bcrypt.hashSync(password, 10),
  });

  if (!newShop) {
    res.status(403).json({
      message: "register fail in database creation",
    });
    return;
  }

  const data = {
    from: "chandrakamalsingh007@gmail.com",
    to: email,
    subject: "Thank you for registering..!",
    text: "We are very grateful that you choose us. Thank you !!",
  };
  sendMail(data);

  res.status(200).json({
    success: true,
    message: "Shop register successfully !!",
  });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Please enter email and password",
    });
    return;
  }
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please enter a valid email" });
  }

  const findShop = await shopModel.findOne({ email: email });
  if (!findShop) {
    return res.status(404).json({
      success: false,
      message: "User not found !!",
    });
  }
  const checkPassword = bcrypt.compareSync(password, findShop.password);
  if (!checkPassword) {
    return res.status(401).json({
      message: "password is incorrect",
    });
  }

  const token = jwt.sign(
    {
      userId: findShop._id,
      email: findShop.email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10d",
    }
  );
  res.json({
    message: "login Successful",
    token: token,
  });
};

export { loginUser, registerShop };
