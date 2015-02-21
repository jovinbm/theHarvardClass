/**
 * Created by jovinbm on 1/19/15.
 */
angular.module('qaApp')
    .controller('logInOutCtrl', ['$window', '$scope', '$rootScope', 'logoutService',
        function ($window, $scope, $rootScope, logoutService) {

            $scope.logoutCustomChat = function () {
                logoutService.logoutCustomChat()
                    .success(function (response) {
                        $window.location.href = "/login1.html";
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error500.html";
                    });
            };

            $scope.logoutHarvardChat = function () {
                logoutService.logoutHarvardChat()
                    .success(function (response) {
                        $window.location.href = "/login.html";
                    })
                    .error(function (errResponse) {
                        $window.location.href = "/error500.html";
                    });
            };

        }]);