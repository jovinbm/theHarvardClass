/**
 * Created by jovinbm on 1/12/15.
 */
var email = require("emailjs");
var mailServer = email.server.connect({
    user: "jovinbeda@gmail.com",
    password: "uxccpufouacqxrzm",
    host: "smtp.gmail.com",
    ssl: true
});
var basic = require('../functions/basic.js');
var basic_handlers = require('../handlers/basic_handlers.js');
var userDB = require('../db/user_db.js');


module.exports = {
    sendEmail: function (req, res) {
        res.redirect('login.html');
        var message = {
            text: "Name: " + req.body.name + ", Email: " + req.body.email + ", Message: " + req.body.message,
            from: req.body.email,
            to: "jovinbeda@gmail.com",
            subject: "HARVARDCLASS WEBSITE"
        };
        mailServer.send(message, function (err) {
            basic.consoleLogger(err || "EMAIL: Message sent to jovinbeda@gmail.com");
        });
    },


    getSocketRoom: function (req, res) {
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: "ERROR: getMyRoomGET: Could not retrieve user:"});
                basic.consoleLogger("ERROR: getMyRoomGET: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                res.send({
                    socketRoom: theHarvardUser.socketRoom,
                    customUsername: theHarvardUser.customUsername,
                    uniqueCuid: theHarvardUser.uniqueCuid
                });
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    startUp: function (req, res) {
        basic.consoleLogger('STARTUP event received');
        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'readyPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: readyPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                basic_handlers.startUp(req, res, theHarvardUser);
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    reconnect: function (req, res) {
        basic.consoleLogger('RECONNECT event received');
        var page = req.body.page;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'reconnectPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: reconnectPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                basic_handlers.reconnect(req, res, theHarvardUser, page);
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    }
};