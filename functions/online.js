/**
 * Created by jovinbm on 12/25/14.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var ioJs = require('../functions/io.js');
var usersOnline = {};
//to help with indexing socketIds. This links a socket id to a specific room
var socketIdIndex = {};

/*usersOnline looks like this
 usersOnline = {
 "socketRoom": {
 "socketId" : [Array of all socket Ids],
 customUsername: string
 }
 and so on
 }*/

module.exports = {

    addUser: function (room, userObject, success) {
        var user = usersOnline[room];
        if (!user) {
            usersOnline[room] = userObject;
        } else {
            usersOnline[room].socketId = usersOnline[room].socketId.concat(userObject.socketId);
        }
        //add them to the socketId index for faster searching later
        socketIdIndex[userObject.socketId[0]] = room;
        ioJs.emitToAll("usersOnline", usersOnline, success);
    },

    removeUser: function (socketId, socketRoom, success) {
        if (socketId) {
            //get key from socketId Index
            var key = socketIdIndex[socketId];
            if (usersOnline[key]) {
                if (usersOnline[key].socketId.length < 2) {
                    delete usersOnline[key];
                    //emit the current usersOnline object
                    ioJs.emitToAll("usersOnline", usersOnline);
                } else {
                    var idArray = usersOnline[key].socketId;
                    usersOnline[key].socketId.splice(idArray.indexOf(socketId), 1);
                }
            }
        } else if (socketRoom) {
            if (usersOnline[socketRoom]) {
                delete usersOnline[socketRoom];
                //emit the current usersOnline object
                ioJs.emitToAll("usersOnline", usersOnline);
            }
        }

        if (success) {
            success();
        }
    },

    getUsersOnline: function () {
        return usersOnline;
    }
};