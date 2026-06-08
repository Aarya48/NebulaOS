const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const updateWallpaper = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Wallpaper image is required",
      });
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "nebula-wallpapers",
      }
    );

    user.wallpaper = result.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Wallpaper updated successfully",
      wallpaper: user.wallpaper,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getWallpaper = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      wallpaper: user.wallpaper,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  updateWallpaper,
  getWallpaper,
};