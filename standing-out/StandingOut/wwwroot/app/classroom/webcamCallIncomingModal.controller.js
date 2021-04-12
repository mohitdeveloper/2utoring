(function () {
    angular.module('standingOut.controllers').controller('WebcamCallIncomingModalController',
        ['$scope', '$rootScope', '$timeout', 'close', 'ClassroomSessionsService', 'incomingUserId', 'roomId',
            function ($scope, $rootScope, $timeout, close, ClassroomSessionsService, incomingUserId, roomId) {
                $scope.decision = false;          
                $scope.incomingUserId = incomingUserId;
                $scope.roomId = roomId;
                $scope.cancelledCall = false;

                $scope.init = function () {
                    ClassroomSessionsService.getUserDetails({ id: $scope.incomingUserId }, function (success) {
                        $scope.incomingUser = success;
                    }, function (error) {
                    });

                    setTimeout(function () {
                        var element = document.getElementById('tempphonering');
                        if (element !== undefined && element != null) {
                            element.load();
                            element.play().catch(function (e) { });
                        }

                    }, 1000);
                };

                $scope.confirm = function (decision) {
                    $scope.decision = decision;
                    $scope.close();
                };

                $scope.close = function () {
                    var element = document.getElementById('tempphonering');
                    if (element !== undefined && element != null) {
                        element.pause();
                    }
                    if (!$scope.closed) {
                        $scope.closed = true;

                        close($scope.decision, 500);
                        return;
                    }

                };
                
                $scope.$on('cancelledCall', function (event, roomId) {
                    if ($scope.roomId == roomId) {
                        toastr.clear();
                        toastr.info('The call was cancelled');
                        $scope.close();
                    }
                });

                $scope.init();
            }
        ]);
})();