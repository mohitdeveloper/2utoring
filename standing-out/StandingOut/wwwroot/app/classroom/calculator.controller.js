(function () {
    angular.module('standingOut.controllers').controller('ClassroomCalculatorController',
        ['$scope', 'ModalService', 'DeleteService',
            function ($scope, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;              
                $scope.isOpen = false;

                $scope.init = function () {
                    $scope.isOpen = false;
                };

                $scope.toggle = function () {
                    $scope.isOpen = !$scope.isOpen;
                };

                $scope.$on('toggleCalculator', function (event, opt) {
                    $scope.toggle();
                });

                $scope.init();
            }
        ]);
})();