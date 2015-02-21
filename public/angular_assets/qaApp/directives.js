/**
 * Created by jovinbm on 1/13/15.
 */
angular.module('qaApp')
    .directive('topQaNav', [function () {
        return {
            templateUrl: 'public/partials/navs/top_qa.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('bottomQaNav', [function () {
        return {
            templateUrl: 'public/partials/navs/bottom_qa.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('modalQuestionInput', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, attr) {
                $scope.dismiss = function () {
                    $element.modal('hide');
                };
            }
        }
    })
    .directive('questionModal', [function () {
        return {
            templateUrl: 'public/partials/modals/question_input.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('questionFeed', [function () {
        return {
            templateUrl: 'public/partials/questionFeed.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('questionFull', [function () {
        return {
            templateUrl: 'public/partials/question_full.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('questionEdit', [function () {
        return {
            templateUrl: 'public/partials/modals/question_edit.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('commentFull', ['$window', 'socket', 'socketService', 'globals', 'sortObjectToArrayFilter', 'commentService',
        function ($window, socket, socketService, globals, sortObjectToArrayFilter, commentService) {
            return {
                templateUrl: 'public/partials/comment_full.html',
                link: function ($scope, $element, $attrs) {
                    $scope.questionIndex = $scope.currentQuestion;
                    $scope.cmntsReference = {};
                    $scope.myPromotes = [];
                    $scope.lastCommentIndex = -1;
                    $scope.comments = [];
                    $scope.is_editing = false;
                    $scope.changeEditing = function () {
                        $scope.is_editing = !$scope.is_editing;
                    };


                    $scope.increaseIndex = function (index, num) {
                        if (index) {
                            $scope.lastCommentIndex = index;
                        } else if (num) {
                            $scope.lastCommentIndex++;
                        }
                    };

                    $scope.promote = function (questionIndex, commentIndex, uniqueId, $event) {
                        commentService.postPromote(questionIndex, commentIndex, 1, uniqueId)
                            .success(function (resp) {
                                $scope.myPromotes.push("q" + questionIndex + "c" + commentIndex);
                                $scope.cmntsReference[commentIndex].ifPromoted = true;
                            })
                            .error(function (errResponse) {
                                $window.location.href = "/error500.html";
                            });
                    };

                    $scope.removePromote = function (questionIndex, commentIndex, uniqueId, $event) {
                        commentService.postPromote(questionIndex, commentIndex, -1, uniqueId)
                            .success(function (resp) {
                                var temp = "q" + questionIndex + "c" + commentIndex;
                                $scope.myPromotes.splice($scope.myPromotes.indexOf(temp), 1);
                                $scope.cmntsReference[commentIndex].ifPromoted = false;
                            })
                            .error(function (errResponse) {
                                $window.location.href = "/error500.html";
                            });
                    };

                    $scope.getCommentToEdit = function (index) {
                        var commentObject = commentService.getCachedComment(index);
                        $scope.changeEditing();
                        return commentObject.comment;
                    };

                    $scope.saveEditedComment = function (uniqueId, commentIndex, finalComment) {
                        var temp = {};
                        temp["commentUniqueId"] = uniqueId;
                        temp["comment"] = finalComment;
                        commentService.postEditedComment(temp)
                            .success(function (resp) {
                                $scope.cmntsReference[commentIndex].viewMode = 'viewMode';
                                $scope.changeEditing();
                                $scope.showAlert('success', 'Saved!');
                            });
                    };

                    $scope.$on('newComment', function (event, commentObject) {
                        $scope.increaseIndex(null, commentObject.index);
                        $scope.cmntsReference = commentService.commentsReference(
                            commentObject.comment,
                            $scope.myPromotes,
                            $scope.cmntsReference);

                        $scope.comments = sortObjectToArrayFilter(globals.currentComments(commentObject.comment));
                    });

                    commentService.getComments($scope.questionIndex, $scope.lastCommentIndex)
                        .success(function (resp) {
                            $scope.myPromotes = resp.myPromotes;
                            $scope.increaseIndex(resp.index);
                            var comments = resp.comments;
                            $scope.cmntsReference = commentService.commentsReference(
                                comments,
                                $scope.myPromotes,
                                $scope.cmntsReference);
                            $scope.comments = sortObjectToArrayFilter(globals.currentComments(comments));
                        })
                        .error(function (errorResponse) {
                            $window.location.href = "/error500.html";
                        });
                }
            }
        }])
    .directive('commentEdit', ['commentService', function (commentService) {
        return {
            templateUrl: 'public/partials/modals/comment_edit.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('trendingSummary', [function () {
        return {
            templateUrl: 'public/partials/trending_summary.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('trendingFull', [function () {
        return {
            templateUrl: 'public/partials/trending.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }])
    .directive('onlineFeed', [function () {
        return {
            templateUrl: 'public/partials/online.html',
            link: function ($scope, $element, $attrs) {
            }
        }
    }]);