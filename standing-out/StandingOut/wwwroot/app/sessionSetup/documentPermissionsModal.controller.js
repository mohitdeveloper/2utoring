(function () {
    angular.module('standingOut.controllers').controller('DocumentPermissionsModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'fileIds', 'names', 'isJustUploaded', 'showWarning', 'SessionDocumentsService',
            function ($scope, $log, $sce, close, ModalService, classSessionId, fileIds, names, isJustUploaded, showWarning, SessionDocumentsService) {
                $scope.classSessionId = classSessionId;
                $scope.fileIds = fileIds;
                $scope.names = names;
                $scope.isJustUploaded = isJustUploaded;
                $scope.showWarning = showWarning;
                $scope.sessionAttendees = [];
                $scope.readToggle = true;
                $scope.writeToggle = true;

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    $('.loading').show();
                    if ($scope.names.length > 100) {
                        $scope.names = $scope.names.substring(0, 99) + '...';
                    }
                    $scope.getAttendees();
                };

                $scope.getAttendees = function () {
                    if ($scope.isJustUploaded) {
                        SessionDocumentsService.getAttendeesForFileSetupUpload({ classSessionId: $scope.classSessionId }, function (success) {
                            $scope.sessionAttendees = success;
                            $('.loading').hide();
                        }, function (err) {
                            $('.loading').hide();
                        });
                    }
                    else {
                        SessionDocumentsService.getAttendeesForFileSetup({ classSessionId: $scope.classSessionId, fileId: $scope.fileIds[0] }, function (success) {
                            $scope.sessionAttendees = success;
                            $scope.checkWriteToggleValid(false);
                            $scope.checkReadToggleValid(false);
                            $('.loading').hide();
                        }, function (err) {
                            $('.loading').hide();
                        });
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
                    SessionDocumentsService.shareFileUploadSetup({ classSessionId: $scope.classSessionId }, { FileIds: $scope.fileIds, SessionAttendees: $scope.sessionAttendees }, function (success) {
                        toastr.success('Share successsful.');
                    }, function (err) {
                        toastr.error('Share unsuccesssful.');
                    });
                    $scope.cancel();
                };

                $scope.init();
            }
        ]);
})();