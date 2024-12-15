import User from "../models/user.model.js";
import bycryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
//console.log(req.body);

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bycryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.json("SignUp Successful!");
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
