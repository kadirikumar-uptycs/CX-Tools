const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: 'User',
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    profileImage: {
        type: String
    },
},
    {
        timestamps: true,
        collection: 'Users'
    })

module.exports = mongoose.model("User", userSchema, 'Users');