'use strict';
angular.module('barkeeper', ['barkeeper.controllers', 'barkeeper.lineChart', 'barkeeper.barChart', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    });