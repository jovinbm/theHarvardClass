/**
 * Created by jovinbm on 1/18/15.
 */
var basic = require('../functions/basic.js');
var comment_handler = require('../handlers/comment_handler.js');
var userDB = require('../db/user_db.js');

module.exports = {


    getComments: function (req, res) {
        basic.consoleLogger('GET_COMMENTS event received');
        var questionIndex = req.body.questionIndex;
        var lastCommentIndex = req.body.lastCommentIndex;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'getCommentsPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: getCommentsPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                comment_handler.getComments(req, res, theHarvardUser, questionIndex, lastCommentIndex);
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    newComment: function (req, res) {
        basic.consoleLogger('NEW_COMMENT event received');
        var theComment = req.body;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: newCommentPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: newCommentPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                comment_handler.newComment(req, res, theHarvardUser, theComment);
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    updateComment: function (req, res) {
        basic.consoleLogger('UPDATE_COMMENT event received');
        var theComment = req.body;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: updateCommentPOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: updateCommentPOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                comment_handler.updateComment(req, res, theHarvardUser, theComment);
            }
            //TODO -- redirect to custom login
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    },


    promote: function (req, res) {
        basic.consoleLogger('PROMOTE event received');
        var questionIndex = req.body.questionIndex;
        var promoteIndex = req.body.commentIndex;
        var inc = req.body.inc;
        var uniqueId = req.body.uniqueId;

        function error(status, err) {
            if (status == -1 || status == 0) {
                res.status(500).send({msg: 'ERROR: promotePOST: Could not retrieve user', err: err});
                basic.consoleLogger("ERROR: promotePOST: Could not retrieve user: " + err);
            }
        }

        function success(theHarvardUser) {
            if (theHarvardUser.customLoggedInStatus == 1) {
                if (inc == -1 || theHarvardUser.promotedCommentsUniqueIds.indexOf(uniqueId) == -1) {
                    comment_handler.promote(req, res, theHarvardUser, questionIndex, promoteIndex, inc, uniqueId);
                } else {
                    //promote process did not pass checks
                    res.status(200).send({msg: 'promote did not pass checks'});
                    basic.consoleLogger('promote: Not executed: Did not pass checks');
                }
            } else {
                //TODO -- redirect to login
            }
        }

        userDB.findHarvardUser(req.user.id, error, error, success);
    }

};