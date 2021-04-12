(function () {
    angular.module('standingOut.controllers').controller('SetupDocumentsController',
        ['$scope', 'ClassroomSessionsService', 'SessionDocumentsService', 'ModalService', 'DeleteService',
            function ($scope, ClassroomSessionsService, SessionDocumentsService, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $scope.toLoad = 1;
                $scope.loaded = 0;
                $scope.documents = [];
                $scope.depth = [];
                $scope.depthNames = ['Class'];
                $scope.selectedDocument = undefined;
                $scope.parentFolder = undefined;
                $scope.navigationRunning = false;
                $scope.masterFolderId = undefined;
                $scope.fileIdsUploaded = [];
                $scope.namesUploaded = '';

                $scope.pageNumber = 1;
                $scope.nextPage = undefined;
                $scope.previousPages = [];

                $scope.disallowUploadIn = [];
                $scope.disallowDeleteOn = [];
                $scope.showAsImportant = [];

                $scope.incrementLoad = function () {
                    $scope.loaded++;

                    if ($scope.loaded >= $scope.toLoad) {
                        ClassroomSessionsService.updateInitListeners('init_complete');
                    }
                };

                $scope.init = function () {
                    $('.loading').show();


                    SessionDocumentsService.getForSetup({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.disallowUploadIn = success.disallowUploadIn;
                        $scope.masterFolderId = success.masterFolderId;
                        $scope.showAsImportant = success.showAsImportant;
                        $scope.disallowDeleteOn = success.disallowDeleteOn;
                        $scope.assignDocumentsWithCheckboxes(success.files);
                        if (success.files[0] !== undefined && success.files[0].parents[0] !== undefined) {
                            $scope.depth = [success.files[0].parents[0]];
                            $scope.depthNames = ['Class'];
                        }
                        $scope.resetPagination(success.nextPageToken);
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.uploadDisabled = function () {
                    if ($scope.depth.length == 1) {
                        return true;
                    }
                    for (var i = 0; i < $scope.disallowUploadIn.length; i++) {
                        if ($scope.disallowUploadIn[i] == $scope.depth[$scope.depth.length - 1]) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.permissionsMultiple = function () {
                    if ($scope.documents != null && $scope.documents != []) {
                        for (var i = 0; i < $scope.documents.length; i++) {
                            if ($scope.documents[i].includeInShare == true) {
                                $scope.setupForPermissions($scope.documents[i].id, $scope.documents[i].name);
                            }
                        }
                        if ($scope.fileIdsUploaded.length == 1) {
                            $scope.permissions(false, false);
                        }
                        else {
                            $scope.permissions(true, true);
                        }
                    }
                };

                $scope.permissionsSingle = function (item) {
                    $scope.namesUploaded = item.name;
                    $scope.fileIdsUploaded = [item.id];
                    $scope.permissions(false, false);
                };

                $scope.permissions = function (isJustUploaded, showWarning) {
                    ModalService.showModal({
                        templateUrl: '/app/sessionSetup/documentPermissionsModal.html',
                        controller: 'DocumentPermissionsModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            fileIds: $scope.fileIdsUploaded,
                            names: $scope.namesUploaded,
                            isJustUploaded: isJustUploaded,
                            showWarning: showWarning
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $scope.fileIdsUploaded = [];
                            $scope.namesUploaded = '';
                        });
                    });
                };

                $scope.delete = function (item) {
                    if ($scope.canDelete(item)) {
                        DeleteService.confirm(function (result) {
                            if (result == true) {
                                $scope.navigationRunning = true;
                                $('.loading').show();
                                SessionDocumentsService.deleteFromSetup({ classSessionId: $scope.classSessionId, id: item.id },
                                    function (success) {
                                        $scope.resetPagination(undefined);
                                        $scope.navigationRunning = false;
                                        $scope.navigateSame();
                                        $('.loading').hide();
                                        toastr.success('Delete successsful.');
                                    },
                                    function (error) {
                                        $('.loading').hide();
                                        toastr.error('Delete unsuccesssful.');
                                        $scope.navigationRunning = false;
                                    }
                                );
                            }
                        }, function (err) {
                        });
                    }
                };

                $scope.getDownloadUrl = function (item) {

                    var url = '';

                    if (item.mimeType != "application/vnd.google-apps.folder") {
                        if (item.mimeType == "application/vnd.google-apps.spreadsheet") {
                            url = 'https://docs.google.com/spreadsheets/d/' + item.id;
                        }
                        else if (item.mimeType == "application/vnd.google-apps.document") {
                            url = 'https://docs.google.com/document/d/' + item.id;
                        }
                        else if (item.mimeType == "application/vnd.google-apps.presentation") {
                            url = 'https://docs.google.com/presentation/d/' + item.id;
                        }
                        else {
                            url = item.webContentLink;
                        }

                    }

                    return url;
                };

                $scope.setFiles = function (files) {
                    $scope.files = files;

                    $scope.toUpload = $scope.files.length;
                    $scope.uploaded = 0;

                    if ($scope.files.length > 0) {
                        $('.loading').show();

                        for (var i = 0; i < $scope.files.length; i++) {
                            var data = { file: $scope.files[i] };
                            SessionDocumentsService.upload(data, $scope.classSessionId, $scope.depth[$scope.depth.length - 1], function (success) {
                                if (success.parents[0] !== undefined && success.parents[0] == $scope.depth[$scope.depth.length - 1]) {
                                    $scope.documents.push(success);
                                }
                                $scope.incrementUpload(success.id, success.name);
                            }, function (err) {
                                $scope.incrementUpload();
                            });
                        }
                    }

                };

                $scope.resetPagination = function (nextPageToken) {
                    $scope.previousPages = [];
                    $scope.partResetPagination(nextPageToken);
                };

                $scope.partResetPagination = function (nextPageToken) {
                    $scope.pageNumber = 1;
                    if (nextPageToken !== undefined && nextPageToken != null) {
                        $scope.nextPage = nextPageToken;
                    }
                    else {
                        $scope.nextPage = undefined;
                    }
                };

                $scope.refresh = function () {
                    $scope.navigateSame(function () {
                        toastr.success('Page refreshed');
                    }, function () {
                        toastr.error('Refresh failed');
                    });
                };

                $scope.inMaster = function () {
                    if ($scope.depth[$scope.depth.length - 1] == $scope.masterFolderId) {
                        return true;
                    }
                    return false;
                };

                $scope.canDelete = function (item) {
                    return $scope.disallowDeleteOn.length > 0 && $scope.disallowDeleteOn.every(function (value) {
                        return value != item.id;
                    });
                };

                $scope.showShareButton = function () {
                    if ($scope.documents == null || $scope.documents == [] || !$scope.inMaster()) {
                        return false;
                    }
                    else {
                        for (var i = 0; i < $scope.documents.length; i++) {
                            if ($scope.documents[i].includeInShare == true) {
                                return true;
                            }
                        }
                        return false;
                    }
                };

                $scope.assignDocumentsWithCheckboxes = function (files) {
                    if (files != null) {
                        for (var i = 0; i < files.length; i++) {
                            files.includeInShare = false;
                            if ($scope.showAsImportant.includes(document.id)) {
                                files.showBold = true;
                            }
                        }
                        files.sort(function (file) {
                            if (file.showBold == true) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        });
                    }
                    $scope.documents = files;
                };

                $scope.navigateSame = function (callbackSuccess, callbackFail) {
                    if (!$scope.navigationRunning) {
                        $scope.navigationRunning = true;
                        $('.loading').show();

                        SessionDocumentsService.getForSetupByFolderSame({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, function (success) {

                            $scope.assignDocumentsWithCheckboxes(success.files);
                            if (success.resetToRoot) {
                                $scope.depth = [success.resetToFolder];
                                $scope.depthNames = ['Class'];
                                $scope.parentFolder = undefined;
                                $scope.resetPagination(success.nextPageToken);
                            }
                            else {
                                $scope.partResetPagination(success.nextPageToken);
                            }
                            $scope.navigationRunning = false;
                            $('.loading').hide();

                            if (callbackSuccess != undefined) {
                                callbackSuccess();
                            }
                        }, function (err) {
                            $scope.navigationRunning = false;
                            $('.loading').hide();

                            if (callbackSuccess != undefined) {
                                callbackFail();
                            }
                            });

                    }
                };

                $scope.navigateDown = function (item) {
                    var id = item.id;
                    if (!$scope.navigationRunning && $scope.depth[0] !== undefined && $scope.depth[$scope.depth.length - 1] != id) {
                        $scope.navigationRunning = true;
                        $('.loading').show();

                        $scope.depth.push(id);
                        $scope.depthNames.push(item.name);

                        if ($scope.depth.length > 1) {
                            $scope.parentFolder = $scope.depth[$scope.depth.length - 2];
                        }

                        SessionDocumentsService.getForSetupByFolderDown({ classSessionId: $scope.classSessionId, folderId: id }, function (success) {
                            $scope.assignDocumentsWithCheckboxes(success.files);
                            $scope.resetPagination(success.nextPageToken);
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        }, function (err) {
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        });
                    }
                };

                $scope.navigateUp = function () {
                    if (!$scope.navigationRunning && $scope.depth[0] !== undefined) {
                        $scope.navigationRunning = true;
                        $('.loading').show();
                        SessionDocumentsService.getForSetupByFolderUp({ classSessionId: $scope.classSessionId, folderId: $scope.parentFolder }, function (success) {

                            $scope.assignDocumentsWithCheckboxes(success.files);

                            // Checks if was reset to the root folder as the above folder could not be found
                            if (success.resetToRoot) {
                                $scope.depth = [success.resetToFolder];
                                $scope.depthNames = ['Class'];
                                $scope.parentFolder = undefined;
                            }
                            else {
                                if ($scope.depth.length < 2) {
                                    $scope.parentFolder = undefined;
                                }
                                else if ($scope.depth[$scope.depth.length - 1] != $scope.parentFolder) {
                                    $scope.depth.pop();
                                    $scope.depthNames.pop();
                                    $scope.parentFolder = $scope.depth[$scope.depth.length - 2];
                                }
                            }

                            $scope.resetPagination(success.nextPageToken);

                            $scope.navigationRunning = false;
                            $('.loading').hide();

                        }, function (err) {
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        });
                    }
                };

                $scope.getNextPage = function () {
                    if (!$scope.navigationRunning) {
                        $scope.navigationRunning = true;
                        $('.loading').show();
                        var data = { pageToken: $scope.nextPage };
                        SessionDocumentsService.postForSetupByFolderPage({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, data, function (success) {

                            $scope.assignDocumentsWithCheckboxes(success.files);
                            if (success.resetToRoot) {
                                $scope.depth = [success.resetToFolder];
                                $scope.depthNames = ['Class'];
                                $scope.parentFolder = undefined;
                                $scope.resetPagination(success.nextPageToken);
                            } else {
                                $scope.nextPagination(success.nextPageToken);
                            }
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        }, function (err) {
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        });
                    }
                };

                $scope.nextPagination = function (nextPageToken) {
                    $scope.previousPages.push($scope.nextPage);
                    $scope.pageNumber = $scope.pageNumber + 1;
                    if (nextPageToken !== undefined && nextPageToken != null) {
                        $scope.nextPage = nextPageToken;
                    }
                    else {
                        $scope.nextPage = undefined;
                    }
                };

                $scope.getPreviousPage = function () {
                    if (!$scope.navigationRunning) {
                        $scope.navigationRunning = true;
                        $('.loading').show();
                        var data = { pageToken: ($scope.previousPages.length > 1 ? $scope.previousPages[$scope.previousPages.length - 2] : '') };
                        SessionDocumentsService.postForClassroomByFolderPage({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, data, function (success) {

                            $scope.assignDocumentsWithCheckboxes(success.files);
                            if (success.resetToRoot) {
                                $scope.depth = [success.resetToFolder];
                                $scope.depthNames = ['Class'];
                                $scope.parentFolder = undefined;
                                $scope.resetPagination(success.nextPageToken);
                            } else {
                                $scope.previousPagination(success.nextPageToken);
                            }
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        }, function (err) {
                            $scope.navigationRunning = false;
                            $('.loading').hide();
                        });
                    }
                };

                $scope.previousPagination = function (nextPageToken) {
                    if ($scope.previousPages.length > 0) {
                        $scope.nextPage = $scope.previousPages[$scope.previousPages.length - 1];
                        $scope.previousPages.pop();
                        $scope.pageNumber = $scope.pageNumber - 1;
                    }
                    else {
                        $scope.resetPagination(nextPageToken);
                    }
                };

                $scope.open = function (item) {

                    if (item.mimeType == "application/vnd.google-apps.folder") {
                        $scope.navigateDown(item);
                    }
                };

                $scope.incrementUpload = function (id, name) {
                    $scope.uploaded++;
                    if (id != undefined) {
                        $scope.setupForPermissions(id, name);
                    }

                    if ($scope.uploaded >= $scope.toUpload) {
                        $('.loading').hide();
                        $scope.uploaded = 0;
                        if ($scope.inMaster()) {
                            $scope.permissions(true, false);
                        }
                        else {
                            $scope.fileIdsUploaded = [];
                        }
                    }
                };

                $scope.setupForPermissions = function (id, name) {
                    $scope.fileIdsUploaded.push(id);
                    if ($scope.namesUploaded == '') {
                        $scope.namesUploaded = name;
                    }
                    else {
                        $scope.namesUploaded = $scope.namesUploaded + ', ' + name;
                    }
                };

                $scope.init();
            }
        ]);
})();