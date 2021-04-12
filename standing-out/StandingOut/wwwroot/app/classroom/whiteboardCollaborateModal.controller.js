(function () {
    angular.module('standingOut.controllers').controller('WhiteboardCollaborateModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'userId', 'SessionWhiteBoardsService',
            function ($scope, $log, $sce, close, ModalService, classSessionId, userId, SessionWhiteBoardsService) {
                $scope.classSessionId = classSessionId;
                $scope.userId = userId;
                $scope.usersAndGroups = [];

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    $('.loading').show();
                    $scope.getWhiteboardsByUser();
                };

                $scope.getWhiteboardsByUser = function () {
                    SessionWhiteBoardsService.getWhiteBoardsForCollaborate({ classSessionId: $scope.classSessionId, userId: $scope.userId }, function (success) {
                        $scope.usersAndGroups = success;
                        $('.loading').hide();
                    }, function (err) {
                    });
                };

                $scope.collaborate = function (sessionWhiteBoardId) {
                    close(sessionWhiteBoardId, 100);
                };

                $scope.init();
            }
        ]);
})();