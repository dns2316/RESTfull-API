const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleShema   = new Schema({
    name: String
});

module.exports = mongoose.model('Article', ArticleShema);
