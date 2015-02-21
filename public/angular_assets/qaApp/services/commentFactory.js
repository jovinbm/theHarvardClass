/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')

    .factory('commentService', ['$http', '$rootScope', 'socket', 'globals',
        function ($http, $rootScope, socket, globals) {
            socket.on('newComment', function (commentObject) {
                console.log("'newComment' event received");
                $rootScope.$broadcast('newComment', commentObject);
            });

            return {
                getComments: function (questionIndex, lastCommentIndex) {
                    return $http.post('/api/getComments', {
                        "questionIndex": questionIndex,
                        "lastCommentIndex": lastCommentIndex
                    });
                },


                commentsReference: function (commentsArray, myPromotes, commentsReference) {
                    commentsArray.forEach(function (commentObject) {
                        var temp = {};
                        //change time-string from mongodb to actual time
                        var mongoDate = new Date(commentObject.timePosted);
                        temp.commentTime = mongoDate.toDateString() + " " + mongoDate.toLocaleTimeString();
                        temp.viewMode = 'viewMode';

                        var questionIndex = commentObject.questionIndex;
                        var commentIndex = commentObject.commentIndex;
                        var commentClass = "q" + questionIndex + "c" + commentIndex;

                        temp.commentIndex = commentIndex;
                        temp.commentClass = commentClass;

                        function searchArrayIfExists(name, theArray) {
                            return (theArray.indexOf(name) > -1)
                        }

                        /*if already updated, insert a new button class with a btn-warning class, and a disabled attribute*/
                        if (searchArrayIfExists(commentObject.uniqueId, myPromotes)) {
                            temp.buttonClass = commentClass + "b" + " btn btn-default btn-xs promote";
                            temp.ifPromoted = true;
                        } else {
                            temp.buttonClass = commentClass + "b" + " btn btn-default btn-xs promote";
                            temp.ifPromoted = false;
                        }

                        commentsReference[commentIndex] = temp;
                    });

                    return commentsReference;
                },

                getCachedComment: function (index) {
                    var currentComment = globals.currentComments();
                    return currentComment[index];
                },


                postEditedComment: function (commentObject) {
                    commentObject["commentUniqueId"] = commentObject.commentUniqueId;
                    var shortComment = "";
                    //trim 130 characters
                    if (commentObject["comment"].length > 130) {
                        for (var i = 0; i < 130; i++) {
                            shortComment = shortComment + commentObject["comment"][i];
                        }
                        shortComment = shortComment + "...";
                    } else {
                        shortComment = commentObject["comment"];
                    }
                    commentObject["shortComment"] = shortComment;
                    return $http.post('/api/updateComment', commentObject);
                },


                postComment: function (commentObject) {
                    var shortComment = "";
                    //trim 130 characters to be used for partial show
                    if (commentObject.theComment.length > 130) {
                        for (var i = 0; i < 130; i++) {
                            shortComment = shortComment + commentObject.theComment[i];
                        }
                        shortComment = shortComment + "...";
                    } else {
                        shortComment = commentObject.theComment;
                    }
                    var commentToDatabase = {
                        "comment": commentObject.theComment,
                        "shortComment": shortComment,
                        "questionIndex": commentObject.questionIndex
                    };

                    return $http.post('/api/newComment', commentToDatabase);
                },

                postPromote: function (questionIndex, commentIndex, inc, uniqueId) {
                    var promote = {
                        "questionIndex": questionIndex,
                        "commentIndex": commentIndex,
                        "inc": inc,
                        "uniqueId": uniqueId
                    };

                    return $http.post('/api/promote', promote);
                }
            }
        }]);