(function () {
    angular.module('standingOut.controllers').controller('FileController',
        ['$scope', '$rootScope', '$timeout', '$sce', 'SessionDocumentsService', 'ModalService', 'ClassroomSessionsService', 'DeleteService',
            function ($scope, $rootScope, $timeout, $sce, SessionDocumentsService, ModalService, ClassroomSessionsService, DeleteService) {
                $scope.classSessionId = classSessionId;
                $scope.files = [];
                $scope.depth = [];
                $scope.depthNames = ['Class Folder'];
                $scope.selectedDocument = null;
                $scope.parentFolder = undefined;
                $scope.navigationRunning = true;
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.myStudentFolderId = studentFolderId;

                $scope.pageNumber = 1;
                $scope.nextPage = undefined;
                $scope.previousPages = [];
                $scope.disallowUploadIn = [];
                $scope.studentFolders = [];
                $scope.studentIds = [];
                $scope.masterFolderId = undefined;
                $scope.sharedFolderId = undefined;
                $scope.studentFolderId = undefined;
                $scope.currentFolderId = undefined;

                $scope.chromeWarning = true;

                //USE $ROOTSCOPE IN THESE SUB CONTROLLERS TO AVOID SCOPE ISSUES WITH THE VIEWS

                $scope.init = function (paneId, toolBar, callbackSuccess, callbackFail, studentId = null, sharedFolder = false) {
                    $scope.paneId = paneId;
                    $scope.loader = document.getElementById('loader_' + $scope.paneId);
                    $scope.showLoader();
                    $scope.toolBar = false;
                    $scope.depthNames = ['Class Folder'];
                    $scope.selectedDocument = null;
                    $scope.parentFolder = undefined;
                    $scope.navigationRunning = true;

                    $scope.pageNumber = 1;
                    $scope.nextPage = undefined;
                    $scope.previousPages = [];

                    SessionDocumentsService.getForClassroom({ classSessionId: $scope.classSessionId, studentId: studentId, sharedFolder: sharedFolder }, function (success) {

                        $scope.files = success.files;
                        $scope.disallowUploadIn = success.disallowUploadIn;
                        $scope.studentFolders = success.studentFolders;
                        $scope.studentIds = success.studentIds;
                        $scope.studentFolderId = success.studentFolderId;
                        $scope.masterFolderId = success.masterFolderId;
                        $scope.sharedFolderId = success.sharedFolderId;
                        $scope.currentFolderId = success.currentFolderId;

                        if (studentId != null || sharedFolder == true) {
                            $scope.depth = [success.rootFolderId, success.studentFolderId, success.currentFolderId];
                            $scope.depthNames.push('Student Folders');
                            $scope.depthNames.push( sharedFolder == true ? 'Shared' : 'Student');
                            $scope.parentFolder = $scope.depth[$scope.depth.length - 2];
                        }                        
                        else {
                            if (success.rootFolderId !== undefined && success.rootFolderId != null) {
                                $scope.depth = [success.rootFolderId];
                            }
                            else if (success.files[0] !== undefined && success.files[0].parents != null && success.files[0].parents[0] !== undefined) {
                                $scope.depth = [success.files[0].parents[0]];
                            }
                        }

                        $scope.resetPagination(success.nextPageToken);
                        $scope.navigationRunning = false;
                        $scope.hideLoader();

                        // Checks in for any awaited commands
                        $rootScope.$broadcast('awaitedCommand', { paneId: $scope.paneId });

                        if (callbackSuccess != undefined) {
                            callbackSuccess();
                        }
                    }, function (err) {
                        $scope.navigationRunning = false;
                        $scope.hideLoader();

                        if (callbackFail != undefined) {
                            callbackFail();
                        }
                    });
                };

                $scope.showLoader = function () {
                    $scope.loader.style.display = 'block';
                };
                $scope.hideLoader = function () {
                    $scope.loader.style.display = 'none';
                };

                $scope.isChrome = function () {
                    return 'chrome' in window && window.navigator.userAgent.indexOf("Edg/") == -1;
                };

                $scope.$on('toggleToolbar', function (event, data) {
                    if ($scope.paneId == data.paneId) {
                        $scope.toolBar = data.toolBar;
                    }
                });

                /*************** TUTOR SEND START ***************/

                $scope.$on('openMainFolder', function (event, data) {
                    // This check ensures the correct file controller instance performs the instruction
                    if (data.paneId == $scope.paneId) {
                        $scope.init($scope.paneId, $scope.toolBar, null, null, data.userId);
                    }
                });

                $scope.$on('openSharedFolder', function (event, data) {
                    // This check ensures the correct file controller instance performs the instruction
                    if (data.paneId == $scope.paneId) {
                        $scope.init($scope.paneId, $scope.toolBar, null, null, data.userId, true);
                    }
                });

                /*************** TUTOR SEND END ***************/


                $scope.$on('filePermissionsChange', function (event, data) {
                    for (var i = 0; i < data.length; i++) {
                        if ($scope.selectedDocument != null && $scope.selectedDocument.includes('/d/' + data[i] + '/edit')) {
                            var tempDoc = $scope.selectedDocument;
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.selectedDocument = null;
                                });
                            });
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.selectedDocument = tempDoc;
                                });
                            }, 50);

                        }
                    }
                });


                $scope.inMaster = function () {
                    if ($scope.depth[$scope.depth.length - 1] == $scope.masterFolderId) {
                        return true;
                    }
                    return false;
                };

                $scope.uploadDisabled = function () {
                    if ($scope.currentFolderId == $scope.myStudentFolderId && $scope.isTutor == false) {
                        return false;
                    }
                    else if ($scope.depth.length == 1) {
                        return true;
                    }
                    else {
                        for (var i = 0; i < $scope.disallowUploadIn.length; i++) {
                            if ($scope.disallowUploadIn[i] == $scope.depth[$scope.depth.length - 1]) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                $scope.upload = function () {
                    var studentFolderId = null;
                    $scope.depth.forEach(function (level) {
                        $scope.studentFolders.forEach(function (studentFolder) {
                            if (studentFolder == level) {
                                studentFolderId = studentFolder;
                            }
                        });
                    });
                    $scope.showLoader();
                    ModalService.showModal({
                        templateUrl: '/app/classroom/documentUploadModal.html',
                        controller: 'DocumentUploadModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            names: '',
                            folderId: $scope.depth[$scope.depth.length - 1],
                            isMaster: $scope.inMaster(),
                            chooseFileActive: true,
                            fileIds: [],
                            toggleStart: true,
                            studentFolderId: studentFolderId
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result == true) {
                                $scope.navigateSame();
                            }
                            else {
                                $scope.hideLoader();
                            }
                        });
                    });
                };

                $scope.newFile = function (fileType) {
                    $scope.showLoader();
                    ModalService.showModal({
                        templateUrl: '/app/classroom/newFileModal.html',
                        controller: 'NewFileModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            folderId: $scope.depth[$scope.depth.length - 1],
                            fileType: fileType
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result == true) {
                                $scope.navigateSame();
                            }
                            else {
                                $scope.hideLoader();
                            }
                        });
                    });
                };

                $scope.getDownloadUrl = function (item) {
                    var url = '';
                    if (item.mimeType != "application/vnd.google-apps.spreadsheet" && item.mimeType != "application/vnd.google-apps.document" &&
                        item.mimeType != "application/vnd.google-apps.presentation" && item.mimeType != "application/vnd.google-apps.folder" &&
                        item.mimeType != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                        item.mimeType != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                        item.mimeType != "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                        url = item.webContentLink;
                    }

                    return url;
                };

                $scope.isFolder = function (mimeType) {
                    if (mimeType == "application/vnd.google-apps.folder") {
                        return true;
                    }
                    return false;
                };

                $scope.trust = function (link) {
                    return $sce.trustAsResourceUrl(link);
                };

                $scope.whiteboardAvailable = function (mimeType) {
                    return mimeType == "application/pdf" || mimeType == "image/png" || mimeType == "image/jpg" || mimeType == "image/jpeg" || mimeType == "image/bmp";
                };

                $scope.downloadAvailable = function (mimeType) {

                    if (mimeType != "application/vnd.google-apps.folder" && mimeType != "application/vnd.google-apps.spreadsheet" &&
                        mimeType != "application/vnd.google-apps.document" && mimeType != "application/vnd.google-apps.presentation") {
                        return true;
                    }

                    return false;
                };

                $scope.openAvailable = function (mimeType) {

                    if (mimeType != "application/vnd.google-apps.spreadsheet" &&
                        mimeType != "application/vnd.google-apps.document" && mimeType != "application/vnd.google-apps.presentation" &&
                        mimeType != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                        mimeType != "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
                        mimeType != "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                        return false;
                    }

                    return true;
                };

                // For importing a file into a whiteboard from google drive
                $scope.openInWhiteboard = function (item) {
                    // First we check this file is of the correct type again
                    if ($scope.whiteboardAvailable(item.mimeType)) {
                        // Then we send a message to perform this (first goes to header to check for showing whiteboards, then to whiteboard)
                        $scope.showLoader();
                        $rootScope.$broadcast("WhiteboardAvailableForImportFromFile", { fileId: item.id });
                    }
                };

                // The whitebaord import completed successfully or unsuccessfully - either way hide the loader
                $scope.$on("WhiteboardAvailableForImportResponse", function (event, data) {
                    $scope.hideLoader();
                });

                $scope.open = function (item) {

                    var url = '';

                    if (item.mimeType == "application/vnd.google-apps.folder") {
                        $scope.navigateDown(item.id, item.name);
                    }
                    else {

                        if (item.mimeType == "application/vnd.google-apps.spreadsheet" || item.mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                            url = 'https://docs.google.com/spreadsheets/d/' + item.id + '/edit';
                        }
                        else if (item.mimeType == "application/vnd.google-apps.document" || item.mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                            url = 'https://docs.google.com/document/d/' + item.id + '/edit';
                        }
                        else if (item.mimeType == "application/vnd.google-apps.presentation" || item.mimeType == "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                            url = 'https://docs.google.com/presentation/d/' + item.id + '/edit';
                        }
                        else {
                            url = item.webContentLink;
                        }

                        $scope.selectedDocument = url;

                        if ($scope.isChrome() && $scope.chromeWarning) {
                            toastr.info('It looks like you\'re on Chrome. If you can\'t access a file you may be logged into the browser as another user!');
                            $scope.chromeWarning = false;
                        }
                    }

                    return url;
                };

                $scope.openPopUp = function (item) {

                    var url = '';

                    if (item.mimeType == "application/vnd.google-apps.spreadsheet" || item.mimeType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                        url = 'https://docs.google.com/spreadsheets/d/' + item.id + '/edit';
                    }
                    else if (item.mimeType == "application/vnd.google-apps.document" || item.mimeType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                        url = 'https://docs.google.com/document/d/' + item.id + '/edit';
                    }
                    else if (item.mimeType == "application/vnd.google-apps.presentation" || item.mimeType == "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                        url = 'https://docs.google.com/presentation/d/' + item.id + '/edit';
                    }

                    if ($scope.isChrome() && $scope.chromeWarning) {
                        toastr.info('It looks like you\'re on Chrome. If you can\'t access a file you may be logged into the browser as another user!');
                        $scope.chromeWarning = false;
                    }

                    if (url != '') {
                        $scope.showLoader();
                        ModalService.showModal({
                            templateUrl: '/app/classroom/documentModal.html',
                            controller: 'DocumentModalController',
                            inputs: {
                                documentUrl: url
                            }
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                $scope.hideLoader();
                            });
                        });
                    }
                };

                $scope.permissionsSingleMaster = function (item) {
                    $scope.showLoader();
                    ModalService.showModal({
                        templateUrl: '/app/classroom/documentUploadModal.html',
                        controller: 'DocumentUploadModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            names: item.name,
                            folderId: $scope.depth[$scope.depth.length - 1],
                            isMaster: $scope.inMaster(),
                            chooseFileActive: false,
                            fileIds: [item.id],
                            toggleStart: false,
                            studentFolderId: null
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $scope.hideLoader();
                        });
                    });
                };

                $scope.permissionsSingle = function (item) {
                    var studentFolderId = null;
                    $scope.depth.forEach(function (level) {
                        $scope.studentFolders.forEach(function (studentFolder) {
                            if (studentFolder == level) {
                                studentFolderId = studentFolder;
                            }
                        });
                    });
                    $scope.showLoader();
                    ModalService.showModal({
                        templateUrl: '/app/classroom/documentUploadModal.html',
                        controller: 'DocumentUploadModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            names: item.name,
                            folderId: $scope.depth[$scope.depth.length - 1],
                            isMaster: $scope.inMaster(),
                            chooseFileActive: false,
                            fileIds: [item.id],
                            toggleStart: false,
                            studentFolderId: studentFolderId
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $scope.hideLoader();
                        });
                    });
                };

                $scope.$on('screenshotTaken', function () {
                    // ie if the save location is the current location
                    if ($scope.depth.length == 1) {
                        $scope.navigateSame();
                    }
                });

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
                        toastr.clear();
                        toastr.success('Page refreshed');
                    }, function () {
                            toastr.clear();
                            toastr.error('Refresh failed');
                    });
                };

                $scope.navigateSame = function (callbackSuccess, callbackFail) {
                    if (!$scope.navigationRunning) {
                        if ($scope.depth.length == 1) {
                            $scope.init($scope.paneId, $scope.toolBar, callbackSuccess, callbackFail);
                        }
                        else {
                            $scope.navigationRunning = true;
                            $scope.showLoader();

                            SessionDocumentsService.getForClassroomByFolderSame({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, function (success) {
                                $scope.currentFolderId = $scope.depth[$scope.depth.length - 1];
                                $scope.files = success.files;
                                if (success.resetToRoot) {
                                    $scope.depth = [success.resetToFolder];
                                    $scope.depthNames = ['Class Folder'];
                                    $scope.parentFolder = undefined;
                                    $scope.resetPagination(success.nextPageToken);
                                }
                                else {
                                    $scope.partResetPagination(success.nextPageToken);
                                }
                                $scope.navigationRunning = false;
                                $scope.hideLoader();

                                if (callbackSuccess != undefined) {
                                    callbackSuccess();
                                }
                            }, function (err) {
                                $scope.navigationRunning = false;
                                $scope.hideLoader();

                                if (callbackSuccess != undefined) {
                                    callbackFail();
                                }
                            });
                        }
                    }
                };

                $scope.navigateDown = function (id, name) {
                    if (!$scope.navigationRunning && $scope.depth[0] !== undefined && $scope.depth[$scope.depth.length - 1] != id) {
                        $scope.navigationRunning = true;
                        $scope.showLoader();

                        $scope.depth.push(id);
                        $scope.depthNames.push(name);

                        if ($scope.depth.length > 1) {
                            $scope.parentFolder = $scope.depth[$scope.depth.length - 2];
                        }

                        SessionDocumentsService.getForClassroomByFolderDown({ classSessionId: $scope.classSessionId, folderId: id }, function (success) {
                            $scope.files = success.files;
                            $scope.resetPagination(success.nextPageToken);
                            $scope.navigationRunning = false;
                            $scope.hideLoader();
                            $scope.currentFolderId = id;
                        }, function (err) {
                                $scope.navigationRunning = false;
                                $scope.hideLoader();
                            });
                    }
                };

                $scope.navigateUpTo = function (index) {
                    // Check that navigation isn't already running
                    if (!$scope.navigationRunning) {
                        // Ensure where we're navigating to exists
                        if ($scope.depth.length > index) {
                            // Set navigation running
                            $scope.navigationRunning = true;
                            $scope.showLoader();

                            // Get the files in this folder
                            SessionDocumentsService.getForClassroomByFolderUp({ classSessionId: $scope.classSessionId, folderId: $scope.depth[index] }, function (success) {
                                $scope.currentFolderId = $scope.depth[index];

                                // If the current position was not selected, remove the additional postitions
                                if ($scope.depth.length != index + 1) {
                                    $scope.depth.splice(index + 1, $scope.depth.length - (index + 1));
                                    $scope.depthNames.splice(index + 1, $scope.depthNames.length - (index + 1));
                                }

                                // Assign the parent, if there is one (Root folder parent is undefined)
                                if ($scope.depth.length > 1) {
                                    $scope.parentFolder = $scope.depth[index - 1];
                                }
                                else {
                                    $scope.parentFolder = undefined;
                                }

                                // Assign files
                                $scope.files = success.files;

                                // Reset pagination
                                $scope.resetPagination(success.nextPageToken);

                                // Stop navigation and hide loader
                                $scope.navigationRunning = false;
                                $scope.hideLoader();

                            }, function (err) {
                                // Stop navigation and hide loader
                                $scope.navigationRunning = false;
                                $scope.hideLoader();
                            });
                        }
                    }
                };

                $scope.navigateUp = function () {
                    if (!$scope.navigationRunning && $scope.depth[0] !== undefined) {
                        
                        if ($scope.depth.length <= 2) {
                            $scope.init($scope.paneId, $scope.toolBar);
                        }
                        else {
                            $scope.navigationRunning = true;
                            $scope.showLoader();
                            SessionDocumentsService.getForClassroomByFolderUp({ classSessionId: $scope.classSessionId, folderId: $scope.parentFolder }, function (success) {
                                $scope.currentFolderId = $scope.parentFolder;
                                $scope.files = success.files;

                                // Checks if was reset to the root folder as the above folder could not be found
                                if (success.resetToRoot) {
                                    $scope.depth = [success.resetToFolder];
                                    $scope.depthNames = ['Class Folder'];
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
                                $scope.hideLoader();

                            }, function (err) {
                                $scope.navigationRunning = false;
                                $scope.hideLoader();
                            });
                        }
                    }
                };

                $scope.getNextPage = function () {
                    if (!$scope.navigationRunning) {
                        $scope.navigationRunning = true;
                        $scope.showLoader();
                        var data = { pageToken: $scope.nextPage };
                        SessionDocumentsService.postForClassroomByFolderPage({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, data, function (success) {

                            $scope.files = success.files;
                            if (success.resetToRoot) {
                                $scope.depth = [success.resetToFolder];
                                $scope.depthNames = ['Class Folder'];
                                $scope.parentFolder = undefined;
                                $scope.resetPagination(success.nextPageToken);
                            } else {
                                $scope.nextPagination(success.nextPageToken);
                            }
                            $scope.navigationRunning = false;
                            $scope.hideLoader();
                        }, function (err) {
                            $scope.navigationRunning = false;
                            $scope.hideLoader();
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
                        if ($scope.pageNumber == 2 && $scope.depth.length == 1) {
                            $scope.init($scope.paneId, $scope.toolBar);
                        }
                        else {
                            $scope.navigationRunning = true;
                            $scope.showLoader();
                            var data = { pageToken: ($scope.previousPages.length > 1 ? $scope.previousPages[$scope.previousPages.length - 2] : '') };
                            SessionDocumentsService.postForClassroomByFolderPage({ classSessionId: $scope.classSessionId, folderId: $scope.depth[$scope.depth.length - 1] }, data, function (success) {

                                $scope.files = success.files;
                                if (success.resetToRoot) {
                                    $scope.depth = [success.resetToFolder];
                                    $scope.depthNames = ['Class Folder'];
                                    $scope.parentFolder = undefined;
                                    $scope.resetPagination(success.nextPageToken);
                                } else {
                                    $scope.previousPagination(success.nextPageToken);
                                }
                                $scope.navigationRunning = false;
                                $scope.hideLoader();
                            }, function (err) {
                                $scope.navigationRunning = false;
                                $scope.hideLoader();
                            });
                        }
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

                $scope.deleteDocument = function (item) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $scope.navigationRunning = true;
                            $scope.showLoader();
                            SessionDocumentsService.deleteFromClassroom({ classSessionId: $scope.classSessionId, id: item.id },
                                function (success) {
                                    $scope.resetPagination(undefined);
                                    $scope.navigationRunning = false;
                                    $scope.navigateSame();
                                    $scope.hideLoader();
                                    toastr.clear();
                                    toastr.success('Delete successsful.');
                                },
                                function (error) {
                                    $scope.hideLoader();
                                    toastr.clear();
                                    toastr.error('Delete unsuccesssful.');
                                    $scope.navigationRunning = false;
                                }
                            );
                        }
                    }, function (err) {
                    });
                };

                $scope.close = function () {
                    $scope.selectedDocument = null;
                };
            }
        ]);
})();