/**
 * Created by jovinbm on 1/12/15.
 */
angular.module('qaApp', [
    'ngAnimate',
    'textAngular',
    'ngSanitize',
    'ui.bootstrap',
    'ngRoute',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics'
])
    .run(function ($templateCache, $http) {
        $http.get('public/partials/questionFeed.html', {cache: $templateCache});
        $http.get('public/partials/question_full.html', {cache: $templateCache});
        $http.get('public/partials/views/question_full.html', {cache: $templateCache});
        $http.get('public/partials/modals/question_input.html', {cache: $templateCache});
        $http.get('public/partials/modals/question_edit.html', {cache: $templateCache});
        $http.get('public/partials/views/trending.html', {cache: $templateCache});
        $http.get('public/partials/trending_summary.html', {cache: $templateCache});
        $http.get('public/partials/comment_full.html', {cache: $templateCache});
        $http.get('public/partials/modals/comment_edit.html', {cache: $templateCache});
        $http.get('public/partials/online.html', {cache: $templateCache});
        $http.get('public/partials/views/home.html', {cache: $templateCache});
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/:page/', {
                templateUrl: 'public/partials/views/home.html'
            })
            .when('/fullQuestion/:index/', {
                templateUrl: 'public/partials/views/question_full.html'
            })
            .when('/trending/full/', {
                templateUrl: 'public/partials/views/trending.html'
            })
            .otherwise({redirectTo: '/1'});
    }]);