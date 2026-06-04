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

module.exports = {
  createFolder,getFiles,createFile
};