(function () {
    angular.module('standingOut.controllers').controller('MediaController',
        ['$scope', '$rootScope', 'SessionMediasService', '$sce', 'ModalService', 'DeleteService',
            function ($scope, $rootScope, SessionMediasService, $sce, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $rootScope.mediaItems = [];
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.loader = null;

                //USE $ROOTSCOPE IN THESE SUB CONTROLLERS TO AVOID SCOPE ISSUES WITH THE VIEWS

                $scope.init = function (paneId, toolBar) {
                    $scope.paneId = paneId;
                    $scope.toolBar = toolBar;
                    $scope.loader = document.getElementById('loader_' + $scope.paneId);
                    $scope.showLoader();

                    SessionMediasService.getForClassroom({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.mediaItems = success;
                        $scope.hideLoader();
                    }, function (err) {
                    });
                };

                $scope.showLoader = function () {
                    $scope.loader.style.display = 'block';
                };
                $scope.hideLoader = function () {
                    $scope.loader.style.display = 'none';
                };

                $scope.$on('toggleToolbar', function (event, data) {
                    if ($scope.paneId == data.paneId) {
                        $scope.toolBar = data.toolBar;
                    }
                });

                $scope.$on('mediaAdded', function (event, data) {
                    $scope.mediaItems.push(data);
                    toastr.clear();
                    toastr.info('The tutor has added new media');
                });

                $scope.$on('mediaEdited', function (event, data) {
                    for (var i = 0; i < $scope.mediaItems.length; i++) {
                        if ($scope.mediaItems[i].sessionMediaId == data.sessionMediaId) {
                            if ($scope.mediaItems[i].fullScreen == true) {
                                data.fullScreen = true;
                            }
                            $scope.mediaItems[i] = data;
                            toastr.clear();
                            toastr.info('The tutor has changed some media');
                            break;
                        }
                    }
                });

                $scope.$on('mediaDeleted', function (event, data) {
                    for (var i = 0; i < $scope.mediaItems.length; i++) {
                        if ($scope.mediaItems[i].sessionMediaId == data) {
                            if ($scope.mediaItems[i].fullScreen == true) {
                                $scope.mediaItems[i].fullScreen = false;
                                for (var j = 0; j < $scope.mediaItems.length; j++) {
                                    $scope.mediaItems[j].display = true;
                                }
                            }
                            $scope.mediaItems.splice(i, 1);
                            toastr.clear();
                            toastr.info('The tutor has removed some media');
                            break;
                        }
                    }
                });

                $scope.getPreviewString = function (media) {
                    if (media.content !== undefined && media.content != null && media.content.length > 0 && media.content.includes('.')) {
                        if (media.content.startsWith("https://") || media.content.startsWith("http://")) {
                            return media.content;
                        }
                        else {
                            return "https://" + media.content;
                        }
                    } else {
                        return '';
                    }
                };

                $scope.trust = function (media) {
                    var previewString = $scope.getPreviewString(media);
                    if (previewString == '')
                        return '';
                    else
                        return $sce.trustAsResourceUrl(previewString);
                };

                $scope.addMedia = function () {
                    ModalService.showModal({
                        templateUrl: '/app/sessionMedia/sessionMediaModals.html',
                        controller: 'SessionMediaModalController',
                        inputs: {
                            media: { classSessionId: $scope.classSessionId }
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result.success) {
                                $scope.mediaItems.push(result);
                                $rootScope.$broadcast('addMedia', { sessionMediaId: result.sessionMediaId });
                            }
                        });
                    });
                };

                $scope.editMedia = function (media, index) {
                    ModalService.showModal({
                        templateUrl: '/app/sessionMedia/sessionMediaModal.html',
                        controller: 'SessionMediaModalController',
                        inputs: {
                            media: media
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result.success) {
                                if ($scope.mediaItems[index].fullScreen == true) {
                                    result.fullScreen = true;
                                }
                                $scope.mediaItems[index] = result;
                                $rootScope.$broadcast('editMedia', { sessionMediaId: result.sessionMediaId });
                            }
                        });
                    });
                };

                $scope.deleteMedia = function (media, index) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $scope.showLoader();
                            SessionMediasService.delete({ classSessionId: $scope.classSessionId, id: media.sessionMediaId },
                                function (success) {
                                    if ($scope.mediaItems[index].fullScreen == true) {
                                        $scope.mediaItems[index].fullScreen = false;
                                        for (var i = 0; i < $scope.mediaItems.length; i++) {
                                            $scope.mediaItems[i].display = true;
                                        }
                                    }
                                    $scope.mediaItems.splice(index, 1);
                                    $rootScope.$broadcast('deleteMedia', { sessionMediaId: media.sessionMediaId });
                                    $scope.hideLoader();
                                    toastr.success('Delete successsful.');
                                },
                                function (error) {
                                    $scope.hideLoader();
                                    toastr.error('Delete unsuccesssful.');
                                }
                            );
                        }
                    }, function (err) {
                    });
                };

                $scope.pop = function (media) {

                    ModalService.showModal({
                        templateUrl: '/app/classroom/mediaViewModal.html',
                        controller: 'MediaViewModalController',
                        inputs: {
                            media: media
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $scope.init($scope.paneId, $scope.toolBar);
                        });
                    });
                };

                $scope.fullPaneView = function (index) {
                    for (var i = 0; i < $scope.mediaItems.length; i++) {
                        if (i == index) {
                            $scope.mediaItems[i].fullScreen = true;
                        } else {
                            $scope.mediaItems[i].display = false;
                        }
                    }
                };

                $scope.standardView = function (index) {
                    for (var i = 0; i < $scope.mediaItems.length; i++) {
                        $scope.mediaItems[i].fullScreen = false;
                        $scope.mediaItems[i].display = true;
                    }
                };
            }
        ]);

})();