(function () {
    'use strict';

    angular.module('standingOut.directives').directive('datePickerDynamic', function () {
        return {
            replace: true,
            scope: {
                date: '=',
                requiredparam: '=requiredparam',
                disabledparam: '=disabledparam',
                placeholder: '@'
            },
            template: '<input type="text" ng-model="selectedDate" placeholder="{{placeholder}}"  data-ng-required="requiredparam" data-ng-disabled="disabledparam"  autocomplete="off"/>',
            controller: ['$scope', '$element', '$compile', '$http', '$rootScope',
                function ($scope, $element, $compile, $http, $rootScope) {
                    $scope.init = function () {
                        $scope.format = 'dd/mm/yyyy';
                        $scope.momentFormat = 'DD/MM/YYYY';
                        $scope.showTime = false;

                        $element.fdatepicker({ format: $scope.format });
                        $scope.selectedDate = null;

                        $scope.momentDate = moment($scope.date, moment.ISO_8601);

                        if ($scope.momentDate.isValid()) {
                            $scope.selectedDate = $scope.momentDate.format($scope.momentFormat);
                        } else if($scope.date !== undefined && $scope.date != null && $scope.date != '') {
                            $scope.momentDate = moment();
                            $scope.selectedDate = $scope.momentDate.format($scope.momentFormat);
                            $scope.date = $scope.momentDate.format();
                        }

                        $element.fdatepicker('update', $scope.selectedDate);

                        $scope.$watch(
                            function () { return $scope.selectedDate; },
                            function (newValue, oldValue) {
                                if (newValue.length >= 10) {
                                    if (newValue && newValue != oldValue) {
                                        var momentDate = moment(newValue, $scope.momentFormat);
                                        if (momentDate.isValid()) {
                                            $scope.date = momentDate.format();
                                        } else {
                                            $scope.date = null;
                                        }
                                    }
                                } 
                            }
                        );

                        $scope.$watch(
                            function () { return $scope.date; },
                            function (newValue, oldValue) {
                                if (newValue !== undefined && newValue != null && newValue != '' && newValue != $scope.momentDate.format()) {
                                    if (!newValue) {
                                        newValue = moment().format();
                                    }
                                    $scope.momentDate = moment(newValue, moment.ISO_8601);

                                    if ($scope.momentDate.isValid()) {
                                        $scope.selectedDate = $scope.momentDate.format($scope.momentFormat);
                                        $scope.date = $scope.momentDate.format();
                                    } else {
                                        $scope.selectedDate = null;
                                    }

                                    $element.fdatepicker('update', $scope.selectedDate);
                                }
                            }
                        );
                    };

                    $scope.init();

                }
            ]
        };
    });
})();