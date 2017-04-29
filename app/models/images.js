const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImagesShema = new Schema({
    kind: {
        type: String,
        enum: ['thumbnail', 'detail'],
        required: true
    },
    url: { type: String, required: true }
});

module.exports = mongoose.model('Images', ImagesShema);
