'use strict';
angular.module('barkeeper.directives',[])
    .directive('bars', function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element.text('this is the bars directive');
            }
        };
    });