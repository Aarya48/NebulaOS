const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  wallpaper: {
    type: String,
    default: "/wallpapers/default.jpg"
  },

  theme: {
    type: String,
    default: "light"
  },

  desktopIcons: [{
    name: String,
    type: String,
    x: Number,
    y: Number
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

//schema

const fileSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  name: String,

  type: {
    type: String,
    enum: ["file", "folder"]
  },

  content: String,

  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


//schema

openedApps: [{
  appName: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  minimized: Boolean
}]