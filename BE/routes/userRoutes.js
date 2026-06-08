const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  updateWallpaper,
  getWallpaper,
} = require("../controllers/userController");

router.put(
  "/wallpaper",
  authMiddleware,
  upload.single("wallpaper"),
  updateWallpaper
);

router.get(
  "/wallpaper",
  authMiddleware,
  getWallpaper
);

module.exports = router;