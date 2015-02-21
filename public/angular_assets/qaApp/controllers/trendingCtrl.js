/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')

    .controller('TrendingSummaryCtrl', ['$scope', 'socket', 'globals', 'stateService',
        function ($scope, socket, globals, stateService) {
            $scope.$on("currentTop", function () {
                $scope.topVotedQuestions = globals.currentTop();
            });

            if ($scope.tab != 'home') {
                $scope.changeTab('home');
            }

            $scope.topVotedQuestions = globals.currentTop();
            $scope.columnClass = stateService.trClass();
        }])

    .controller('TrendingCtrl', ['$scope', 'socket', 'globals', 'stateService',
        function ($scope, socket, globals, stateService) {
            $scope.$on("currentTop", function () {
                $scope.topVotedQuestions = globals.currentTop();
            });

            if ($scope.tab != 'trending') {
                $scope.changeTab('trending');
            }

            $scope.topVotedQuestions = globals.currentTop();
            $scope.columnClass = stateService.trClass();
        }]);