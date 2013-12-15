'use strict';

describe('Directive: bars', function () {

    // load the directive's module
    beforeEach(module('barkeeper'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<bars></bars>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('this is the bars directive');
    }));
});
