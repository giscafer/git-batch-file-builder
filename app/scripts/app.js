'use strict';
//gitBatchBuilderApp
var angularApp = angular.module('gitBatchBuilderApp', ['ui.bootstrap']);

angularApp.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/forms/create', {
            templateUrl: 'views/create.html',
            controller: 'CreateCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}).run(['$rootScope',  function() {}]);


