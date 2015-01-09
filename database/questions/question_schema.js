/**
 * Created by jovinbm on 12/27/14.
 */
//import modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    questionIndex: {type: Number, default: 0, required: true, unique: true, index: true},
    senderName: {type: String, required: true, unique: false, index: true},
    senderDisplayName: {type: String, required: true, unique: false, index: true},
    senderEmail: {type: String, required: true, unique: false, index: true},
    senderOpenId: {type: String, required: true, unique: false, index: true},
    question: {type: String, required: true},
    shortQuestion: {type: String, required: true},
    votes: {type: Number, default: 0, index: true},
    timeAsked: {type: Date, default: Date.now, index: true}
});

module.exports = questionSchema;