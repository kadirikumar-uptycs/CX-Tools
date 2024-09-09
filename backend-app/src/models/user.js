const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    shift: {
        type: String,
        enum: ["IND", "US"],
        required: true
    },
    profileImage: {
        type: String
    },
    roles: {
        type: [mongoose.Schema.Types.String],
        default: ['User']
    },
    notifications: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
},
    {
        timestamps: true,
        collection: 'Users'
    })

module.exports = mongoose.model("User", userSchema, 'Users');