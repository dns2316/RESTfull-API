const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientShema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
}); // frontend client: react.js

module.exports = mongoose.model('Client', ClientShema);
