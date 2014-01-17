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

        //add the rank attribute
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
    controller('DetailCtrl', function ($scope, $routeParams, barChartData, lineChartData, stats) {

        //Initialize data...
        barChartData = _.isEmpty(barChartData) ? [] : barChartData;
        lineChartData = _.isEmpty(lineChartData) ? [] : lineChartData;

        $scope.barChartData = barChartData;
        $scope.lineChartData = lineChartData;

        var init = function (lineChartData) {
            var years = _.map(lineChartData, 'year');

            var min = _.min(years);
            var max = _.max(years);
            $scope.minYear = min;
            $scope.maxYear = max;

            $scope.currentYear = min;
        };

        $scope.$watch('lineChartData', function(data) {
            init(data);
        });

        $scope.filter = function () {
            loadData($routeParams.userId, $scope.currentYear);
        };

        $scope.reset = function () {
            loadData($routeParams.userId);
        };

        var loadData = function (userId, year) {
            stats.costs(userId, year).then(function (costs) {
                $scope.lineChartData = costs;
            });

            stats.drinks(userId, year).then(function (drinks) {
                $scope.barChartData = drinks;
            });
        };

        init(lineChartData);
    });