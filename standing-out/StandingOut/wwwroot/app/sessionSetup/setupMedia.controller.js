(function () {
    angular.module('standingOut.controllers').controller('SetupMediaController',
        ['$scope', 'ClassroomSessionsService', 'SessionMediasService', '$sce', 'ModalService', 'DeleteService',
            function ($scope, ClassroomSessionsService, SessionMediasService, $sce, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $scope.toLoad = 1;
                $scope.loaded = 0;
                $scope.media = [];


                $scope.iframeTest = 'https://www.iostudios.co.uk/';
                $scope.youtubeTest = 'https://www.youtube.com/embed/WqJyzPglufI';

                $scope.trustSrc = function (src) {
                    return $sce.trustAsResourceUrl(src);
                };


                $scope.incrementLoad = function () {
                    $scope.loaded++;

                    if ($scope.loaded >= $scope.toLoad) {
                        ClassroomSessionsService.updateInitListeners('init_complete');
                    }
                };

                $scope.init = function () {
                    SessionMediasService.query({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.media = success;
                        $scope.incrementLoad();
                    }, function (err) {

                    });
                };

                $scope.addMedia = function () {
                    ModalService.showModal({
                        templateUrl: '/app/sessionMedia/sessionMediaModal.html',
                        controller: 'SessionMediaModalController',
                        inputs: {
                            media: { classSessionId: $scope.classSessionId }
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $('.loading').show();
                            $scope.init();
                        });
                    });
                };

                $scope.editMedia = function (media) {
                    ModalService.showModal({
                        templateUrl: '/app/sessionMedia/sessionMediaModal.html',
                        controller: 'SessionMediaModalController',
                        inputs: {
                            media: media
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $('.loading').show();
                            $scope.init();
                        });
                    });
                };

                $scope.deleteMedia = function (media) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $('.loading').show();
                            SessionMediasService.delete({ classSessionId: $scope.classSessionId, id: media.sessionMediaId },
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

                $scope.init();
            }
        ]);
})();