var mongoose = require('mongoose');
var userSchema = require('./harvard_user_schema.js');

var HarvardUser = mongoose.model('HarvardUser', userSchema);
module.exports = HarvardUser;