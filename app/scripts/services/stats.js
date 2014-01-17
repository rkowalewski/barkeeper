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

            //map to appropriate data types
            costs = _.map(costs, function (item) {
                var date = new Date(item.date * 1000);
                return {
                    date: new Date(date.getFullYear(), date.getMonth()),
                    amount: Math.abs(item.amount)
                };
            });

            var monthRange = _.range(12);

            var groupedByYear = _.groupBy(costs, function(item) {
                return item.date.getFullYear();
            });

            var lineChartData = _.transform(groupedByYear, function(result, amounts, year) {
                var groupedByMonth = _.groupBy(amounts, function(amount) {
                    return amount.date.getMonth();
                });

                var amountsPerMonth = _.transform(groupedByMonth, function(result, amounts, month) {
                    var sumAllAmounts = _.reduce(_.map(amounts, "amount"), function (sum, amount) {
                        return sum + amount;
                    });

                    result.push(createLineChartItem(
                        +month,
                        Math.round(sumAllAmounts * 100) / 100
                    ));

                }, []);

                var includedMonths = _.map(_.keys(groupedByMonth), function(month) {
                    return +month;
                })

                var notIncludedMonths = _.difference(monthRange, includedMonths);

                _.forEach(notIncludedMonths, function(month) {
                    amountsPerMonth.push(createLineChartItem(month,0));
                });

                amountsPerMonth.sort(function(a, b) {
                    return a.month - b.month;
                });

                result.push({
                    year: +year,
                    values: amountsPerMonth
                });


            },[])

            return lineChartData;
        };

        var createLineChartItem = function(month, amount) {
            return {
                month: month,
                amount: amount
            }
        }


        return {
            drinks: drinks,
            costs: costs
        }
    });