(function () {
    angular.module('standingOut.controllers').controller('ClassroomScreenRecordingController',
        ['$scope', '$rootScope', 'ModalService', 'DeleteService',
            function ($scope, $rootScope, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $scope.isOpen = false;
              
                $scope.init = function () {
                };

                $scope.toggle = function () {
                    if ($rootScope.checkSessionStart()) {
                        $scope.isOpen = !$scope.isOpen;
                    }
                };

                $scope.init();
            }
        ]);
})();