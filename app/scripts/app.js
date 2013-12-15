'use strict';
angular.module('barkeeper', ['barkeeper.controllers', 'barkeeper.directives', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });
    });