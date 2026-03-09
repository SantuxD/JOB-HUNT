const userModal = require("../models/User.modals");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      avatar,
      resume,
      companyDescription,
      companyName,
      companyLogo,
    } = req.body;
    const user = await userModal.findById(req.user._id);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });
    user.fullName = fullName || user.fullName;
    user.avatar = avatar || user.avatar;
    user.resume = resume || user.resume;

    if (user.role === "admin") {
      user.companyName = companyName || user.companyName;
      user.companyDescription = companyDescription || user.companyDescription;
      user.companyLogo = companyLogo || user.companyLogo;
    }
    await user.save();
    res.json({
      _id: user._id,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      resume: user.resume || "",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

  if (!resumeUrl) {
    return res.status(400).json({
      message: "resumeUrl is required"
    });
  }


    const fileName = resumeUrl?.split("/")?.pop();
    const user = await userModal.findById(req.user.id);
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    if (user.role !== "jobseeker")
      return res.status(403).json({
        message: "Only jobseeker can delete resume",
      });
    const filePath = path.join(__dirname, "../uploads", fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    ((user.resume = ""), await user.save());
    res.json({ message: "Reasume deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const user = await userModal.findById(req.params.id).select("-password");
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  updateProfile,
  deleteResume,
  getPublicProfile,
};
