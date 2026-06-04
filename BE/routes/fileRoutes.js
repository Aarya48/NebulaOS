const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createFolder,
  createFile,
  getFiles,
} = require("../controllers/fileController");

const router = express.Router();


router.post(
  "/folder/create",authMiddleware,createFolder
);


router.post("/file/create",authMiddleware,createFile
);


router.get(
  "/",authMiddleware,getFiles
);

module.exports = router;