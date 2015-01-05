/**
 * Created by jovinbm on 12/29/14.
 */
//import modules
var mongoose = require('mongoose');
var userSchema = require('./harvard_user_schema.js');

var HarvardUser = mongoose.model('HarvardUser', userSchema);
module.exports = HarvardUser;