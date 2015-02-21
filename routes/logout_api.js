/**
 * Created by jovinbm on 1/12/15.
 */
var basic = require('../functions/basic.js');
var logout_handler = require('../handlers/logout_handler.js');
var userDB = require('../db/user_db.js');


module.exports = {
    logoutHarvardLogin: function (req, res) {
        basic.consoleLogger('LOGOUT HARVARD LOGIN event received');
        logout_handler.logoutHarvardLogin(req, res);
    },


    logoutCustomChat: function (req, res) {
        basic.consoleLogger('LOGOUT CUSTOM CHAT event received');
        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: logoutCustomChatPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: logoutCustomChatPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.logoutCustomChat(req, res, theHarvardUser);
            }

            userDB.toggleCls(req.user.id, 0, error, error, toggled);
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    logoutHarvardChat: function (req, res) {
        basic.consoleLogger('LOGOUT HARVARD CHAT event received');
        /*no need to complete the ajax request -- user will be redirected to login which has it's
         own js file*/
        //retrieve the user
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: logoutHarvardChatPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: logoutHarvardChatPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            //toggle the user's customLoggedInStatus
            function toggled() {
                logout_handler.logoutHarvardChat(req, res, theHarvardUser);
            }

            //userDB.toggleCls(req.user.id, 0, error, error, toggled);
            toggled();
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    }
};