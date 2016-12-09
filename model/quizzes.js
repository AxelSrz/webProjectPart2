var mongoose = require('mongoose');
var quizSchema = new mongoose.Schema({
  title: String,
  questions: [Number]
});
mongoose.model('Quiz', quizSchema);
