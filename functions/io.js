/**
 * Created by jovinbm on 1/4/15.
 */

/*Defines functions to deal with emitting
 * io events*/

var basic = require('../functions/basic.js');

module.exports = {

    //this funtion emits an event to the respective user
    emitToOne: function (socketRoom, io, serverEvent, content, success) {
        basic.consoleLogger("io.emitToOne: Function 'emitToOne' called");
        io.sockets.in(socketRoom).emit(serverEvent, content);
        if(success){
            success();
        }
    },


    //this function emits an event to all connected users
    emitToAll: function (io, serverEvent, content, success) {
        basic.consoleLogger("io.emitToAll: Function 'emitToAll' called");
        io.emit(serverEvent, content);
        if(success){
            success();
        }
    }

};