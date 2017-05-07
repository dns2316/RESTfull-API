const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vkUserShema = new Schema({
    vkontakteId: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('vkUser', vkUserShema);
