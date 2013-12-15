'use strict';
angular.module('barkeeper.lineChart', ['d3'])
    .directive('lineChart', ['$window', 'd3Service', function ($window, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function (scope, element, attrs) {

                var margin = {top: 20, right: 20, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                d3Service.d3().then(function (d3) {
                    var parseDate = d3.time.format('%d-%b-%y').parse;

                    var svg = d3.select(element[0]).append('svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom);

                    // Browser onresize event
                    window.onresize = function () {
                        scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });


                    scope.render = function (data) {
                        svg.selectAll('*').remove();

                        var x = d3.time.scale()
                            .range([0, width]);

                        var y = d3.scale.linear()
                            .range([height, 0]);

                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient('bottom');

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient('left');

                        var line = d3.svg.line()
                            .x(function (d) {
                                return x(d.date);
                            })
                            .y(function (d) {
                                return y(d.close);
                            });

                        var g = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

                        if (!_.isDate(data[0].date)) {
                            data.forEach(function (d) {
                                d.date = parseDate(d.date);
                                d.close = +d.close;
                            });
                        }

                        x.domain(d3.extent(data, function (d) {
                            return d.date;
                        }));
                        y.domain(d3.extent(data, function (d) {
                            return d.close;
                        }));

                        g.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0,' + height + ')')
                            .call(xAxis);

                        g.append('g')
                            .attr('class', 'y axis')
                            .call(yAxis)
                            .append('text')
                            .attr('transform', 'rotate(-90)')
                            .attr('y', 6)
                            .attr('dy', '.71em')
                            .style('text-anchor', 'end')
                            .text('Gesamtkosten (€)');

                        g.append('path')
                            .datum(data)
                            .attr('class', 'line')
                            .attr('d', line);
                    };
                });
            }
        }
    }
    ])
;