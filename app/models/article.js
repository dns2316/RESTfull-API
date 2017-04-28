const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleShema   = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean
});

module.exports = mongoose.model('Article', ArticleShema);
