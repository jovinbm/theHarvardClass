/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')

    .controller('CommentCtrl', ['$window', '$scope', '$rootScope', 'globals', 'sortObjectToArrayFilter', 'commentService',
        function ($window, $scope, $rootScope, globals, sortObjectToArrayFilter, commentService) {

            $scope.newComment = function (questionIndex) {
                if ($scope.theComment.length != 0) {
                    commentService.postComment({
                        "theComment": $scope.theComment,
                        "questionIndex": questionIndex
                    }).success(function (resp) {
                        $scope.theComment = '';
                        $scope.changeCollapse();
                    })
                        .error(function (errorResponse) {
                            $window.location.href = "/error500.html";
                        });
                }
            };
        }]);