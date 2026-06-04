const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["file", "folder"],
      required: true,
    },

    content: {
      type: String,
      default: "",
    },

    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", fileSchema);