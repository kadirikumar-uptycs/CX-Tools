const mongoose = require('mongoose');

const credentialsSchema = new mongoose.Schema({
    github: {
        id: String,
        username: String,
        profileImage: String,
        accessToken: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
    collection: 'Credentials'
});

module.exports = mongoose.model('Credentials', credentialsSchema);