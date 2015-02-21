/**
 * Created by jovinbm on 1/18/15.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var cuid = require('cuid');
var Question = require("../database/questions/question_model.js");
var HarvardUser = require("../database/harvardUsers/harvard_user_model.js");


module.exports = {


    makeNewQuestion: function (questionObject, questionIndex, theHarvardUser, success) {
        var question = new Question({
            uniqueId: cuid(),
            questionIndex: questionIndex,
            senderName: theHarvardUser.customUsername,
            senderDisplayName: theHarvardUser.displayName,
            senderEmail: theHarvardUser.email,
            senderCuid: theHarvardUser.uniqueCuid,
            heading: questionObject.heading,
            question: questionObject.question,
            shortQuestion: questionObject.shortQuestion,
            votes: 0
        });
        success(question);
    },

    makeQuestionUpdate: function (questionObject, theHarvardUser, success) {
        var question = {
            "heading": questionObject.heading,
            "question": questionObject.question,
            "shortQuestion": questionObject.shortQuestion,
            "lastActivity": new Date()
        };
        success(question);
    },


    saveNewQuestion: function (questionObject, error_neg_1, error_0, success) {
        questionObject.save(function (err, savedQuestion) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                //this returns an object. Make an array out of it
                var temp = [];
                temp.push(savedQuestion);
                success(temp);
            }
        });
    },


    updateQuestion: function (questionObject, questionIndex, error_neg_1, error_0, success) {
        Question.update({questionIndex: questionIndex},
            {
                $set: {
                    question: questionObject["question"],
                    heading: questionObject["heading"],
                    shortQuestion: questionObject["shortQuestion"],
                    lastActivity: questionObject["lastActivity"]
                }
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            })
    },


    pushQuestionToAsker: function (openId, index, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
            $addToSet: {askedQuestionsIndexes: index}
        }, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }

        });
    },


    getCount: function (error_neg_1, error_0, success) {
        var questionCount;
        Question.count({}, function (err, count) {
            if (err) {
                error_neg_1(-1, err);
            } else if (count == null || count == undefined) {
                questionCount = 0;
                success(questionCount);
            } else {
                questionCount = count;
                success(questionCount);
            }
        });
    },


    getQuestions: function (sort, page, limit, error_neg_1, error_0, success) {
        var errors = 0;
        Question.find()
            .sort({questionIndex: sort})
            .skip((page - 1) * 10)
            .limit(limit)
            .exec(function (err, questionsArray) {
                if (err) {
                    error_neg_1(-1, err);
                    errors++;
                } else if (questionsArray == null || questionsArray == undefined || questionsArray.length == 0) {
                    questionsArray = [];
                }
                if (errors == 0) {
                    var questionCount = 0;
                    Question.count({}, function (err, count) {
                        if (err) {
                            error_neg_1(-1, err);
                        } else if (count == null || count == undefined) {
                            questionCount = 0;
                            success(questionsArray, questionCount);
                        } else {
                            questionCount = count;
                            success(questionsArray, questionCount);
                        }
                    });
                }
            });
    },


    /* getQuestionsRange: function (sort, currentQuestionIndex, limit, lastQuestionActivity, error_neg_1, error_0, success) {
     var indexAddition = 0;
     Question.find({questionIndex: {$gt: currentQuestionIndex}})
     .sort({questionIndex: sort})
     .limit(limit)
     .exec(function (err, questionsArray) {
     if (err) {
     error_neg_1(-1, err);
     } else {
     if (questionsArray == null || questionsArray == undefined || questionsArray.length == 0) {
     questionsArray = [];
     } else {
     indexAddition = questionsArray.length;
     }

     Question.find({
     lastActivity: {$gt: lastQuestionActivity},
     questionIndex: {$lte: currentQuestionIndex}
     })
     .sort({questionIndex: sort})
     .exec(function (err, questionsArray_byTime) {
     if (err) {
     error_neg_1(-1, err);
     } else if (questionsArray_byTime == null || questionsArray_byTime == undefined || questionsArray_byTime.length == 0) {
     if (questionsArray == []) {
     error_0(0);
     } else {
     success(questionsArray, indexAddition);
     }
     } else {
     questionsArray_byTime = questionsArray_byTime.concat(questionsArray);
     success(questionsArray_byTime, indexAddition);
     }
     })
     }

     });
     },*/


    getOneQuestion: function (questionIndex, error_neg_1, error_0, success) {
        Question.find({questionIndex: questionIndex})
            .sort({questionIndex: -1})
            .limit(1)
            .exec(function (err, question) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (question == null || question == undefined || question.length == 0) {
                    error_0(0);
                } else {
                    success(question);
                }
            });
    },


    findTopVotedQuestions: function (sort, limit, error_neg_1, error_0, success) {
        Question.find({votes: {$gt: 0}})
            .sort({votes: sort})
            .limit(limit)
            .exec(function (err, topVotedArray) {
                if (err) {
                    error_neg_1(-1, err);
                } else if (topVotedArray.length == 0) {
                    success([]);
                } else {
                    success(topVotedArray);
                }
            });
    },


    pushUpvoteToUpvoter: function (openId, upvotedIndex, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $addToSet: {votedQuestionIndexes: upvotedIndex}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    pullUpvoteFromUpvoter: function (openId, upvotedIndex, error_neg_1, error_0, success) {
        HarvardUser.update({id: openId}, {
                $pull: {votedQuestionIndexes: upvotedIndex}
            }, function (err) {
                if (err) {
                    error_neg_1(-1, err);
                } else {
                    success();
                }
            }
        )
    },


    changeQuestionVotes: function (upvotedIndex, inc, error_neg_1, error_0, success) {
        Question.update({questionIndex: upvotedIndex}, {$inc: {votes: inc}}, function (err) {
            if (err) {
                error_neg_1(-1, err);
            } else {
                success();
            }
        })
    }


};
