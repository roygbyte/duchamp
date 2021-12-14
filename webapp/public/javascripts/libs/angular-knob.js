angular.module('ui.knob', []).directive('knob', ['$timeout', function($timeout) {
    'use strict';

    return {
        restrict: 'EA',
        replace: true,
        template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '=',
            knobOptions: '&',
            onChange: '&'
        },
        link: function($scope, $element) {
            var knobInit = $scope.knobOptions() || {};
            var _value;
            var self = this;
            knobInit.release = function(newValue) {
                $timeout(function() {
                    $scope.knobData = newValue;
                    _value = newValue;
                    // $scope.$apply();
                });
            };

            $scope.$watch('knobData', function(newValue, oldValue) {
                if (newValue != oldValue && newValue != _value) {
                    $($element).val(newValue).change();
                }
                $scope.onChange({size:newValue});
            });

            $($element).val($scope.knobData).knob(knobInit);
        }
    };
}]);
