import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "Fill out all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log(`Error in singup controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log(`Error in login controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(`Error in logout controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile Pic is required" });
    }

    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadRes.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(`Error in updateProfile controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuthentication = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.log(`Error in checkAuthentication controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
