const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerShema = new Schema({
  author: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }]
});

const QuestionAndAnswerShema   = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  answer: [AnswerShema],
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }],
  hidden: Boolean
});

// validation
QuestionAndAnswerShema.path('title').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('QuestionAndAnswer', QuestionAndAnswerShema);
