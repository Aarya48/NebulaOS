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

    if (req.body.reset === 'true') {
      user.wallpaper = '/wallpapers/default.jpg';
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Wallpaper reset successfully",
        wallpaper: user.wallpaper,
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

const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.theme = theme || "light";
    await user.save();

    res.status(200).json({ success: true, message: "Theme updated", theme: user.theme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, theme: user.theme, wallpaper: user.wallpaper });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  updateWallpaper,
  getWallpaper,
  updateTheme,
  getSettings,
};