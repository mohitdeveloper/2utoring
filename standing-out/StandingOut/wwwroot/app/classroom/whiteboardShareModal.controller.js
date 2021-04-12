(function () {
    angular.module('standingOut.controllers').controller('WhiteboardShareModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'sessionWhiteBoardId', 'whiteBoardUserId', 'userId', 'SessionWhiteBoardsService', 'showRead',
            function ($scope, $log, $sce, close, ModalService, classSessionId, sessionWhiteBoardId, whiteBoardUserId, userId, SessionWhiteBoardsService, showRead) {
                $scope.classSessionId = classSessionId;
                $scope.sessionWhiteBoardId = sessionWhiteBoardId;
                $scope.userId = userId;
                $scope.whiteBoardUserId = whiteBoardUserId;
                $scope.users = [];
                $scope.readToggle = false;
                $scope.writeToggle = false;
                $scope.showRead = showRead;

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    $('.loading').show();
                    $scope.getUsers();
                };

                $scope.getUsers = function () {
                    SessionWhiteBoardsService.getUsersForShare({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: $scope.sessionWhiteBoardId, userId: $scope.userId, individual: $scope.showRead, whiteBoardUserId: $scope.whiteBoardUserId }, function (success) {
                        $scope.users = success;
                        $scope.checkWriteToggleValid(true);
                        $scope.checkReadToggleValid(true);
                        $('.loading').hide();
                    }, function (err) {
                        $('.loading').hide();
                    });
                };

                $scope.setWrite = function () {

                    for (var i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].write != $scope.writeToggle) {
                            $scope.users[i].write = $scope.writeToggle;
                        }
                    }

                    if ($scope.writeToggle) {
                        $scope.readToggle = true;
                        $scope.setRead();
                    }
                };

                $scope.setRead = function () {
                    for (var i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].read != $scope.readToggle && $scope.users[i].userId != $scope.whiteBoardUserId) {
                            $scope.users[i].read = $scope.readToggle;
                        }
                    }

                    if (!$scope.readToggle) {
                        $scope.writeToggle = false;
                        $scope.setWrite();
                    }
                };

                $scope.writeChanged = function (index) {
                    if ($scope.users[index].write && !$scope.users[index].read) {
                        $scope.users[index].read = true;
                        $scope.checkReadToggleValid($scope.users[index].read);
                    }
                    $scope.checkWriteToggleValid($scope.users[index].write);
                };
                
                $scope.readChanged = function (index) {
                    if (!$scope.users[index].read && $scope.users[index].write) {
                        $scope.users[index].write = false;
                        $scope.checkWriteToggleValid($scope.users[index].write);
                    }
                    $scope.checkReadToggleValid($scope.users[index].read);
                };

                $scope.checkWriteToggleValid = function (newValue) {
                    if (newValue != $scope.writeToggle) {
                        for (var i = 0; i < $scope.users.length; i++) {
                            if ($scope.users[i].write == $scope.writeToggle) {
                                return;
                            }
                        }
                        $scope.writeToggle = newValue;
                    }
                };

                $scope.checkReadToggleValid = function (newValue) {
                    if (newValue != $scope.readToggle) {
                        for (var i = 0; i < $scope.users.length; i++) {
                            if ($scope.users[i].read == $scope.readToggle) {
                                return;
                            }
                        }
                        $scope.readToggle = newValue;
                    }
                };

                $scope.share = function () {
                    close({ users: $scope.users, individual: $scope.showRead, whiteBoardUserId: $scope.whiteBoardUserId }, 100);
                };

                $scope.init();
            }
        ]);
})();