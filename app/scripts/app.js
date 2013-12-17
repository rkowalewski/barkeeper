'use strict';
angular.module('barkeeper', ['barkeeper.controllers', 'ngRoute', 'restangular'])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/users'
            });
    })
    .config(['RestangularProvider', function (RestangularProvider) {
        RestangularProvider.setBaseUrl('/api');
    }]);