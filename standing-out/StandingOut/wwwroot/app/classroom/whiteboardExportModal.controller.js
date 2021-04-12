(function () {
    angular.module('standingOut.controllers').controller('WhiteboardExportModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'ClassSessionsService',
            function ($scope, $log, $sce, close, ModalService, ClassSessionsService) {
                $scope.classSessionId = classSessionId;                

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    ClassSessionsService.get({ id: $scope.classSessionId }, function (success) {
                        $scope.classSession = success;
                    }, function (err) {
                    });
                };

                $scope.exportToPc = function () {
                    close('pc', 100);
                };

                $scope.exportToDrive = function () {
                    close('drive', 100);
                };

                $scope.init();
            }
        ]);
})();