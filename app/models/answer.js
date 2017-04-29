const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerShema = new Schema({
  author: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }]
});

module.exports = mongoose.model('Answer', AnswerShema);
