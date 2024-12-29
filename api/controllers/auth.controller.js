import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required!"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("SignUp Successful!");
  } catch (error) {
    next(error);
  }
};

// Signin controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid Password!"));
    }

    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google controller
export const google = async (req, res, next) => {
  const { email, name, googlePhotoURL } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id , isAdmin: user.isAdmin}, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", 
        })
        .json(rest);
    }

    // Generate a random password and username for new users
    const generatedPassword = bcrypt.hashSync(
      Math.random().toString(36).slice(-12),
      10
    );

    const newUser = new User({
      username: `${name.toLowerCase().replace(/\s+/g, "")}${Math.random()
        .toString()
        .slice(-4)}`,
      email,
      password: generatedPassword,
      profilePicture: googlePhotoURL,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id , isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
