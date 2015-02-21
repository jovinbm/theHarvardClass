/**
 * Created by jovinbm on 1/18/15.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var Comment = require("../database/comments/comment_model.js");
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");

module.exports = {

    getLatestCommentIndex: function (questionIndex, sort, limit, error_neg_1, error_0, success) {
        Comment.find({questionIndex: questionIndex}, {commentIndex: 1})
            .sort({commentIndex: sort})
            .limit(limit)
            .exec(function (err, result) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (result == null || result == undefined || result.length == 0) {
                    error_0(0);
                } else {
                    success(result);
                }
            });
    },


    makeNewComment: function (commentObject, commentIndex, theHarvardUser, success) {
        var comment = new Comment({
            uniqueId: "q" + commentObject.questionIndex + "c" + commentIndex,
            questionIndex: commentObject.questionIndex,
            commentIndex: commentIndex,
            senderName: theHarvardUser.customUsername,
            senderDisplayName: theHarvardUser.displayName,
            senderEmail: theHarvardUser.email,
            senderCuid: theHarvardUser.uniqueCuid,
            comment: commentObject.comment,
            shortComment: commentObject.shortComment,
            promotes: 0
        });
        success(comment);
    },


    makeCommentUpdate: function (commentObject, success) {
        var comment = new Comment({
            comment: commentObject.comment,
            shortComment: commentObject.shortComment,
            "lastActivity": new Date()
        });
        success(comment);
    },


    saveNewComment: function (commentObject, error_neg_1, error_0, success) {
        commentObject.save(function (err, savedComment) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                //this returns an object. Make an array out of it
                var temp = [];
                temp.push(savedComment);
                success(temp);
            }
        });
    },

    updateComment: function (commentObject, commentUniqueId, error_neg_1, error_0, success) {
        Comment.update({uniqueId: commentUniqueId},
            {
                $set: {
                    comment: commentObject["comment"],
                    shortComment: commentObject["shortComment"],
                    lastActivity: commentObject["lastActivity"]
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            })
    },


    pushCommentToCommenter: function (openId, commentObject, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
            $addToSet: {postedCommentUniqueIds: commentObject[0].uniqueId}
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(commentObject);
            }

        });
    },


    pushPromoteToUser: function (openId, questionIndex, uniqueId, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $addToSet: {promotedCommentsUniqueIds: uniqueId}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    pullPromoteFromUser: function (openId, questionIndex, uniqueId, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $pull: {promotedCommentsUniqueIds: uniqueId}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    changeCommentPromotes: function (uniqueId, inc, error_neg_1, error_0, success) {
        Comment.update({uniqueId: uniqueId}, {$inc: {promotes: inc}}, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        })
    },


    getComments: function (sort, questionIndex, lastCommentIndex, limit, error_neg_1, error_0, success) {
        Comment
            .find({questionIndex: questionIndex, commentIndex: {$gt: lastCommentIndex}})
            .sort({commentIndex: sort})
            .limit(limit)
            .exec(function (err, comments) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (comments == null || comments == undefined || comments.length == 0) {
                    error_0(0);
                } else {
                    success(comments);
                }
            });
    },


    getOneComment: function (commentUniqueId, error_neg_1, error_0, success) {
        Comment
            .find({uniqueId: commentUniqueId})
            .limit(1)
            .exec(function (err, comment) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (comment == null || comment == undefined || comment.length == 0) {
                    error_0(0);
                } else {
                    success(comment);
                }
            });
    },


    findTopPromotedComments: function (sort, limit, questionIndex, error_neg_1, error_0, success) {
        Comment.find({
            questionIndex: questionIndex,
            promotes: {$gt: 0}
        }).sort({votes: sort}).limit(limit).exec(function (err, topPromotedArrayOfObjects) {
            if (err) {
                error_neg_1(-1, err);
            } else if (topPromotedArrayOfObjects.length == 0) {
                error_0(0);
            } else {
                success(topPromotedArrayOfObjects);
            }
        });
    }


};
