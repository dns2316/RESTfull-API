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

const ArticleShema   = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  images: [ImagesShema],
  date: { type: Date, default: Date.now }, // not send to client
  modified: { type: Date, default: Date.now }, // not send to client
  comments: [{ body: String, date: Date }],
  hidden: Boolean
});

// validation
ArticleShema.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('Article', ArticleShema);
