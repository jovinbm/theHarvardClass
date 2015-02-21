/**
 * Created by jovinbm on 1/18/15.
 */
//import modules
var app = require('../app.js');
var Question = require("../database/questions/question_model.js");
var Comment = require("../database/comments/comment_model.js");
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var ioJs = require('../functions/io.js');
var commentDB = require('../db/comment_db.js');

module.exports = {

    newComment: function (req, res, theHarvardUser, theComment) {
        consoleLogger('newComment: NEW_COMMENT event handler called');
        var thisCommentIndex;
        //query the recent question's index
        if (!(/^\s+$/.test(theComment.comment)) &&
            theComment.comment.length != 0) {
            function save(index) {
                function made(comment) {
                    function saved(savedComment) {
                        function done(commentObject) {
                            ioJs.emitToAll('newComment', {
                                "comment": commentObject,
                                "index": 1
                            });
                            res.status(200).send({msg: 'newComment success'});
                            consoleLogger('newComment: Success');
                        }

                        commentDB.pushCommentToCommenter(req.user.id, savedComment, error, error, done);
                    }

                    commentDB.saveNewComment(comment, error, error, saved);
                }


                commentDB.makeNewComment(theComment, index, theHarvardUser, made);
            }

            function error(status, err) {
                if (status == -1) {
                    consoleLogger("ERROR: newComment event_Handler: " + err);
                    res.status(500).send({msg: 'ERROR: newComment Event Handler: ', err: err});
                    consoleLogger("newComment failed!");
                } else if (status == 0) {
                    //means this is the first comment. Save it
                    thisCommentIndex = 0;
                    save(thisCommentIndex);
                }
            }

            function success(result) {
                thisCommentIndex = result[0].commentIndex + 1;
                save(thisCommentIndex);
            }

            commentDB.getLatestCommentIndex(theComment.questionIndex, -1, 1, error, error, success);

        } else {
            //the comment does not pass the checks
            res.status(200).send({msg: 'newComment did not pass checks'});
            consoleLogger('newComment: Not executed: Did not pass checks');
        }
    },


    updateComment: function (req, res, theHarvardUser, theComment) {
        consoleLogger('updateComment: UPDATE_COMMENT event handler called');
        var commentUniqueId = theComment.commentUniqueId;
        //query the recent question's index
        if (!(/^\s+$/.test(theComment.comment)) &&
            theComment.comment.length != 0) {

            function error(status, err) {
                consoleLogger("ERROR: updateComment event_Handler: " + err);
                res.status(500).send({msg: 'ERROR: updateComment Event Handler: ', err: err});
                consoleLogger("updateComment failed!");
            }

            function made(comment) {
                function updated() {
                    function done(commentObject) {
                        ioJs.emitToAll('newComment', {
                            "comment": commentObject,
                            "index": 0
                        });
                        res.status(200).send({msg: 'updateComment success'});
                        consoleLogger('updateComment: Success');
                    }

                    commentDB.getOneComment(commentUniqueId, error, error, done);
                }

                commentDB.updateComment(comment, commentUniqueId, error, error, updated);
            }

            commentDB.makeCommentUpdate(theComment, made);

        } else {
            //the comment does not pass the checks
            res.status(500).send({msg: 'updateComment did not pass checks'});
            consoleLogger('updateComment: Not executed: Did not pass checks');
        }
    },


    promote: function (req, res, theHarvardUser, questionIndex, promoteIndex, inc, uniqueId) {
        consoleLogger("promote: promote event handler called");
        var promotedArray = theHarvardUser.postedCommentUniqueIds;
        var errorCounter = 0;
        switch (inc) {
            case 1:
                promotedArray.push(uniqueId);
                break;
            case -1:
                if (promotedArray.indexOf(uniqueId) != -1) {
                    promotedArray.splice(promotedArray.indexOf(uniqueId), 1);
                }
                break;
            default:
                errorCounter++;
                consoleLogger("ERROR: promote event handler: switch statement got unexpected value");
                res.status(500).send({
                    msg: 'ERROR: promote event handler: switch statement got unexpected value'
                });
                consoleLogger('upvote: failed!');
        }

        function error(status, err) {
            if (status == -1) {
                consoleLogger("ERROR: promote event handler: Error while executing db operations" + err);
                /*complete the request by sending the client the internal server error*/
                res.status(500).send({
                    msg: 'ERROR: promote event handler: Error while executing db operations',
                    err: err
                });
                consoleLogger('promote: failed!');
            } else if (status == 0) {
                res.status(200).send({msg: "promote:Status:200 partial ERROR: query returned null/undefined"});
                consoleLogger('**partial ERROR!:Status:200 promote event handler: failure: query returned NULL/UNDEFINED: There also might be no promoted comments');
            }
        }

        function success() {
            function done() {

                function found(topPromotedArrayOfObjects) {

                    //++++++++++++++++++++++++++++++++++
                    //TODO -implement on client side the receive of promoted (to up or down icon)
                    ioJs.emitToOne(theHarvardUser.socketRoom, 'promotesUniqueIds', promotedArray);
                    //+++++++++++++++++++++++++++++++++

                    ioJs.emitToAll('topPromoted', topPromotedArrayOfObjects);
                    res.status(200).send({msg: 'promote success'});
                    consoleLogger('promote: Success');
                }

                commentDB.findTopPromotedComments(-1, 3, questionIndex, error, error, found);
            }

            commentDB.changeCommentPromotes(uniqueId, inc, error, error, done);
        }

        switch (inc) {
            case 1:
                commentDB.pushPromoteToUser(req.user.id, questionIndex, uniqueId, error, error, success);
                break;
            case -1:
                commentDB.pullPromoteFromUser(req.user.id, questionIndex, uniqueId, error, error, success);
                break;
        }
    },


    getComments: function (req, res, theHarvardUser, questionIndex, lastCommentIndex) {
        var regexp = new RegExp("q" + questionIndex + "c.");
        var commentLimit = 30;
        consoleLogger("getComments: getComments called");
        //retrieve the comments

        function error(status, err) {
            if (status == -1) {
                consoleLogger("getComments event handler: Error while retrieving history" + err);
                res.status(500).send({msg: 'getComments: Error while retrieving top voted', err: err});
                consoleLogger('getComments: failed!');
            } else if (status == 0) {
                //send an empty array
                res.status(200).send({
                    "comments": [],
                    "index": 0,
                    "myPromotes": []
                });
                consoleLogger('getComments: success: Did not find anything');
            }
        }


        function getComments(filteredPromoted) {

            function success(comments) {
                res.status(200).send({
                    "comments": comments,
                    "index": lastCommentIndex + commentLimit,
                    "myPromotes": filteredPromoted
                });
                consoleLogger('getComments: success: Sent comments');
            }

            commentDB.getComments(-1, questionIndex, lastCommentIndex, commentLimit, error, error, success)
        }

        basic.filterArray(theHarvardUser.promotedCommentsUniqueIds, regexp, getComments)
    }

};