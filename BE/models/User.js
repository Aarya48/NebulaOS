const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        wallpaper: {
            type: String,
            default: "/wallpapers/default.jpg",
        },

        theme: {
            type: String,
            default: "light",
        },
       
},
    
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);