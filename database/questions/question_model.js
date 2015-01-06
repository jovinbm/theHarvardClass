var mongoose = require('mongoose');
var questionSchema = require('./question_schema.js');

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;