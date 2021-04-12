(function () {
    angular.module('standingOut.controllers').controller('DocumentUploadModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'names', 'folderId', 'isMaster', 'chooseFileActive', 'fileIds', 'toggleStart', 'studentFolderId', 'SessionDocumentsService',
            function ($scope, $log, $sce, close, ModalService, classSessionId, names, folderId, isMaster, chooseFileActive, fileIds, toggleStart, studentFolderId, SessionDocumentsService) {
                $scope.classSessionId = classSessionId;
                $scope.sessionAttendees = [];
                $scope.fileToUpload = undefined;
                $scope.chooseFileActive = chooseFileActive;
                $scope.toggleStart = toggleStart;
                $scope.readToggle = toggleStart;
                $scope.writeToggle = toggleStart;
                $scope.fileIds = fileIds == undefined ? [] : fileIds;
                $scope.names = names == undefined ? '' : names;
                $scope.isMaster = isMaster;
                $scope.folderId = folderId;
                $scope.result = false;
                $scope.hasJustUploaded = false;
                $scope.studentFolderId = studentFolderId;
                $scope.showPopup = false;

                $scope.cancel = function () {
                    $scope.closePopup($scope.hasJustUploaded);
                };

                $scope.init = function () {
                    $scope.getAttendees();
                };

                $scope.tempHidePopup = function () {
                    $scope.showPopup = false;
                };
                $scope.tempShowPopup = function () {
                    $scope.showPopup = true;
                };

                $scope.getAttendees = function () {
                    if ($scope.isMaster) {
                        //SessionDocumentsService.getAttendeesForFileUpload({ classSessionId: $scope.classSessionId }, function (success) {
                        SessionDocumentsService.getMasterFilePermission({ classSessionId: $scope.classSessionId, fileId: $scope.fileIds[0]}, function (success) {
                            $scope.sessionAttendees = success;
                            //$scope.embelishAttendees();
                            $scope.tempShowPopup();
                        }, function (err) {
                            toastr.clear();
                            toastr.error('There was an error fetching students');
                            close($scope.result);
                        });
                    }
                    else if (!chooseFileActive) {
                        SessionDocumentsService.getPermissions({ classSessionId: $scope.classSessionId, fileId: $scope.fileIds[0], folderId: studentFolderId }, function (success) {
                            $scope.sessionAttendees = success;
                            $scope.checkReadToggleValid(true);
                            $scope.checkWriteToggleValid(true);
                            //$scope.embelishAttendees();
                            $scope.tempShowPopup();
                        }, function (err) {
                            toastr.clear();
                            toastr.error('There was an error fetching permissions');
                            close($scope.result);
                        });
                    }
                    else {
                        $scope.tempShowPopup();
                    }
                };

                $scope.embelishAttendees = function () {
                    for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                        $scope.sessionAttendees[i].isReadable = $scope.toggleStart;
                        $scope.sessionAttendees[i].isWriteable = $scope.toggleStart;
                    }
                };

                $scope.setFiles = function (files) {
                    if (files.length > 0) {
                        $scope.files = files;

                        $scope.toUpload = $scope.files.length;
                        $scope.uploaded = 0;

                        $scope.performUploads();
                    }
                };

                $scope.performUploads = function () {
                    $scope.tempHidePopup();
                    for (var i = 0; i < $scope.files.length; i++) {
                        var data = { file: $scope.files[i] };
                        $scope.performUpload(data);
                    }
                };

                $scope.performUpload = function (data) {
                    SessionDocumentsService.uploadFromClassroom(data, $scope.classSessionId, $scope.folderId, function (success) {
                        $scope.fileIds.push(success);
                        if ($scope.names == '') {
                            $scope.names = data.file.name;
                        }
                        else {
                            $scope.names = $scope.names + ', ' + data.file.name;
                        }
                        $scope.incrementUpload();
                    }, function (err) {
                        toastr.clear();
                        toastr.error(($scope.fileIds.length > 1 ? 'The files were' : 'This file was') + ' not uploaded successfully.');
                            $scope.closePopup(false);
                    });
                };

                $scope.incrementUpload = function () {
                    $scope.uploaded++;

                    if ($scope.uploaded >= $scope.toUpload) {
                        toastr.clear();
                        toastr.success(($scope.fileIds.length > 1 ? 'The files were' : 'This file was') + ' uploaded successfully.');
                        if ($scope.isMaster) {
                            $scope.uploaded = 0;
                            if ($scope.names.length > 100) {
                                $scope.names = $scope.names.substring(0, 99) + '...';
                            }
                            $scope.chooseFileActive = false;
                            $scope.hasJustUploaded = true;
                            $scope.result = true;
                            $scope.tempShowPopup();
                        }
                        else if ($scope.fileIds.length == 1) {
                            SessionDocumentsService.getPermissions({ classSessionId: $scope.classSessionId, fileId: $scope.fileIds[0], folderId: studentFolderId }, function (success) {
                                $scope.sessionAttendees = success;
                                $scope.embelishAttendees();
                                $scope.uploaded = 0;
                                if ($scope.names.length > 100) {
                                    $scope.names = $scope.names.substring(0, 99) + '...';
                                }
                                $scope.chooseFileActive = false;
                                $scope.hasJustUploaded = true;
                                $scope.result = true;
                                $scope.tempShowPopup();
                            }, function (err) {
                                    $scope.closePopup(true);
                            });
                        }
                        else {
                            $scope.closePopup(true);
                        }
                    }
                };

                $scope.setWrite = function () {

                    for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                        if ($scope.sessionAttendees[i].isWriteable != $scope.writeToggle) {
                            $scope.sessionAttendees[i].isWriteable = $scope.writeToggle;
                        }
                    }

                    if ($scope.writeToggle) {
                        $scope.readToggle = true;
                        $scope.setRead();
                    }
                };

                $scope.setRead = function () {
                    for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                        if ($scope.sessionAttendees[i].isReadable != $scope.readToggle) {
                            $scope.sessionAttendees[i].isReadable = $scope.readToggle;
                        }
                    }

                    if (!$scope.readToggle) {
                        $scope.writeToggle = false;
                        $scope.setWrite();
                    }
                };

                $scope.writeChanged = function (index) {
                    if ($scope.sessionAttendees[index].isWriteable && !$scope.sessionAttendees[index].isReadable) {
                        $scope.sessionAttendees[index].isReadable = true;
                        $scope.checkReadToggleValid($scope.sessionAttendees[index].isReadable);
                    }
                    $scope.checkWriteToggleValid($scope.sessionAttendees[index].isWriteable);
                };
                
                $scope.readChanged = function (index) {
                    if (!$scope.sessionAttendees[index].isReadable && $scope.sessionAttendees[index].isWriteable) {
                        $scope.sessionAttendees[index].isWriteable = false;
                        $scope.checkWriteToggleValid($scope.sessionAttendees[index].isWriteable);
                    }
                    $scope.checkReadToggleValid($scope.sessionAttendees[index].isReadable);
                };

                $scope.checkWriteToggleValid = function (newValue) {
                    if (newValue != $scope.writeToggle) {
                        for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                            if ($scope.sessionAttendees[i].isWriteable == $scope.writeToggle) {
                                return;
                            }
                        }
                        $scope.writeToggle = newValue;
                    }
                };

                $scope.checkReadToggleValid = function (newValue) {
                    if (newValue != $scope.readToggle) {
                        for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                            if ($scope.sessionAttendees[i].isReadable == $scope.readToggle) {
                                return;
                            }
                        }
                        $scope.readToggle = newValue;
                    }
                };

                $scope.share = function () {
                    // Checks any are shared and sends request if one is found
                    for (var i = 0; i < $scope.sessionAttendees.length; i++) {
                        if ($scope.sessionAttendees[i].isReadable) {
                            toastr.info('Starting file share... This can take a moment');
                            SessionDocumentsService.shareFileUpload({ classSessionId: $scope.classSessionId }, { FileIds: $scope.fileIds, SessionAttendees: $scope.sessionAttendees }, function (success) {
                                toastr.clear();
                                toastr.success(($scope.fileIds.length > 1 ? 'The files were' : 'This file was') + ' shared successfully.');
                            }, function (err) {
                                toastr.clear();
                                toastr.error(($scope.fileIds.length > 1 ? 'The files were' : 'This file was') + ' not shared successfully.');
                            });
                            break;
                        }
                    }
                    $scope.closePopup($scope.result);
                };

                $scope.permissions = function () {
                    SessionDocumentsService.updatePermissions({ classSessionId: $scope.classSessionId }, { FileIds: $scope.fileIds, SessionAttendees: $scope.sessionAttendees }, function (success) {
                        toastr.clear();
                        toastr.success('File permissions updated.');
                    }, function (err) {
                        toastr.clear();
                        toastr.error('File permissions couldn\'t be updated.');
                    });
                    $scope.closePopup($scope.result);
                };

                $scope.closePopup = function (result) {
                    close(result);
                };

                $scope.init();
            }
        ]);
})();