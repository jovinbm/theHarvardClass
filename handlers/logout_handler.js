/**
 * Created by jovinbm on 1/18/15.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var online = require('../functions/online.js');

module.exports = {


    logoutHarvardLogin: function (req, res) {
        consoleLogger('LOGOUT HARVARD LOGIN event handler called');
        //delete the harvard cs50 ID session
        req.logout();
        //send a success so that the user will be logged out and redirected
        res.status(200).send({msg: 'LogoutHarvardLogin success'});
        consoleLogger('logoutHarvardLogin: Success');
    },


    logoutCustomChat: function (req, res, theHarvardUser) {
        consoleLogger('LOGOUT CUSTOM CHAT event handler called');

        function success() {
            res.status(200).send({msg: 'LogoutCustomChat success'});
            consoleLogger('logoutCustomChat: Success');
        }

        online.removeUser(null, theHarvardUser.socketRoom, success)
    },


    logoutHarvardChat: function (req, res, theHarvardUser) {
        consoleLogger('LOGOUT HARVARD CHAT event handler called');

        function success() {
            req.logout();
            res.status(200).send({msg: 'LogoutCustomChat success'});
            consoleLogger('logoutCustomChat: Success');
        }

        online.removeUser(null, theHarvardUser.socketRoom, success);
    }


};