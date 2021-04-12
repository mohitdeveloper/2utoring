(function () {
    angular.module('standingOut.controllers').controller('StudentCommandController',
        ['$scope', '$rootScope', '$timeout', 'ModalService',
            function ($scope, $rootScope, $timeout, ModalService) {
                $scope.classSessionId = classSessionId;
                $scope.groupId = groupId == 'null' || groupId == ''  ? null : groupId;
                $scope.isOpen = true;
                $scope.studentConnection = null;
                $scope.userId = userId;
                $scope.hubUrl = hubUrl;
                $scope.lastPing = null;
                $scope.pingSpacing = 1000 * 60 * 10;
                $scope.pingBuffer = $scope.pingSpacing + (1000 * 20);
                $scope.signalRDisconnect = false;

                $scope.studentConnection = new signalR.HubConnectionBuilder()
                    .withUrl($scope.hubUrl + '/hubs/tutorcommand', {
                        accessTokenFactory: () => {
                            // Get and return the access token.
                            // This function can return a JavaScript Promise if asynchronous
                            // logic is required to retrieve the access token.
                            return accessToken;
                        }
                    })
                    //.configureLogging(signalR.LogLevel.Debug)
                    .build();

                $scope.studentConnection.onclose(function () {
                    $scope.signalRReconnect();
                });

                $scope.$on('signalRDisconnect', function (event, args) {
                    $scope.signalRReconnect();
                });

                $scope.signalRReconnect = function () {
                    if (!$scope.signalRDisconnect) {
                        $scope.signalRDisconnect = true;
                        alert('Oops, it looks like you\'ve got disconnected! Hit okay and we\'ll refresh the browser (don\'t worry, we\'ve safely stored your whiteboards and files)');
                        window.location.reload();
                    }
                };

                // #region File Calls

                $scope.studentConnection.on('filePermissionsChange', function (fileIds) {
                    $rootScope.$broadcast('filePermissionsChange', fileIds);
                });

                // #endregion File Calls

                $scope.init = function () {
                    $scope.studentConnection.start().then(function () {
                        $scope.studentConnection.invoke('connect', $scope.classSessionId, $scope.groupId);
                        $scope.extendPing();
                        $scope.setupPing($scope.pingSpacing);
                    })
                        .catch(function (err) {
                            //failed to connect
                            return console.error(err.toString());

                        });

                    $scope.studentConnection.on('sessionEnded', function (userId) {
                        $rootScope.sessionEnded = true;
                        $('.loading').show();
                        sessionEnded = true; //global var to stop the prompt on leave
                        window.location = '/f/' + $scope.classSessionId;

                    });
                };

                $scope.extendPing = function () {
                    $scope.lastPing = new Date();
                };

                $scope.setupPing = function (toTimeout) {
                    $timeout(function () {
                        if ((new Date()).getTime() - $scope.pingBuffer < $scope.lastPing.getTime()) {
                            $scope.studentConnection.invoke('ping');
                            $scope.lastPing = new Date();
                            $scope.setupPing($scope.pingSpacing);
                        }
                        else {
                            $scope.setupPing($scope.pingSpacing - ((new Date()).getTime() - $scope.lastPing.getTime()));
                        }
                    }, toTimeout)
                };

                $scope.studentConnection.on('pingTutorCommand', function () {
                });

                $scope.toggle = function () {
                    $scope.isOpen = !$scope.isOpen;
                };

                $scope.studentConnection.on('sessionStarted', function (dueEndDate) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $rootScope.sessionStarted = true;
                            toastr.clear();
                            toastr.success('The lesson has now started and your screen has been cleared.');
                            $rootScope.$broadcast('sessionHasStarted', dueEndDate);
                            $rootScope.$broadcast('startTimer', dueEndDate);
                        });
                    });
                });

                $scope.studentConnection.on('checkOnline', function (data) {
                    $scope.studentConnection.invoke('studentOnlineRequest', $scope.classSessionId);
                    $scope.extendPing();
                });

                $scope.studentConnection.on('studentPermissionChange', function (data) {
                    if (data.friendlyPermissionChanged != null) {
                        $scope.permissionsChangeToastr(data.friendlyPermissionChanged, data.permissionChangedTo);
                    }
                    $rootScope.$broadcast('studentPermissionChange', data);
                });

                $scope.permissionsChangeToastr = function (permission, onOff) {
                    if (onOff) {
                        toastr.clear();
                        toastr.info('You have been given access to ' + permission);
                    }
                    else {
                        toastr.clear();
                        toastr.info('Your access has been removed for ' + permission);
                    }
                };

                $scope.studentConnection.on('allPermissionChangeChat', function (chatActive) {
                    $scope.permissionsChangeToastr('Classroom Chat', chatActive);
                    $rootScope.$broadcast('allPermissionChangeChat', chatActive);
                });

                $scope.studentConnection.on('groupPermissionChangeChat', function (chatActive) {
                    $scope.permissionsChangeToastr('Group Chat', chatActive);
                    $rootScope.$broadcast('groupPermissionChangeChat', chatActive);
                });

                $scope.studentConnection.on('individualPermissionChangeChat', function (chatActive) {
                    $scope.permissionsChangeToastr('Individual Chat', chatActive);
                    $rootScope.$broadcast('individualPermissionChangeChat', chatActive);
                });

                $scope.studentConnection.on('mediaAdded', function (media) {
                    $rootScope.$broadcast('mediaAdded', media);
                });

                $scope.studentConnection.on('mediaEdited', function (media) {
                    $rootScope.$broadcast('mediaEdited', media);
                });

                $scope.studentConnection.on('mediaDeleted', function (media) {
                    $rootScope.$broadcast('mediaDeleted', media);
                });

                $rootScope.$on('askForHelp', function (event) {
                    $scope.studentConnection.invoke('askForHelp', $scope.classSessionId);
                    $scope.extendPing();
                });

                $scope.studentConnection.on('helpComing', function () {
                    $rootScope.$broadcast('helpComing');
                });

                /*************** CALLING START ***************/
                $scope.$on('callUser', function (event, args) {
                    $scope.studentConnection.invoke('callUser', args.classSessionId, args.userId);
                    $scope.extendPing();
                });

                $scope.$on('startGroupCallFromStudent', function (event, args) {
                    $scope.studentConnection.invoke('callGroup', args.classSessionId, args.groupId);
                    $scope.extendPing();
                });

                $scope.$on('startAllCallFromStudent', function (event, args) {
                    $scope.studentConnection.invoke('callAll', args.classSessionId);
                    $scope.extendPing();
                });

                $scope.studentConnection.on('startCall', function (roomId, users) {
                    $rootScope.$broadcast('startCall', { roomId: roomId, users: users });
                });

                $scope.studentConnection.on('receiveCall', function (data, incomingUserId) {
                    $rootScope.$broadcast('receiveCall', data, incomingUserId);
                });

                $scope.studentConnection.on('cancelledCall', function (roomId) {
                    $rootScope.$broadcast('cancelledCall', roomId);
                });

                $scope.studentConnection.on('callDeclined', function (roomId, userId, name, userThatMadeCallId) {
                    if (userThatMadeCallId == $scope.userId) {
                        toastr.clear();
                        toastr.info('The call was declined by ' + name);
                        $rootScope.$broadcast('callDeclined', userId, userThatMadeCallId);
                    }
                });

                $scope.$on('callDeclinedBy', function (event, args) {
                    $scope.studentConnection.invoke('callDeclined', $scope.classSessionId, args.roomId, args.userThatMadeCallId);
                    $scope.extendPing();
                });

                $scope.$on('screenShare', function (event, args) {
                    $scope.studentConnection.invoke('screenShare', $scope.classSessionId, args.screenMuted, args.room);
                    $scope.extendPing();
                });

                $scope.studentConnection.on('screenShared', function (screenMuted, room, userId) {
                    $rootScope.$broadcast('receivescreenShared', { screenMuted: screenMuted, roomId: room, userId: userId });                
                });

                /*************** CALLING END ***************/

                /*************** FORCE MODE START ***************/

                $scope.studentConnection.on('toggleForceMode', function (forceMode, roomId) {
                    $rootScope.$broadcast('receiveToggleForceMode', { forceMode: forceMode, roomId: roomId });                
                });

                /*************** FORCE MODE END ***************/

                /*************** GROUP ASSIGNMENT START ***************/

                // The student themself has been moved into a group
                $scope.studentConnection.on('groupMoved', function (groupId, name, webcamRoom) {
                    if ($scope.groupId != null) {
                        $scope.studentConnection.invoke('disconnectFromGroup', $scope.groupId);
                    }
                    $scope.studentConnection.invoke('connectToGroup', groupId);
                    $scope.extendPing();
                    $scope.groupId = groupId;
                    $rootScope.$broadcast('groupMoved', groupId);
                    $rootScope.$broadcast('groupMovedWebcam', webcamRoom);
                    toastr.clear();
                    toastr.info('You were added to the group "' + name + '"');
                });

                // Another student has been removed from this student's current group
                $scope.studentConnection.on('groupAlteredRemove', function (room) {
                    // Make sure this user isn't one of the one removed
                    for (var i = 0; i < room.users.length; i++) {
                        if (room.users[i].userId == $scope.userId) {
                            return;
                        }
                    }
                    // If not let's get removing
                    $rootScope.$broadcast('groupAlteredRemove', room);
                });

                // Another student has been moved into this student's current group
                $scope.studentConnection.on('groupAlteredAdd', function (room) {
                    $rootScope.$broadcast('groupAlteredAdd', room);
                });

                // Another student has been removed from the current group
                $scope.studentConnection.on('groupUsersRemoved', function (groupId, userIds) {
                    $rootScope.$broadcast('groupUsersRemoved', { groupId: groupId, userIds: userIds });
                });

                // For when a STUDENT is removed from a group - Not to be confused with on('removeGroup') even though same logic
                $scope.studentConnection.on('groupRemoved', function (name) {
                    $scope.studentRemovedFromGroup(name);
                });

                // For when a group is removed -> Use the logic from when a student is removed from a group as is same effect!
                $scope.studentConnection.on('removeGroup', function () {
                    $scope.studentRemovedFromGroup();
                });

                $scope.studentRemovedFromGroup = function (name = null) {
                    $scope.studentConnection.invoke('disconnectFromGroup', $scope.groupId);
                    $scope.extendPing();
                    $scope.groupId = null;
                    $rootScope.$broadcast('groupRemoved');
                    toastr.clear();
                    if (name == null) {
                        toastr.info('The group you were in has been deleted');
                    }
                    else {
                        toastr.info('You were removed from the group "' + name + '"');
                    }
                };

            /*************** GROUP ASSIGNMENT END ***************/

                $scope.studentConnection.on('userConnected', function (userId) {
                    //dont need
                });

                $scope.studentConnection.on('userDisconnected', function (userId) {
                    //dont need
                });


                $scope.init();
            }
        ]);
})();