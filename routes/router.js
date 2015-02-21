/**
 * Created by jovinbm on 12/25/14.
 */
var basic = require('../functions/basic.js');
var userDB = require('../db/user_db.js');

module.exports = {
    loginHtml: function (req, res) {
        if (req.user) {
            res.redirect("login1.html");
        } else {
            res.render('login');
        }
    },

    loginNewHtml: function (req, res) {
        if (req.user) {
            res.redirect("login1.html");
        } else {
            res.render('loginNew');
        }
    },


    login_1_Html: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.loog_1_Html: getting customLoggedInStatus: " + err);
                res.redirect("login.html");
            }
        }

        function success(theHarvardUser) {
            //if logged in in both harvard and custom login take them to chat directly
            if (req.user && theHarvardUser.customLoggedInStatus == 1) {
                res.redirect('chat.html');
            }
            else if (req.user) {
                res.render('login1', {displayName: 'Hello, ' + theHarvardUser.displayName});
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    studentLogin: function (req, res) {
        //if user got here without doing a harvard login, redirect them back to harvard login
        if (!req.user) {
            res.redirect("login.html");
        }

        //get the customLoggedInStatus
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.login_1_Html: " + err);
                res.redirect("login.html");
            }
        }

        function success(theHarvardUser) {
            function successUpdate() {
                res.redirect("chat.html");
            }

            //if logged in in both harvard and custom login take them to chat directly
            if (req.user && theHarvardUser.customLoggedInStatus == 1) {
                res.redirect('chat.html');
            } else {
                userDB.updateCuCls(req.user.id, req.body.customUsername, 1, error, error, successUpdate)
            }
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    chatHtml: function (req, res) {
        //get the customUsername
        function error(status, err) {
            if (status == -1 || status == 0) {
                basic.consoleLogger("ERROR: exports.chatHtml: " + err);
                res.redirect("login.html");
            }
        }

        function success(theHarvardUser) {
            if (req.user && theHarvardUser.customLoggedInStatus == 1) {
                res.render('chat');
            } else if (req.user) {
                res.redirect("login1.html");
            } else {
                res.redirect("login.html");
            }
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    }
};