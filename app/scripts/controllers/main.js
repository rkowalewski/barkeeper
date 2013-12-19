'use strict';

angular.module('barkeeper.controllers', ['ngRoute', 'barkeeper.lineChart', 'barkeeper.barChart', 'barkeeper.stats', 'barkeeper.slider'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/users', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                resolve: {
                    users: function (Restangular) {
                        return Restangular.all('users').getList();
                    }
                }
            })
            .when('/users/:userId', {
                templateUrl: 'views/detail.html',
                controller: 'DetailCtrl',
                resolve: {
                    barChartData: function (stats, $route) {
                        return stats.drinks($route.current.params.userId);
                    },
                    lineChartData: function (stats, $route) {
                        return stats.costs($route.current.params.userId);
                    }
                }
            })
    })
    .controller('MainCtrl', function ($scope, $location, users, stats) {

        $scope.predicate = 'rank';

        users.sort(function (a, b) {
            return b.sum - a.sum;
        });

        var len = users.length;

        for (var i = len - 1, r = 1; i > -1; --i, ++r) {
            if (i in users) {
                var user = users[i];
                user.sum = Math.round(Math.abs(user.sum) * 100) / 100;
                user.rank = r;
            }
        }

        $scope.users = users;

        $scope.viewDetail = function (user) {
            $location.path('/users/' + user);
        };
    }
)
    .
    controller('DetailCtrl', function ($scope, barChartData, lineChartData) {
        $scope.barChartData = barChartData;
        $scope.lineChartData = lineChartData;

        var min = _.min(lineChartData, function(item) {
            return item.date.getFullYear();
        });

        var max = _.max(lineChartData, function(item) {
            return item.date.getFullYear();
        });

        $scope.minYear = min.date.getFullYear();
        $scope.maxYear = max.date.getFullYear();

        $scope.currentYear =  min.date.getFullYear();
    });