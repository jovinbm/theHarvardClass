/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')
    .factory('questionService', ['$window', '$location', '$http', '$rootScope', 'socket', 'socketService', 'globals', 'detailStorage',
        function ($window, $location, $http, $rootScope, socket, socketService, globals, detailStorage) {
            var alerts = {
                newQuestionAlert: {
                    type: 'info',
                    num: 0,
                    display: false
                },
                saved: {
                    type: 'info',
                    msg: "Saved!"
                }
            };

            socket.on('newQuestion', function (questionObject) {
                console.log("'newQuestion' event received factory");
                if (questionObject.questionCount) {
                    pageObject['totalItems'] = questionObject.questionCount;
                }
                detailStorage.add(questionObject["question"], true);
                if (questionObject.update == false) {
                    alerts.newQuestionAlert.num++;
                    alerts.newQuestionAlert.display = true;
                }
                if (pageObject.currentPage == 1) {
                    globals.currentQuestions(questionObject["question"]);
                }
                $rootScope.$broadcast('alertStorage', alerts);
                $rootScope.$broadcast('currentQuestions', globals.currentQuestions());
            });

            var pageObject = {
                "totalItems": 10,
                "items-per-page": 10,
                "currentPage": 1
            };

            return {

                alertStorage: function (key, newAlert) {
                    if (key && newAlert) {
                        alerts[key] = newAlert;
                        return alerts[key];
                    } else if (key) {
                        return alerts[key];
                    } else {
                        return alerts;
                    }
                },


                totalQuestions: function (count) {
                    if (count) {
                        pageObject['totalItems'] = count;
                        return count;
                    }
                    else {
                        return pageObject['totalItems']
                    }
                },

                getCurrPage: function () {
                    return pageObject.currentPage
                },

                getItemsPerPage: function () {
                    return pageObject['items-per-page']
                },

                navigate: function (page) {
                    pageObject.currentPage = page;
                    $location.path('/' + page + '/');
                },

                loadPage: function () {
                    globals.currentQuestions(null, null, true);
                    return $http.post('/api/getQuestions', {
                        "page": pageObject.currentPage
                    })
                },

                retrieveQuestion: function (index) {
                    return $http.post('/api/retrieveQuestion', {"index": index});
                },

                postQuestion: function (questionObject) {
                    var shortQuestion = "";
                    //trim 130 characters to be used for top voted
                    if (questionObject.theQuestion.length > 130) {
                        for (var i = 0; i < 130; i++) {
                            shortQuestion = shortQuestion + questionObject.theQuestion[i];
                        }
                        shortQuestion = shortQuestion + "...";
                    } else {
                        shortQuestion = questionObject.theQuestion;
                    }
                    var questionToDatabase = {
                        "heading": questionObject.theHeading,
                        "question": questionObject.theQuestion,
                        "shortQuestion": shortQuestion
                    };
                    return $http.post('/api/newQuestion', questionToDatabase);
                },

                postEditedQuestion: function (questionObject) {
                    var shortQuestion = "";
                    //trim 130 characters to be used for top voted
                    if (questionObject["question"].length > 130) {
                        for (var i = 0; i < 130; i++) {
                            shortQuestion = shortQuestion + questionObject["question"][i];
                        }
                        shortQuestion = shortQuestion + "...";
                    } else {
                        shortQuestion = questionObject["question"];
                    }
                    questionObject["shortQuestion"] = shortQuestion;
                    return $http.post('/api/updateQuestion', questionObject);
                },

                postQuestionVote: function (upvoteIndex, inc) {
                    var upvoteToDatabase = {
                        "upvoteIndex": upvoteIndex,
                        "inc": inc
                    };
                    return $http.post('/api/upvote', upvoteToDatabase);
                }
            }
        }]);