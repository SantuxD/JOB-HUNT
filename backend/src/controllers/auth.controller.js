const User = require("../models/User.modals");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      avatar,
      role,
      companyName,
      companyDescription,
      companyLogo,
      resume,
    } = req.body;

    console.log("Email from body:", req.body.email);

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fileds are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      role,
      avatar,
      companyName,
      companyDescription,
      companyLogo,
      resume,
    });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      avatar: newUser.avatar,
      token: generateToken(newUser._id),
      companyName: newUser.companyName || "",
      companyDescription: newUser.companyDescription || "",
      companyLogo: newUser.companyLogo || "",
      resume: newUser.resume || "",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or Password",
      });
    }
    res.status(200).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      resume: user.resume || "",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select("-password");
   
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      massage: "error fetching user info" + error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
