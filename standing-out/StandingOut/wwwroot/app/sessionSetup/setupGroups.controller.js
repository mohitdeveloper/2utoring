(function () {
    angular.module('standingOut.controllers').controller('SetupGroupsController',
        ['$scope', 'ClassroomSessionsService', 'SessionGroupsService', 'DragDropService', 'ModalService', 'DeleteService',
            function ($scope, ClassroomSessionsService, SessionGroupsService, DragDropService, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $scope.toLoad = 1;
                $scope.loaded = 0;
                $scope.groups = [];
                $scope.tabsComplete = 0;
                $scope.tabsToWaitFor = 3;
                $scope.processing = false;

                $scope.incrementLoad = function () {
                    $scope.loaded++;

                    if ($scope.loaded >= $scope.toLoad) {
                        ClassroomSessionsService.updateInitListeners('init_complete');
                    }
                };

                $scope.$on('init_complete', function (event, args) {

                    $scope.tabsComplete++;
                    if ($scope.tabsComplete >= $scope.tabsToWaitFor) {
                        $('.loading').hide();
                    }
                });

                $scope.init = function () {
                    $('.loading').show();

                    SessionGroupsService.getDraggable({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.groups = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.addGroup = function () {
                    ModalService.showModal({
                        templateUrl: '/app/sessionGroup/sessionGroupModal.html',
                        controller: 'SessionGroupModalController',
                        inputs: {
                            group: { classSessionId: $scope.classSessionId }
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $('.loading').show();
                            $scope.init();
                        });
                    });
                };

                $scope.editGroup = function (group) {
                    ModalService.showModal({
                        templateUrl: '/app/sessionGroup/sessionGroupModal.html',
                        controller: 'SessionGroupModalController',
                        inputs: {
                            group: group
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $('.loading').show();
                            $scope.init();
                        });
                    });
                };

                $scope.deleteGroup = function (group) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $('.loading').show();
                            SessionGroupsService.delete({ classSessionId: $scope.classSessionId, id: group.sessionGroupId },
                                function (success) {
                                    $scope.init();
                                    toastr.success('Delete successsful.');
                                },
                                function (error) {
                                    $('.loading').hide();
                                    toastr.error('Delete unsuccesssful.');
                                }
                            );
                        }
                    }, function (err) {
                    });
                };

                $scope.sortableAttendees = {
                    accept: function (source, dest) {
                        return source.itemScope.modelValue.sessionAttendeeId;
                    },
                    orderChanged: function (event) {
                        //do nothing we don't care about the list order
                    },
                    itemMoved: function (event) {
                        $scope.processing = true;

                        var model = event.source.itemScope.item;
                        var newGroup = $(event.dest.sortableScope.element[0]).data('session-group-id');

                        SessionGroupsService.move({ classSessionId: $scope.classSessionId, sessionAttendeeId: model.sessionAttendeeId, sessionGroupId: newGroup }, null,
                            function (success) {
                                $scope.processing = false;
                                toastr.success('Move successsful.');
                            },
                            function (error) {
                                $('.loading').show();
                                $scope.processing = false;
                                $scope.init();
                                toastr.error('Move unsuccesssful.');
                            }
                        );                        
                    },
                    dragMove: DragDropService.dragMove
                };


                $scope.init();
            }
        ]);
})();