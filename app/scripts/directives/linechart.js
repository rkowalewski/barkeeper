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

                    var svg = d3.select(element[0]).append('svg')
                        .attr("width", width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom);

                    // Watch for resize event
                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    scope.$parent.$watch('lineChartData', function(items) {
                        if (items.length > 0) {
                            scope.render(items);
                        }
                    });

                    var timeFormat = function(formats) {
                        return function(date) {
                            var i = formats.length - 1, f = formats[i];
                            while (!f[1](date)) f = formats[--i];
                            return f[0](date);
                        };
                    };

                    var dateFormatsFilter = timeFormat([
                        [d3.time.format("%Y"), function() { return true; }],
                        [d3.time.format("%b"), function(d) { return d.getMonth(); }]]);

                    scope.render = function (data) {
                        svg.selectAll('*').remove();

                        var minDate = d3.min(data, function(d) {
                            return d.date;
                        });

                        var maxDate = d3.max(data, function(d) {
                            return d.date;
                        })

                        var x = d3.time.scale().domain([minDate, maxDate])
                            .range([0, width]);

                        var y = d3.scale.linear().domain([0, d3.max(function (d) {
                                return d.amount;
                            })])
                            .range([height, 0]);

                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient('bottom')
                            .tickFormat(dateFormatsFilter);

                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient('left');

                        var line = d3.svg.line()
                            .x(function (d) {
                                return x(d.date);
                            })
                            .y(function (d) {
                                return y(d.amount);
                            });

                        var g = svg.append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

                        x.domain(d3.extent(data, function (d) {
                            return d.date;
                        }));
                        y.domain(d3.extent(data, function (d) {
                            return d.amount;
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
                            .text('Expenses (€)');

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