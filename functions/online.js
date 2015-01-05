/**
 * Created by jovinbm on 12/25/14.
 */
var Question = require("../database/questions/question_model.js");
var basic = require('../functions/basic.js');

module.exports = {
    
    //this function keeps track of an array that contains names of all online users
    addToUsersOnline: function (onlineObject, r_username) {
        basic.consoleLogger("f.addOnline: Function 'addOnline' called with username " + r_username);
        var date = new Date();
        var microSeconds = date.getTime();

        var index = basic.indexArrayObject(onlineObject, "customUsername", r_username);
        if(index != -1){
            //means user is there in the array with 'index' = index. so just update time
            onlineObject[index].time = microSeconds;
        }else{
            //index == -1 so user is not there. Add the user
            var user = {
                "customUsername": r_username,
                "time": microSeconds
            };
            onlineObject.push(user);
        }
    },

    //this function removes a person who either logged out or connection closed from the online object
    removeFromUsersOnline: function (onlineObject, username) {
        basic.consoleLogger("f.removeOnline: Function 'removeOnline' called with username " + username);
        var index = onlineObject.map(function(user) {
            return user.customUsername;
        }).indexOf(username);
        onlineObject.splice(index, 1);
    }

};