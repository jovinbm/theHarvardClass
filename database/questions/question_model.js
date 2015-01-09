/**
 * Created by jovinbm on 12/27/14.
 */
//import modules
var mongoose = require('mongoose');
var questionSchema = require('./question_schema.js');

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;