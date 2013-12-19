angular.module('barkeeper.stats', ['restangular'])
    .factory('stats', function (Restangular, $q) {
        var drinks = function (userId, year) {
            var deferred = $q.defer();

            var call = Restangular.one('users', userId).all('items');

            var success = function(items) {
                deferred.resolve(transformBarChartData(items));
            };

            var error = function (err) {
                deferred.reject(err);
            };

            if (year) {
                call.getList({year:year}).then(success, error);
            } else {
                call.getList().then(success, error);
            }

            return deferred.promise;
        }

        var costs = function (userId, year) {
            var deferred = $q.defer();

            var call = Restangular.one('users', userId).all('costs');

            var success = function(costs) {
                deferred.resolve(transformLineChartData(costs));
            };

            var error = function (err) {
                deferred.reject(err);
            };

            if (year) {
                call = call.getList({year:year}).then(success, error);
            } else {
                call = call.getList().then(success, error);
            }

            return deferred.promise;
        }

        var transformBarChartData = function (drinks) {

            if (drinks.length > 3) {
                var minValue = _.max(drinks, 'score').score * 0.1;

                var filtered = _.filter(drinks, function (drink) {
                    return drink.score >= minValue;
                });

                var others = _.filter(drinks, function (drink) {
                    return drink.score < minValue;
                });


                var sumOthers = _.reduce(others, function (sumScore, item) {
                    return sumScore + item.score;
                }, 0)

                filtered.push({name: 'Sonstige', score: sumOthers});

                return filtered;
            } else {
                return drinks;
            }

        }

        var transformLineChartData = function (costs) {
            _.forEach(costs, function (item) {
                var date = new Date(item.date * 1000);
                var timeRemoved = new Date(date.getFullYear(), date.getMonth());
                item.date = timeRemoved;
                item.amount = Math.abs(item.amount);
            });

            var groupedPerMonth = _.groupBy(costs, function (item) {
                return item.date;
            });

            var amountsPerMonth = _.transform(groupedPerMonth, function (result, amounts, key) {
                var sumAllAmounts = _.reduce(_.map(amounts, "amount"), function (sum, amount) {
                    return sum + amount;
                });
                result[key] = Math.round(sumAllAmounts * 100) / 100;
                ;
            });

            var amountsPerMonthAsArray = _.transform(amountsPerMonth, function (result, value, key) {
                var dateVal = new Date(key);
                result.push({date: dateVal, amount: value});
            }, []);

            amountsPerMonthAsArray.sort(function (a, b) {
                return a.date - b.date;
            });

            return amountsPerMonthAsArray;
        };

        return {
            drinks: drinks,
            costs: costs
        }
    });