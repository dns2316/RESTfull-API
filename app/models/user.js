const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserShema.virtual('userId')
    .get(function () {
        return this.id;
    });

module.exports = mongoose.model('User', UserShema);
