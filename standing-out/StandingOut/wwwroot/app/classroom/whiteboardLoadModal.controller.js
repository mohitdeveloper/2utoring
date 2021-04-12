(function () {
    angular.module('standingOut.controllers').controller('WhiteboardLoadModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'userId', 'showShares', 'SessionWhiteBoardsService', 'DeleteService',
            'title', 'type',
            function ($scope, $log, $sce, close, ModalService, classSessionId, userId, showShares, SessionWhiteBoardsService, DeleteService,
                title, type) {

                $scope.classSessionId = classSessionId;
                $scope.showShares = showShares;
                $scope.userId = userId;
                $scope.savedWhiteboards = [];
                $scope.sharedWhiteboards = [];
                $scope.inactiveWhiteboards = [];
                $scope.toLoad = 1;
                $scope.loaded = 0;

                $scope.title = title;
                $scope.type = type;


                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    console.log('title', title);
                    console.log('type', type);
                    $scope.toLoad = 1;
                    $scope.loaded = 0;

                    $('.loading').show();
                    if ($scope.showShares) {
                        $scope.toLoad++;
                        $scope.getSharedWhiteboards();
                    }
                    if ($scope.type == 'Whiteboard') {
                        $scope.toLoad++;
                        $scope.getInactiveWhiteboards();
                    }
                    $scope.getSavedWhiteboards();
                };

                $scope.getSavedWhiteboards = function () {
                    SessionWhiteBoardsService.getMySavedWhiteBoards({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.savedWhiteboards = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.getSharedWhiteboards = function () {
                    SessionWhiteBoardsService.getMySharedWhiteBoards({ classSessionId: $scope.classSessionId, userId: $scope.userId }, function (success) {
                        $scope.sharedWhiteboards = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.getInactiveWhiteboards = function () {
                    SessionWhiteBoardsService.getMyInactiveWhiteboards({ classSessionId: $scope.classSessionId, userId: $scope.userId }, function (success) {
                        $scope.inactiveWhiteboards = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.incrementLoad = function () {
                    $scope.loaded = $scope.loaded + 1;
                    if ($scope.loaded >= $scope.toLoad) {
                        $('.loading').hide();
                    }
                };

                $scope.delete = function (index) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $('.loading').show();
                            SessionWhiteBoardsService.deleteSavedWhiteboard({ classSessionId: $scope.classSessionId, sessionWhiteBoardSaveId: $scope.savedWhiteboards[index].sessionWhiteBoardSaveId }, function () {
                                $scope.savedWhiteboards.splice(index, 1);
                                $('.loading').hide();
                                toastr.clear();
                                toastr.success('Delete successsful.');
                            }, function (err) {
                                $('.loading').hide();
                                toastr.clear();
                                toastr.error('Delete unsuccesssful.');
                            });
                        }
                    }, function (err) {
                    });
                };

                $scope.load = function (index) {
                    $scope.savedWhiteboards[index].isShared = false;
                    close($scope.savedWhiteboards[index], 100);
                };

                $scope.loadShare = function (index) {
                    $scope.sharedWhiteboards[index].isShared = true;
                    close($scope.sharedWhiteboards[index], 100);
                };

                $scope.loadWhiteboard = function (index) {
                    close($scope.inactiveWhiteboards[index], 100);
                };

                $scope.deleteWhiteboard = function (index) {
                    //$scope.sharedWhiteboards[index].isShared = true;
                    //close($scope.sharedWhiteboards[index], 100);
                };

                $scope.init();
            }
        ]);
})();