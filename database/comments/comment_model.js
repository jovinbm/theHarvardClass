/**
 * Created by jovinbm on 1/16/15.
 */
//import modules
var mongoose = require('mongoose');
var commentSchema = require('./comment_schema.js');

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;