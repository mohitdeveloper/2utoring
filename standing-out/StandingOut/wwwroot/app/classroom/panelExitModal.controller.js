(function () {
    angular.module('standingOut.controllers').controller('PanelExitModalController',
        ['$scope', 'close',
            function ($scope, close) {

                $scope.cancel = function () {
                    close(false, 100);
                };

                $scope.init = function () {
                    
                };

                $scope.continue = function (index) {
                    close(true, 100);
                };

                $scope.back = function (index) {
                    close(false, 100);
                };

                $scope.init();
            }
        ]);
})();