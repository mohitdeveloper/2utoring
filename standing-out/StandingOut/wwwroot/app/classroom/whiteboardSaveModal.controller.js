(function () {
    angular.module('standingOut.controllers').controller('WhiteboardSaveModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'name', 'SessionWhiteBoardsService',
            function ($scope, $log, $sce, close, ModalService, classSessionId, name, SessionWhiteBoardsService) {
                $scope.classSessionId = classSessionId;
                $scope.name = name;

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {

                };

                $scope.save = function (index) {
                    close($scope.name, 100);
                };

                $scope.init();
            }
        ]);
})();