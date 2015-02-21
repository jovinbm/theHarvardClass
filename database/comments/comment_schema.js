/**
 * Created by jovinbm on 1/16/15.
 */
//import modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    uniqueId: {type: String, required: true, unique: true, index: true},
    questionIndex: {type: Number, default: 0, required: true, unique: false, index: true},
    commentIndex: {type: Number, default: 0, required: true, unique: false, index: true},
    senderName: {type: String, required: true, unique: false, index: true},
    senderDisplayName: {type: String, required: true, unique: false, index: true},
    senderEmail: {type: String, required: true, unique: false, index: true},
    senderCuid: {type: String, required: true, unique: false, index: true},
    comment: {type: String, required: true},
    shortComment: {type: String, required: true},
    promotes: {type: Number, default: 0, index: true},
    timePosted: {type: Date, default: Date.now, index: true},
    lastActivity: {type: Date, default: Date.now, index: true}
});

module.exports = commentSchema;