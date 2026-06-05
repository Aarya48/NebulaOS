const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createFolder,
  createFile,
  getFiles,getFolderContent,rename,deleteItem,moveItem,
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
router.get('/folder/:folderId',authMiddleware,getFolderContent)
router.put("/:id",authMiddleware,rename);

router.delete("/:id",authMiddleware,deleteItem);
router.put("/move/:id",authMiddleware,moveItem);

module.exports = router;