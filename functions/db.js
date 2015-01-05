/**
 * Created by jovinbm on 1/4/15.
 */

/*Define functions that interact with the database*/
var basic = require('../functions/basic.js');
var Question = require("../database/questions/question_model.js");
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");

module.exports = {


    //finds a specific Harvard User
    findHarvardUser: function (openId, error_neg_1, error_0, success) {
        HarvardUser.findOne({id: openId}).exec(
            function (err, theHarvardUser) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (theHarvardUser == null || theHarvardUser == undefined) {
                    error_0(0);
                } else {
                    success(theHarvardUser);
                }
            }
        );
    },


    saveHarvardUser: function (theUserObject, error_neg_1, error_0, success) {
        theUserObject.save(function (err, theSavedUser) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(theSavedUser);
            }
        });
    },

    updateCuCls: function (openId, customUsername, customLoggedInStatus, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $set: {
                    customUsername: customUsername,
                    customLoggedInStatus: customLoggedInStatus
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    toggleCls: function (openId, newCustomLoggedInStatus, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {$set: {customLoggedInStatus: newCustomLoggedInStatus}}).exec(function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        });
    },


    makeNewQuestion: function (questionObject, questionIndex, theHarvardUser, success) {
        var question = new Question({
            questionIndex: questionIndex,
            senderName: theHarvardUser.customUsername,
            senderDisplayName: theHarvardUser.displayName,
            senderEmail: theHarvardUser.email,
            senderOpenId: theHarvardUser.id,
            question: questionObject.question,
            shortQuestion: questionObject.shortQuestion,
            votes: 0
        });
        success(question);
    },


    saveNewQuestion: function (questionObject, error_neg_1, error_0, success) {
        questionObject.save(function (err, savedQuestion) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(savedQuestion);
            }
        });
    },


    pushQuestionToAsker: function (openId, questionObject, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
            $push: {askedQuestionsIndexes: questionObject.questionIndex}
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(questionObject);
            }

        });
    },


    getRecentQuestions: function (sort, currentQuestionIndex, limit, error_neg_1, error_0, success) {
        Question.find({questionIndex: {$gt: currentQuestionIndex}}).sort({questionIndex: sort}).limit(limit).exec(function (err, history) {
            if (err) {
                error_neg_1(-1, err);
            } else if (history == null || history == undefined || history.length == 0) {
                error_0(0);
            } else {
                success(history);
            }
        });
    },

    findTopVotedQuestions: function (sort, limit, error_neg_1, error_0, success) {
        Question.find({votes: {$gt: 0}}).sort({votes: sort}).limit(limit).exec(function (err, topVotedArrayOfObjects) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success(topVotedArrayOfObjects);
            }
        });
    },

    pushUpvoteToUpvoter: function (openId, upvotedIndex, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $push: {votedQuestionIndexes: upvotedIndex}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    incrementQuestionVotes: function (upvotedIndex, error_neg_1, error_0, success) {
        Question.update({questionIndex: upvotedIndex}, {$inc: {votes: 1}}, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        })
    }


};