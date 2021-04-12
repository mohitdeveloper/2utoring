(function () {
    angular.module('standingOut.controllers').controller('TutorCommandController',
        ['$scope', '$rootScope', '$timeout', 'ModalService', 'ClassroomSessionsService', 'SessionGroupsService', 'ClassSessionsService',
            function ($scope, $rootScope, $timeout, ModalService, ClassroomSessionsService, SessionGroupsService, ClassSessionsService) {
                $scope.classSessionId = classSessionId;
                $scope.userId = userId;
                $scope.hubUrl = hubUrl;
                $scope.isOpen = false;
                $scope.groups = [];
                $scope.allAttendees = [];
                $scope.helpRequested = false;
                //$scope.chatActive = false;
                $scope.selectedCount = 0;
                $scope.allAttendeesToggle = [];
                $scope.lastPing = null;
                $scope.pingSpacing = 1000 * 60 * 10;
                $scope.pingBuffer = $scope.pingSpacing + (1000 * 20);
                $scope.signalRDisconnect = false;
                $scope.groupToAdd = '';
                $scope.disableAddGroup = false;

                //wizcraft to enable signses on class start
                $scope.allAttendeesToggle.videoEnabled = true;
                $scope.allAttendeesToggle.audioEnabled = true;
                $scope.allAttendeesToggle.screenShareEnabled = true;
                $scope.allAttendeesToggle.callIndividualsEnabled = true;
                $scope.chatActive = true;
                //wizcraft to end of enable signses on class start

                $scope.broadcastingTo = null;

                $scope.tutorConnection = new signalR.HubConnectionBuilder()
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

                $scope.tutorConnection.onclose(function () {
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

                $scope.init = function () {
                    SessionGroupsService.getTutorCommandGroups({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.groups = success.groups;
                        $scope.allAttendees = success.allSessionAttendees;

                        setTimeout(function () {
                            $(document).foundation();
                        }, 50);

                        $scope.tutorConnection.start().then(function() {
                            $scope.tutorConnection.invoke('connect', $scope.classSessionId, null);
                            for (var i = 0; i < $scope.groups.length; i++) {
                                for (var g = 0; g < $scope.groups[i].sessionAttendees.length; g++) {
                                    //$scope.allAttendees.push($scope.groups[i].sessionAttendees[g]);
                                    if ($scope.groups[i].sessionAttendees[g].helpRequested == true) {
                                        $scope.helpRequested = true;
                                    }
                                    if ($scope.groups[i].sessionAttendees[g].userId != null && $scope.groups[i].sessionAttendees[g].userId !== undefined) {
                                        $scope.tutorConnection.invoke('connectToStudent', $scope.groups[i].sessionAttendees[g].userId);
                                    }
                                }
                                $scope.groups[i].selectedCount = 0;
                            }
                            $scope.extendPing();
                            $scope.setupPing($scope.pingSpacing);
                        })
                            .catch(function (err) {
                                //failed to connect
                                return console.error(err.toString());
                            });
                    }, function (err) {
                    });

                    ClassroomSessionsService.getAllChatPermission({ classSessionId: $scope.classSessionId }, function (success) {
                        //$scope.chatActive = success.chatAll;
                        //wizcraft put chatactive true statically on load
                        $scope.chatActive = true;
                    }, function (err) {
                    });

                    ClassSessionsService.get({ id: $scope.classSessionId }, function (success) {
                        $scope.classSession = success;
                    }, function (err) {
                    });
                };

                $scope.extendPing = function () {
                    $scope.lastPing = new Date();
                };

                $scope.setupPing = function (toTimeout) {
                    $timeout(function () {
                        if ((new Date()).getTime() - $scope.pingBuffer < $scope.lastPing.getTime()) {
                            $scope.tutorConnection.invoke('ping');
                            $scope.lastPing = new Date();
                            $scope.setupPing($scope.pingSpacing);
                        }
                        else {
                            $scope.setupPing($scope.pingSpacing - ((new Date()).getTime() - $scope.lastPing.getTime()));
                        }
                    }, toTimeout)
                };

                $scope.tutorConnection.on('pingTutorCommand', function () {
                });

                $scope.toggle = function () {
                    if ($rootScope.sessionEnded) {
                        toastr.clear();
                        toastr.error('Tutor Command is not available to use out of class');
                    }
                    else {
                        $scope.isOpen = !$scope.isOpen;
                    }
                };

                $scope.tutorConnection.on('userConnected', function (userId) {
                    if ($scope.groups.length > 0) {
                        for (var g = 0; g < $scope.groups.length; g++) {
                            for (var a = 0; a < $scope.groups[g].sessionAttendees.length; a++) {
                                if ($scope.groups[g].sessionAttendees[a].userId == userId) {
                                    $scope.$apply(function () {
                                        $scope.groups[g].sessionAttendees[a].online = true;
                                    });
                                }
                            }
                        }
                    }
                    for (var i = 0; i < $scope.allAttendees.length; i++) {
                        if ($scope.allAttendees[i].userId == userId) {
                            $scope.$apply(function () {
                                $scope.allAttendees[i].online = true;
                            });
                        }
                    }
                });

                $scope.tutorConnection.on('userDisconnected', function (userId) {
                    if ($scope.groups.length > 0) {
                        for (var g = 0; g < $scope.groups.length; g++) {
                            for (var a = 0; a < $scope.groups[g].sessionAttendees.length; a++) {

                                if ($scope.groups[g].sessionAttendees[a].userId == userId) {
                                    $scope.$apply(function () {
                                        $scope.groups[g].sessionAttendees[a].online = false;
                                    });
                                }
                            }
                        }
                    }
                    for (var i = 0; i < $scope.allAttendees.length; i++) {
                        if ($scope.allAttendees[i].userId == userId) {
                            $scope.$apply(function () {
                                $scope.allAttendees[i].online = false;
                            });
                        }
                    }
                });

                $scope.$on('session_start', function (event, args) {
                    $scope.tutorConnection.invoke('sessionStarted', $scope.classSessionId);
                    $scope.extendPing();
                });

                $scope.$on('session_end', function (event, args) {
                    $('.loading').show();
                    $scope.tutorConnection.invoke('sessionEnded', $scope.classSessionId);
                    $scope.extendPing();

                    sessionEnded = true; //global var to stop the prompt on leave
                    window.location = '/f/' + $scope.classSessionId;
                });

                /*************** PERMISSIONS START ***************/

                $scope.individualToggleChat = function (index) {
                    var value = $scope.allAttendees[index].chatActive;
                    $scope.allAttendees[index].chatActive = !value;
                    $scope.tutorConnection.invoke('individualPermissionChangeChat', $scope.classSessionId, $scope.allAttendees[index].sessionAttendeeId, $scope.allAttendees[index].userId, !value);
                    $scope.extendPing();
                };

                $scope.groupToggleChat = function (index) {
                    var value = $scope.groups[index].chatActive;
                    $scope.groups[index].chatActive = !value;
                    $scope.tutorConnection.invoke('groupPermissionChangeChat', $scope.classSessionId, $scope.groups[index].sessionGroupId, !value);
                    $scope.extendPing();
                };

                $scope.allToggleChat = function () {
                    var value = $scope.chatActive;
                    $scope.chatActive = !value;
                    $scope.tutorConnection.invoke('allPermissionChangeChat', $scope.classSessionId, !value);
                    $scope.extendPing();
                };

                $scope.individualGenericToggle = function (index, prop) {
                    var value = eval('$scope.allAttendees[' + index + '].' + prop);
                    $scope.allAttendees[index][prop] = !value;
                    $scope.tutorConnection.invoke('studentPermissionChange', $scope.classSessionId, $scope.allAttendees[index].sessionAttendeeId, $scope.allAttendees[index].userId, prop, $scope.allAttendees[index]);
                    $scope.extendPing();
                };

                $scope.toggleCallIndividuals = function (sessionAttendee) {
                    sessionAttendee.callIndividualsEnabled = !sessionAttendee.callIndividualsEnabled;
                    $scope.tutorConnection.invoke('studentPermissionChange', $scope.classSessionId, sessionAttendee.sessionAttendeeId, sessionAttendee.userId, prop, sessionAttendee);
                    $scope.extendPing();
                };

                $scope.groupGenericToggle = function (groupIndex, index, prop) {
                    var value = eval('$scope.groups[' + groupIndex + '].sessionAttendees[' + index + '].' + prop);
                    $scope.groups[groupIndex].sessionAttendees[index][prop] = !value;
                    $scope.tutorConnection.invoke('studentPermissionChange', $scope.classSessionId, $scope.groups[groupIndex].sessionAttendees[index].sessionAttendeeId, $scope.groups[groupIndex].sessionAttendees[index].userId, prop, $scope.groups[groupIndex].sessionAttendees[index]);
                    $scope.extendPing();
                };

                $scope.wholeClassGenericToggle = function (prop) {
                    var value = eval('$scope.allAttendeesToggle.' + prop);
                    if (value != undefined) {
                        $scope.allAttendeesToggle[prop] = !value;
                    }
                    else {
                        $scope.allAttendeesToggle[prop] = true;
                    }
                    for (var i = 0; i < $scope.allAttendees.length; i++) {
                        if ($scope.allAttendees[i][prop] != $scope.allAttendeesToggle[prop]) {
                            $scope.allAttendees[i][prop] = $scope.allAttendeesToggle[prop];
                            $scope.tutorConnection.invoke('studentPermissionChange', $scope.classSessionId, $scope.allAttendees[i].sessionAttendeeId, $scope.allAttendees[i].userId, prop, $scope.allAttendees[i]);
                            $scope.extendPing();
                        }
                    }
                };

                $scope.wholeGroupGenericToggle = function (groupIndex, prop) {
                    var value = eval('$scope.groups[' + groupIndex + '].' + prop);
                    $scope.groups[groupIndex][prop] = !value;

                    for (var i = 0; i < $scope.groups[groupIndex].sessionAttendees.length; i++) {
                        if ($scope.groups[groupIndex].sessionAttendees[i][prop] != $scope.groups[groupIndex][prop]) {
                            $scope.groups[groupIndex].sessionAttendees[i][prop] = $scope.groups[groupIndex][prop];
                            $scope.tutorConnection.invoke('studentPermissionChange', $scope.classSessionId, $scope.groups[groupIndex].sessionAttendees[i].sessionAttendeeId, $scope.groups[groupIndex].sessionAttendees[i].userId, prop, $scope.groups[groupIndex].sessionAttendees[i]);
                            $scope.extendPing();
                        }
                    }
                };

                /*************** PERMISSIONS END ***************/

                /*************** CALLING START ***************/
                $rootScope.$on('callUser', function (event, args) {
                    for (var a = 0; a < $scope.allAttendees.length; a++) {
                        if ($scope.allAttendees[a].userId == args.userId) {
                            if ($scope.allAttendees[a].online) {
                                $scope.callUser($scope.allAttendees[a]);
                            }
                            else {
                                toastr.clear();
                                toastr.error('Student is not online');
                            }
                        }
                    }
                });

                $scope.callUser = function (sessionAttendee) {
                    $scope.tutorConnection.invoke('callUser', $scope.classSessionId, sessionAttendee.userId);
                    $scope.extendPing();
                    if (sessionAttendee.helpRequested == true) {
                        $rootScope.$broadcast('helpDelivered', sessionAttendee.userId);
                    }
                };

                $rootScope.$on('joinGroupCallFromChat', function (event, args) {
                    $scope.callGroup(args.groupId);
                });

                $scope.callGroup = function (groupId) {
                    var userIds = $scope.getOnlineUserIds();
                    $scope.tutorConnection.invoke('callGroup', $scope.classSessionId, groupId, userIds);
                    $scope.extendPing();
                };

                $rootScope.$on('joinAllCallFromChat', function (event, args) {
                    $scope.callAll();
                });

                $scope.getOnlineUserIds = function () {
                    var userIds = [];
                    $scope.allAttendees.forEach(function (attendee) {
                        if (attendee.online == true) {
                            userIds.push(attendee.userId);
                        }
                    });
                    return userIds;
                };

                $scope.callAll = function () {
                    var userIds = $scope.getOnlineUserIds();
                    $scope.tutorConnection.invoke('callAll', $scope.classSessionId, userIds);
                    $scope.extendPing();
                };

                $scope.broadcastUser = function (sessionAttendee) {
                    $scope.broadcastingTo = sessionAttendee.userId;
                    $rootScope.$broadcast('tutorCommandForceUser', { userId: sessionAttendee.userId });
                    if (sessionAttendee.helpRequested == true) {
                        $rootScope.$broadcast('helpDelivered', sessionAttendee.userId);
                    }
                };

                $scope.broadcastGroup = function (groupId) {
                    $scope.broadcastingTo = groupId;
                    $rootScope.$broadcast('tutorCommandForceGroup', { groupId: groupId });
                };

                $scope.broadcastAll = function () {
                    $scope.broadcastingTo = 'All';
                    $rootScope.$broadcast('tutorCommandForceAll', { });
                };

                $scope.tutorConnection.on('startCall', function (roomId, users) {
                    $rootScope.$broadcast('startCall', { roomId: roomId, users: users });
                });

                $scope.tutorConnection.on('receiveCall', function (data, incomingUserId) {
                    $rootScope.$broadcast('receiveCall', data, incomingUserId);
                });

                $rootScope.$on('cancelledByCall', function (event, roomId) {
                    $scope.tutorConnection.invoke('cancelledByCall', $scope.classSessionId, roomId);
                    $scope.extendPing();
                });

                $scope.tutorConnection.on('callDeclined', function (roomId, userId, name, userThatMadeCallId) {
                    if (userThatMadeCallId == $scope.userId) {
                        toastr.clear();
                        toastr.info('The call was declined by ' + name);
                        $rootScope.$broadcast('callDeclined', userId, userThatMadeCallId);
                    }
                });

                $scope.$on('callDeclinedBy', function (event, args) {
                    $scope.tutorConnection.invoke('callDeclined', $scope.classSessionId, args.roomId, args.userThatMadeCallId);
                    $scope.extendPing();
                });

                $scope.$on('screenShare', function (event, args) {
                    $scope.tutorConnection.invoke('screenShare', $scope.classSessionId, args.screenMuted, args.room);
                    $scope.extendPing();
                });

                $scope.tutorConnection.on('screenShared', function (screenMuted, room, userId) {
                    $rootScope.$broadcast('receivescreenShared', { screenMuted: screenMuted, roomId: room, userId: userId });
                });
                /*************** CALLING END ***************/

                /*************** FORCE MODE START ***************/

                $scope.$on('toggleForceMode', function (event, args) {

                    if (args.forceMode == false) {
                        $scope.broadcastingTo = null;
                    } else {
                        $scope.broadcastingTo = args.broadcastingTo;
                    }

                    $scope.tutorConnection.invoke('toggleForceMode', $scope.classSessionId, args.forceMode, args.room);
                    $scope.extendPing();
                });

                /*************** FORCE MODE END ***************/

                /*************** MEDIA START ***************/

                $scope.$on('addMedia', function (event, args) {
                    $scope.tutorConnection.invoke('addMedia', $scope.classSessionId, args.sessionMediaId);
                    $scope.extendPing();
                });

                $scope.$on('editMedia', function (event, args) {
                    $scope.tutorConnection.invoke('editMedia', $scope.classSessionId, args.sessionMediaId);
                    $scope.extendPing();
                });

                $scope.$on('deleteMedia', function (event, args) {
                    $scope.tutorConnection.invoke('deleteMedia', $scope.classSessionId, args.sessionMediaId);
                    $scope.extendPing();
                });

                /*************** MEDIA END ***************/

                /*************** CHAT START ***************/

                $scope.openAllChat = function () {
                    $scope.isOpen = false;
                    $rootScope.$broadcast('openAllChat');
                };

                $scope.openGroupChat = function (groupId) {
                    $scope.isOpen = false;
                    $rootScope.$broadcast('openGroupChat', groupId);
                };

                $scope.openSingleChat = function (userId) {
                    $scope.isOpen = false;
                    $rootScope.$broadcast('openSingleChat', userId);
                };

                /*************** CHAT END ***************/

                /*************** FILE START ***************/

                $scope.openRootFolder = function () {
                    $rootScope.$broadcast('openTutorCommandFolder', { userId: null, command: 'openMainFolder' });
                };

                $scope.openStudentFolder = function (userId) {
                    $rootScope.$broadcast('openTutorCommandFolder', { userId: userId, command: 'openMainFolder'});
                };

                $scope.openSharedFolder = function () {
                    $rootScope.$broadcast('openTutorCommandFolder', { userId: null, command: 'openSharedFolder'});
                };

                /*************** FILE END ***************/

                /*************** WHITEBOARD START ***************/

                $scope.openAllWhiteboard = function () {
                    $rootScope.$broadcast('openTutorCommandWhiteboard', { groupId: null, userId: null });
                };

                $scope.openGroupWhiteboard = function (groupId) {
                    $rootScope.$broadcast('openTutorCommandWhiteboard', { groupId: groupId, userId: null });
                };

                $scope.openSingleWhiteboard = function (userId) {
                    $rootScope.$broadcast('openTutorCommandWhiteboard', { groupId: null, userId: userId });
                };

                /*************** WHITEBOARD END ***************/

                /*************** HELP START ***************/

                $scope.tutorConnection.on('helpRequested', function (userId) {
                    for (var a = 0; a < $scope.allAttendees.length; a++) {
                        if ($scope.allAttendees[a].userId == userId) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.allAttendees[a].helpRequested = true;
                                    toastr.info($scope.allAttendees[a].firstName + ' ' + $scope.allAttendees[a].lastName + ' has requested help');
                                });
                            });
                            break;
                        }
                    }
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.helpRequested = true;
                        });
                    });
                    $rootScope.$broadcast('helpRequested', userId);
                });

                $rootScope.$on('helpDelivered', function (event, userId) {
                    var moreHelpNeeded = false;
                    $timeout(function () {
                        $scope.$apply(function () {
                            for (var a = 0; a < $scope.allAttendees.length; a++) {
                                if ($scope.allAttendees[a].userId == userId) {
                                    $scope.allAttendees[a].helpRequested = false;
                                }
                                else if ($scope.allAttendees[a].helpRequested == true) {
                                    moreHelpNeeded = true;
                                }
                            }
                        });
                    });
                    if (moreHelpNeeded == false) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.helpRequested = false;
                            });
                        });
                    }
                    $scope.tutorConnection.invoke('helpDelivered', $scope.classSessionId, userId);
                    $scope.extendPing();
                });

                $scope.totalHelpNeeded = function () {
                    let helpCounter = 0;

                    for (var a = 0; a < $scope.allAttendees.length; a++) {
                        if ($scope.allAttendees[a].helpRequested == true) {
                            helpCounter++;
                        }
                    }

                    return helpCounter;
                };




                /*************** HELP END ***************/

                /*************** GROUP ASSIGNMENT START ***************/

                // For selecting a user so logic can be triggered for adding/removing from groups
                $scope.selectUser = function (userId) {
                    var value = false;
                    var escape = false;
                    var inGroup = false;


                    for (var i = 0; i < $scope.groups.length; i++) {
                        for (var j = 0; j < $scope.groups[i].sessionAttendees.length; j++) {
                            if ($scope.groups[i].sessionAttendees[j].userId == userId) {
                                value = $scope.groups[i].sessionAttendees[j].selected == undefined ? false : $scope.groups[i].sessionAttendees[j].selected;
                                $scope.groups[i].sessionAttendees[j].selected = !value;
                                if (value != true) {
                                    $scope.groups[i].selectedCount = $scope.groups[i].selectedCount + 1;
                                    $scope.selectedCount = $scope.selectedCount + 1;
                                }
                                else {
                                    $scope.groups[i].selectedCount = $scope.groups[i].selectedCount - 1;
                                    $scope.selectedCount = $scope.selectedCount - 1;
                                }
                                inGroup = true;
                                escape = true;
                                break;
                            }
                        }
                        if (escape == true) {
                            break;
                        }
                    }

                    if (inGroup == false) {
                        for (var i = 0; i < $scope.allAttendees.length; i++) {

                            if ($scope.allAttendees[i].userId == userId) {
                                value = $scope.allAttendees[i].selected == undefined ? false : $scope.allAttendees[i].selected;
                                $scope.allAttendees[i].selected = !value;
                                if (value != true) {
                                    $scope.selectedCount = $scope.selectedCount + 1;
                                }
                                else {
                                    $scope.selectedCount = $scope.selectedCount - 1;
                                }
                                inGroup = true;
                                escape = true;
                                break;
                            }
                        }
                    }
                };

                // For adding users to a group
                $scope.addToGroup = function (index) {
                    var userIds = [];
                    for (var i = 0; i < $scope.groups.length; i++) {
                        for (var j = $scope.groups[i].sessionAttendees.length - 1; j >= 0; j--) {
                            if ($scope.groups[i].sessionAttendees[j].selected == true) {
                                $scope.groups[i].sessionAttendees[j].selected = false;
                                var attendee = $scope.groups[i].sessionAttendees.splice(j, 1)[0];
                                attendee.groupRoomJoinEnabled = false;
                                attendee.groupVideoEnabled = true;
                                attendee.groupAudioEnabled = true;
                                attendee.groupScreenShareEnabled = true;
                                attendee.sessionGroupId = $scope.groups[index].sessionGroupId;
                                $scope.groups[index].sessionAttendees.push(attendee);
                                $scope.groups[i].selectedCount = $scope.groups[i].selectedCount - 1;
                                $scope.selectedCount = $scope.selectedCount - 1;
                                userIds.push(attendee.userId);
                            }
                        }
                    }

                    if (userIds.length < $scope.selectedCount) {
                        //for (var j = $scope.allAttendees.length - 1; j >= 0; j--) {

                        for (var j = 0; j < $scope.allAttendees.length; j++) {
                            if ($scope.allAttendees[j].selected == true) {
                                $scope.allAttendees[j].selected = false;
                                const attendee = $scope.allAttendees[j];
                                attendee.groupRoomJoinEnabled = false;
                                attendee.groupVideoEnabled = true;
                                attendee.groupAudioEnabled = true;
                                attendee.groupScreenShareEnabled = true;
                                attendee.sessionGroupId = $scope.groups[index].sessionGroupId;
                                $scope.groups[index].sessionAttendees.push(attendee);
                                $scope.selectedCount = $scope.selectedCount - 1;
                                userIds.push(attendee.userId);
                            }
                        }
                    }

                    $scope.tutorConnection.invoke('groupMove', $scope.classSessionId, $scope.groups[index].sessionGroupId, userIds, $scope.groups[index].name);
                    $scope.extendPing();
                };


                // A student has been removed from a group
                $scope.tutorConnection.on('groupAlteredRemove', function (room) {
                    $rootScope.$broadcast('groupAlteredRemove', room);
                });

                // A student has been moved into a group
                $scope.tutorConnection.on('groupAlteredAdd', function (room) {
                    $rootScope.$broadcast('groupAlteredAdd', room);
                });

                // A student has been removed from a group
                $scope.tutorConnection.on('groupUsersRemoved', function (groupId, userIds) {
                    $rootScope.$broadcast('groupUsersRemoved', { groupId: groupId, userIds: userIds });
                });

                // For removing users from a group
                $scope.removeFromGroup = function (index) {
                    var userIds = [];
                    for (var i = 0; i < $scope.groups.length; i++) {
                        let indexesToRemove = [];

                            for (var j = $scope.groups[index].sessionAttendees.length - 1; j >= 0; j--) {
                                if ($scope.groups[index].sessionAttendees[j].selected == true) {

                                    $scope.groups[index].sessionAttendees[j].selected = false;
                                    var attendee = $scope.groups[index].sessionAttendees.splice(j, 1)[0];
                                    attendee.sessionGroupId = null;
                                    $scope.groups[index].selectedCount = $scope.groups[index].selectedCount - 1;
                                    $scope.selectedCount = $scope.selectedCount - 1;
                                    userIds.push(attendee.userId);

                                    indexesToRemove.push(j);
                                }
                        }

                        for (var i = 0; i < indexesToRemove.length; i++){
                            $scope.groups[index].sessionAttendees.splice(indexesToRemove[i], 1);
                        }
                    }


                    $scope.tutorConnection.invoke('groupRemove', $scope.classSessionId, $scope.groups[index].sessionGroupId, userIds, $scope.groups[index].name);
                    $scope.extendPing();
                };

                // For adding a new group
                $scope.addGroup = function () {
                    // Disable the box and the button
                    $scope.disableAddGroup = true;
                    // If a group by that name exists do not allow
                    // Won't cause any issues so validation on front end only is fine (just for flavour)
                    for (var i = 0; i < $scope.groups.length; i++) {
                        if ($scope.groups[i].name == $scope.groupToAdd) {
                            toastr.error('There is already a group called \'' + $scope.groupToAdd + '\'');
                            $scope.disableAddGroup = false;
                            return;
                        }
                    }
                    // Create the group
                    SessionGroupsService.addGroup({ classSessionId: $scope.classSessionId }, { name: $scope.groupToAdd }, function (success) {
                        $scope.tutorConnection.invoke('connectToGroup', success.tutorCommandGroup.sessionGroupId);
                        // Use the results (add results here and connect chat)
                        success.tutorCommandGroup.selectedCount = 0;
                        $scope.groups.push(success.tutorCommandGroup);
                        $rootScope.$broadcast('newGroupChatroom', success.chatroom);
                        $rootScope.$broadcast('newGroupWebcam', success.webcamRoom);
                        // Inform user, clear text box, re-enable
                        toastr.clear();
                        toastr.success('\'' + $scope.groupToAdd + '\' group added');
                        $scope.groupToAdd = '';
                        $scope.disableAddGroup = false;
                        $timeout(function () {
                            // Re-init foundation accordians after the current updates
                            Foundation.reInit('accordion');
                        });
                    }, function (error) {
                            // Inform user and re-enable
                            toastr.error('Couldn\'t add group. Please check if your subscription allows this.'); // Couldn't add group
                            $scope.disableAddGroup = false;
                    });
                };

                // For removing a group
                $scope.removeGroup = function (index) {
                    // Splice here so looks instant
                    var group = $scope.groups.splice(index, 1)[0];
                    // Remove the group
                    SessionGroupsService.removeGroup({ classSessionId: $scope.classSessionId, sessionGroupId: group.sessionGroupId }, function (success) {
                        // Broadcast for other places to remove resources associated with the group (chat/whiteboard)
                        $rootScope.$broadcast('removeGroup', group.sessionGroupId);
                        // Inform user
                        toastr.clear();
                        toastr.success('\'' + group.name + '\' group removed');
                    }, function (error) {
                            // Inform user
                            toastr.error('Couldn\'t remove group');
                            // Re-add group
                            $scope.groups.splice(index, 0, group);
                    });
                };

                /*************** GROUP ASSIGNMENT END ***************/

                $scope.init();
            }
        ]);
})();