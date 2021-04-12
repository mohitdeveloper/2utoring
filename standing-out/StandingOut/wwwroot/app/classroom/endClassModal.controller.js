(function () {
    angular.module('standingOut.controllers').controller('EndClassModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService',
            function ($scope, $log, $sce, close, ModalService) {
                $scope.name = '';

                $scope.cancel = function () {
                    close(false, 100);
                };

                $scope.init = function () {
                    
                };

                $scope.save = function (index) {
                    close(true, 100);
                };

                $scope.init();
            }
        ]);
})();