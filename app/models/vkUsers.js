const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');

const vkUserShema = new Schema({
    vkontakteId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    email: {
        type: String,
        unique: true
    },
    photo: {
        type: String
    },
    info: {
      type: Array
    },
    created: {
        type: Date,
        default: Date.now
    }
});

vkUserShema.plugin(findOrCreate);

module.exports = mongoose.model('vkUser', vkUserShema);
