const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answer = require('./answer');

const QuestionAndAnswerShema   = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  answer: [answer],
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }],
  hidden: Boolean
});

// validation
ArticleShema.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('QuestionAndAnswer', QuestionAndAnswerShema);
