angular.module('barkeeper.slider',['barkeeper.stats', 'ngRoute']).directive('slider', function ($parse, stats, $route) {
    return {
        restrict: 'E',
        replace: true,
        template: '<input type="text" />',
        link: function ($scope, element, attrs) {
            var userId = $route.current.params.userId;
            var model = $parse(attrs.model);

            var min = parseInt(attrs.minYear),
                max = parseInt(attrs.maxYear),
                current = parseInt(attrs.currentYear);;
            var slider = $(element)
                .slider({
                    min: min,
                    max: max,
                    step: 1,
                    orientation: 'horizontal',
                    value: current,
                    selection: 'before',
                    tooltip: 'show',
                    handle: 'round'
                });

            slider.on('slide', function(ev) {
                model.assign($scope, ev.value);
                stats.costs(userId, ev.value).then(function(costs) {
                    $scope.lineChartData = costs;
                });

                stats.drinks(userId, ev.value).then(function(drinks) {
                    $scope.barChartData = drinks;
                });

                $scope.$apply();

            });
        }
    }
});