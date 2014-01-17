'use strict';
angular.module('barkeeper.lineChart', ['d3'])
    .directive('lineChart', ['$window', 'd3Service', function ($window, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez'];

                var margin = {top: 20, right: 80, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var formatMonth = function(d) {
                    return months[d % 12];
                };

                d3Service.d3().then(function (d3) {

//                    Watch for resize event
//                    scope.$watch(function () {
//                        return angular.element($window)[0].innerWidth;
//                    }, function () {
//                        scope.render(scope.data);
//                    });

                    scope.$parent.$watch('lineChartData', function(items) {
                        if (items.length > 0) {
                            scope.render(items);
                        }
                    });

                    var x = d3.scale.linear()
                        .domain([0, 11])
                        .range([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    var color = d3.scale.category10();

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(formatMonth);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) {
                            return x(d.month);
                        })
                        .y(function (d) {
                            return y(d.amount);
                        });

                    var svg = d3.select(element[0]).append('svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    scope.render = function (data) {
                        svg.selectAll('*').remove();

                        color.domain(_.map(data, 'year'));

                        y.domain([
                            0,
                            d3.max(data, function (d) {
                                return d3.max(d.values, function (v) {
                                    return v.amount;
                                });
                            })
                        ]);

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("Expenses (€)");

                        var city = svg.selectAll(".city")
                            .data(data)
                            .enter().append("g")
                            .attr("class", "city");

                        city.append("path")
                            .attr("class", "line")
                            .attr("d", function (d) {
                                return line(d.values);
                            })
                            .style("stroke", function (d) {
                                return color(d.year);
                            });

                        city.append("text")
                            .datum(function (d) {
                                return {year: d.year, value: d.values[d.values.length - 1]};
                            })
                            .attr("transform", function (d) {
                                return "translate(" + x(d.value.month) + "," + y(d.value.amount) + ")";
                            })
                            .attr("x", 3)
                            .attr("dy", ".35em")
                            .text(function (d) {
                                return d.year;
                            });
                    };

                    scope.render(scope.data);
                });
            }
        }
    }]);