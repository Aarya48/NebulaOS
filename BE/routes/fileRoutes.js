const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createFolder,
  createFile,
  getFiles,getFolderContent,rename,deleteItem,moveItem,searchFiles,changeFavorite,getFavorites,getRecentFiles,openFile,getTrashFiles,restoreFile,permanentDelete,updateContent,serveFile,runCode
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
router.get('/serve/:folderId/:filename', serveFile);
router.post('/run', authMiddleware, runCode);
router.put("/:id",authMiddleware,rename);

router.delete("/:id",authMiddleware,deleteItem);
router.put("/move/:id",authMiddleware,moveItem);
router.get("/search",authMiddleware,searchFiles);
router.put("/favorite/:id",authMiddleware,changeFavorite);  
router.get("/favorite",authMiddleware,getFavorites);
router.get("/recent",authMiddleware,getRecentFiles);
router.put("/open/:id",authMiddleware,openFile);
router.put("/content/:id",authMiddleware,updateContent);

router.get(
  "/trash",
  authMiddleware,
  getTrashFiles
);

router.put(
  "/restore/:id",
  authMiddleware,
  restoreFile
);

router.delete(
  "/permanent/:id",
  authMiddleware,
  permanentDelete
);
module.exports = router;