/**
 * Created by jovinbm on 12/25/14.
 */
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var ioJs = require('../functions/io.js');
var online = require('../functions/online.js');
var questionDB = require('../db/question_db.js');

module.exports = {

    startUp: function (req, res, theHarvardUser) {
        consoleLogger('startUp: STARTUP handler called');
        var limit = 10;
        var page = 1;
        ioJs.emitToAll("usersOnline", online.getUsersOnline());

        var temp = {};
        temp['upvotedIndexes'] = theHarvardUser.votedQuestionIndexes;
        temp['uniqueCuid'] = theHarvardUser.uniqueCuid;

        function getQuestionsErr(status, err) {
            if (status == -1) {
                consoleLogger("startUp handler: GetQuestions: Error while retrieving home details" + err);
                res.status(500).send({msg: 'startUp: GetQuestions: Error while retrieving home details', err: err});
                consoleLogger('startUp: failed!');
            }
        }

        function getTopErr(status, err) {
            if (status == -1) {
                consoleLogger("startUp handler: GetTop: Error while retrieving home details" + err);
                res.status(500).send({msg: 'startUp: GetTop: Error while retrieving home details', err: err});
                consoleLogger('startUp: failed!');
            }
        }

        function done(topVotedArray) {
            if (topVotedArray == []) {
                consoleLogger('startup handler: Did not find any top voted');
            }
            temp['topVotedArray'] = topVotedArray;
            res.status(200).send(temp);
            consoleLogger("StartUp success");
        }

        function getTop() {
            questionDB.findTopVotedQuestions(-1, 10, getTopErr, getTopErr, done);
        }

        function success(questionsArray, questionCount) {
            if (questionsArray == []) {
                consoleLogger("startup handler: no  questions found");
            }
            temp['questionsArray'] = questionsArray;
            temp['questionCount'] = questionCount;
            getTop();
        }

        questionDB.getQuestions(-1, page, limit, getQuestionsErr, getQuestionsErr, success)
    },


    reconnect: function (req, res, theHarvardUser, page) {
        consoleLogger('reconnect: RECONNECT handler called');
        var limit = 10;
        ioJs.emitToOne(theHarvardUser.socketRoom, "usersOnline", online.getUsersOnline());

        var temp = {};
        temp['uniqueCuid'] = theHarvardUser.uniqueCuid;
        temp['upvotedIndexes'] = theHarvardUser.votedQuestionIndexes;

        function getQuestionsErr(status, err) {
            if (status == -1) {
                consoleLogger("reconnect handler: getQuestions: Error while retrieving home details" + err);
                res.status(500).send({msg: 'reconnect: getQuestions: Error while retrieving home details', err: err});
                consoleLogger('reconnect handler: failed!');
            }
        }

        function getTopErr(status, err) {
            if (status == -1) {
                consoleLogger("reconnect handler: GetTop: Error while retrieving home details" + err);
                res.status(500).send({msg: 'reconnect: GetTop: Error while retrieving home details', err: err});
                consoleLogger('reconnect handler: failed!');
            }
        }

        function done(topVotedArray) {
            if (topVotedArray == []) {
                consoleLogger('reconnect: Did not find any top voted');
            }
            temp['topVotedArray'] = topVotedArray;
            res.status(200).send(temp);
            consoleLogger("reconnect success");
        }

        function getTop() {
            questionDB.findTopVotedQuestions(-1, 10, getTopErr, getTopErr, done);
        }

        function success(questionsArray, questionCount) {
            if (questionsArray == []) {
                consoleLogger("reconnect: no questions found");
            }
            temp['questionsArray'] = questionsArray;
            temp['questionCount'] = questionCount;
            getTop();
        }

        questionDB.getQuestions(-1, page, limit, getQuestionsErr, getQuestionsErr, success)
    }


};