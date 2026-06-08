const File = require("../models/File");

const createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const folder = await File.create({
      owner: req.user.id,
      name,
      type: "folder",
      parentFolder: parentFolder || null,
    });

    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      folder,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isDeleted:false,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getTrashFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isDeleted: true,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const createFile=async (req,res)=>{
    try{
        const {name,parentFolder,content}=req.body;
if (!name) {
      return res.status(400).json({
        success: false,
        message: "File name is required",
      });
    }
    const file=await File.create({
        owner:req.user.id,
        type:"file",
        name,
        content:content||"",
        parentFolder:parentFolder||null
    })
    res.status(201).json({
        success:true,
        message:"File created successfully",
file,
    })
}
    catch(error){
res.status(500).json({
    success:false,
    message:error.message,
})
    }
    

}


const restoreFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    file.isDeleted = false;

    await file.save();

    res.status(200).json({
      success: true,
      message: "File restored successfully",
      file,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const getFolderContent = async (req, res) => {
  const { folderId } = req.params;

  try {
    const files = await File.find({
      owner: req.user.id,
      parentFolder: folderId,
      isDeleted:false,
    });

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const permanentDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: "File permanently deleted",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const rename=async (req,res)=>{
  const {id}=req.params;
  const {name}=req.body;
  try{
const file=await File.findById(id);
if(!file){
  return res.status(404).json({
    success:false,
    message:"file not found",
  })
}
if(!name){
  return res.status(400).json({
    success:false,
    message:"Name is required",
  })
}
if(file.owner.toString()!=req.user.id){
  return res.status(403).json({
    success:false,
    message:"Unauthorized",
  });
  
}
file.name=name;
  await file.save();
  res.status(200).json({
    success:true,
    message:"File renamed successfully",
    file,
  })
  }
  catch(error){
res.status(500).json({
    success:false,
    message:error.message,
})
  }
}



const deleteFolderRecursively = async (folderId) => {
  const children = await File.find({
    parentFolder: folderId,
  });

  for (const child of children) {
    if (child.type === "folder") {
      await deleteFolderRecursively(child._id);
    }

   child.isDeleted = true;
await child.save();

  }
  const folder = await File.findById(folderId);

folder.isDeleted = true;
await folder.save();
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

  
    if (file.type === "folder") {
      await deleteFolderRecursively(file._id);
    }

  file.isDeleted=true;
await file.save();
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const moveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { parentFolder } = req.body;
if (parentFolder) {
   const destinationFolder = await File.findById(parentFolder);

   if (!destinationFolder) {
      return res.status(404).json({
         success: false,
         message: "Destination folder not found"
      });
   }

   if (destinationFolder.type !== "folder") {
      return res.status(400).json({
         success: false,
         message: "Destination must be a folder"
      });
   }
}

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (file.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
    file.parentFolder = parentFolder || null;

    await file.save();

    res.status(200).json({
      success: true,
      message: "File moved successfully",
      file,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const searchFiles=async (req,res)=>{
  const {q} =req.query;
  
  try{
if(!q){
  return res.status(400).json({
    success:false,
    message:"Search query is required",
  })
}
const files = await File.find({
  owner: req.user.id,
  isDeleted: false,
  name: {
    $regex: q,
    $options: "i",
  }
});

res.status(200).json({
  success:true,
  count:files.length,
  files,
})

  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message,
    })
  }
}


const changeFavorite=async (req,res)=>{
  const {id}=req.params;
  try{
const file=await File.findById(id);
if(!file){
  return res.status(404).json({
    success:false,
    message:"file not found",
  })
}
if(file.owner.toString()!=req.user.id){
  return res.status(403).json({
    success:false,
    message:"Unauthorized",     
  })
}
file.isFavorite=!file.isFavorite;
await file.save();
res.status(200).json({
  success:true,
  message:file.isFavorite?"File marked as favorite":"File removed from favorites",
  file,
})
  }
  catch(error){
    res.status(500).json({
      success:false,
      message:error.message,
    })
  }
}


const getFavorites=async (req,res)=>{

  try{
    const files=await File.find({
      owner:req.user.id,
      isFavorite:true,
      isDeleted:false,
    })
res.status(200).json({
      success:true,
      files,
    })
  }
  catch(err){
res.status(500).json({
  success:false,
 
  message:err.message,
})
  }
}


const openFile=async (req,res)=>{
  const {id}=req.params;
  try{
    const file=await File.findById(id);
    if (!file) {
  return res.status(404).json({
    success: false,
    message: "File not found",
  });
}

if (file.owner.toString() !== req.user.id) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized",
  });
}
    file.lastOpened=new Date();
    await file.save();
    res.status(200).json({
      success:true,
      message:"File opened successfully",
      file,
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message,
    })
  }
}


const getRecentFiles = async (req, res) => {
  try {
    const files = await File.find({
      owner: req.user.id,
      isDeleted:false,
      lastOpened: { $ne: null }
    })
    .sort({ lastOpened: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateContent = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "file not found",
      });
    }
    if (file.owner.toString() != req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    file.content = content || "";
    await file.save();
    res.status(200).json({
      success: true,
      message: "File updated successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const serveFile = async (req, res) => {
  try {
    const { folderId, filename } = req.params;
    const parentFolder = folderId === 'root' ? null : folderId;
    const file = await File.findOne({ parentFolder, name: filename, isDeleted: false });
    if (!file) {
      return res.status(404).send('File not found');
    }
    const ext = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'txt': 'text/plain'
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
    res.send(file.content || '');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.serveFile = serveFile;

const runCode = async (req, res) => {
  try {
    const { language, files, stdin } = req.body;
    const response = await fetch('https://onecompiler.com/api/code/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: { language, files, stdin } })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ exception: 'Proxy Error: ' + error.message });
  }
};

exports.runCode = runCode;

module.exports = {
  createFolder,
  createFile,
  getFiles,
  getFolderContent,
  rename,
  deleteItem,
  moveItem,
  searchFiles,
  changeFavorite,
  getFavorites,
  getRecentFiles,
  openFile,
  getTrashFiles,
  restoreFile,
  permanentDelete,
  updateContent,
  serveFile,
  runCode
};
