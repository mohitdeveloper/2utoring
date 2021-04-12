(function () {
    angular.module('standingOut.controllers').controller('ClassroomChatController',
        ['$scope', '$rootScope', '$timeout', 'SessionMessagesService',
            function ($scope, $rootScope, $timeout, SessionMessagesService) {
                $scope.classSessionId = classSessionId;
                $scope.sessionAttendee = undefined;
                $scope.userId = userId;
                $scope.hubUrl = hubUrl;
                $scope.tutorId = tutorId;
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.isOpen = false;
                $scope.chatInstances = [];
                $scope.selectedInstance = undefined;
                $scope.deviceOptions = { chatIndividuals: false, chatGroup: false, chatAll: false };

                $scope.someonesTyping = false;
                $scope.typingDisplayName = '';
                $scope.messageBox = '';
                $scope.timeout = undefined;
                $scope.currentTotalUnread = 0;
                $scope.sendTyping = false;
                $scope.lastPing = null;
                $scope.pingSpacing = 1000 * 60 * 10;
                $scope.pingBuffer = $scope.pingSpacing + (1000 * 20);

                //$scope.chattConnection = new signalR.HubConnectionBuilder()
                //    .withUrl($scope.hubUrl + '/hubs/chat')
                //    .build();


                $scope.chattConnection = new signalR.HubConnectionBuilder()
                    .withUrl($scope.hubUrl + '/hubs/chat', {
                        accessTokenFactory: () => {
                            // Get and return the access token.
                            // This function can return a JavaScript Promise if asynchronous
                            // logic is required to retrieve the access token.
                            return accessToken;
                        }
                    })
                    .build();


                $scope.chattConnection.onclose(function () {
                    $rootScope.$broadcast('signalRDisconnect');
                });

                $scope.init = function () {

                    SessionMessagesService.getChatroomInstances({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.chatInstances = success;
                        $scope.isOpen = !$rootScope.sessionEnded;
                        for (var i = 0; i < $scope.chatInstances.length; i++) {
                            if ($scope.chatInstances[i].messages.length > 0) {
                                var chatIndex = 0;
                                var maxIndex = $scope.chatInstances[i].messages.length - $scope.chatInstances[i].currentChatPosition
                                while (chatIndex < maxIndex) {
                                    if ($scope.chatInstances[i].messages[chatIndex].fromUserId == $scope.userId) {
                                        $scope.chatInstances[i].currentChatPosition = $scope.chatInstances[i].messages.length - chatIndex;
                                        break;
                                    }
                                    else {
                                        chatIndex = chatIndex + 1;
                                    }
                                }
                                $scope.currentTotalUnread = $scope.currentTotalUnread + ($scope.chatInstances[i].messages.length - $scope.chatInstances[i].currentChatPosition);
                            }
                        }

                        $scope.chattConnection.start().then(function () {
                            for (var i = 0; i < $scope.chatInstances.length; i++) {
                                $scope.chattConnection.invoke('connect', $scope.classSessionId, $scope.chatInstances[i].groupId, $scope.chatInstances[i].toUserId, $scope.chatInstances[i].sessionOneToOneChatInstanceId);
                            }
                            $scope.extendPing();
                            $scope.setupPing($scope.pingSpacing);
                            for (var i = 0; i < $scope.chatInstances.length; i++) {
                                if ($scope.chatInstances[i].groupId == null && $scope.chatInstances[i].toUserId == null && !$rootScope.sessionEnded) {
                                    $timeout(function () {
                                        $scope.$apply(function () {
                                            $scope.showInstance(i);
                                        });
                                    });
                                    break;
                                }
                            }
                        })
                        .catch(function (err) {
                            //failed to connect
                            return console.error(err.toString());
                        });
                    }, function (err) { });
                    
                    if ($scope.isTutor == false) {
                        SessionMessagesService.getChatPermissions({ classSessionId: $scope.classSessionId, userId: $scope.userId }, function (success) {
                            $scope.deviceOptions = success;
                        }, function (err) {
                        });
                    }
                    else {
                        // Always available for tutors
                        $scope.deviceOptions = { chatIndividuals: true, chatGroup: true, chatAll: true };
                    }
                };

                $scope.extendPing = function () {
                    $scope.lastPing = new Date();
                };

                $scope.setupPing = function (toTimeout) {
                    $timeout(function () {
                        if ((new Date()).getTime() - $scope.pingBuffer < $scope.lastPing.getTime()) {
                            $scope.chattConnection.invoke('ping');
                            $scope.lastPing = new Date();
                            $scope.setupPing($scope.pingSpacing);
                        }
                        else {
                            $scope.setupPing($scope.pingSpacing - ((new Date()).getTime() - $scope.lastPing.getTime()));
                        }
                    }, toTimeout)
                };

                $scope.chattConnection.on('pingChat', function () {
                });

                $scope.toggle = function () {
                    if ($rootScope.sessionEnded) {
                        toastr.clear();
                        toastr.error('Text Chat is not available to use out of class');
                    }
                    else {
                        $scope.isOpen = !$scope.isOpen;
                    }
                };

                $scope.$on('sessionHasStarted', function (event) {
                    if ($scope.isOpen == true) {
                        $scope.toggle();
                    }
                });

                $scope.showInstance = function (idx) {
                    $scope.messageBox = '';
                    $scope.boxInit = true;

                    var chatMessages = $("#chat-messages");
                    setTimeout(function () {
                        chatMessages.animate({
                            scrollTop: chatMessages[0].scrollHeight - chatMessages[0].clientHeight
                        }, 0);
                    }, 120);
                    $scope.selectedInstance = idx;
                    if ($scope.chatInstances[idx].currentChatPosition != $scope.chatInstances[idx].messages.length) {
                        $scope.readMessages();
                    }
                };

                $scope.cancelChat = function () {
                    //$scope.readMessagesForInstance($scope.selectedInstance);
                    $scope.messageBox = '';
                    $scope.selectedInstance = undefined;
                };

                $scope.userTyping = function (keypress) {
                    $scope.boxInit = false;
                    if ($scope.selectedInstance !== undefined && $scope.selectedInstance != null && keypress.which != 13) {
                        if ($scope.messageBox.length > 300) {
                            $scope.messageBox = $scope.messageBox.substring(0, 300);
                        }
                    }
                    if ($scope.sendTyping == false && keypress.which != 13) {
                        if ($scope.selectedInstance !== undefined && $scope.selectedInstance != null) {
                            $scope.sendTyping = true;
                            $scope.chattConnection.invoke('typing', $scope.classSessionId, $scope.chatInstances[$scope.selectedInstance].groupId, $scope.chatInstances[$scope.selectedInstance].toUserId, $scope.chatInstances[$scope.selectedInstance].sessionOneToOneChatInstanceId);
                            $scope.extendPing();
                            $timeout(function () {
                                $scope.sendTyping = false;
                            }, 3000);
                        }
                    }
                    else if ($scope.selectedInstance !== undefined && $scope.selectedInstance != null && keypress.which == 13 && $scope.messageBox != '') {
                        $scope.sendMessage();
                    }
                    $scope.readMessages();
                };

                $scope.sendMessage = function () {
                    $scope.readMessages();
                    if ($scope.chatInstances[$scope.selectedInstance].helpRequested == true) {
                        $rootScope.$broadcast('helpDelivered', $scope.chatInstances[$scope.selectedInstance].toUserId);
                    }
                    $scope.chattConnection.invoke('SendMessage', $scope.messageBox, $scope.classSessionId, $scope.tutorId, $scope.chatInstances[$scope.selectedInstance].groupId, $scope.chatInstances[$scope.selectedInstance].toUserId, $scope.chatInstances[$scope.selectedInstance].sessionOneToOneChatInstanceId);
                    $scope.extendPing();
                    $scope.messageBox = '';
                };

                $scope.readMessages = function () {
                    var idx = $scope.selectedInstance;
                    $scope.readMessagesForInstance(idx);
                };

                $scope.readMessagesForInstance = function (idx) {
                    if ($scope.chatInstances[idx] != undefined && $scope.chatInstances[idx].currentChatPosition < $scope.chatInstances[idx].messages.length) {
                        $scope.chattConnection.invoke('ReadMessages', $scope.classSessionId, $scope.tutorId, $scope.chatInstances[idx].groupId, $scope.chatInstances[idx].toUserId, $scope.chatInstances[idx].sessionOneToOneChatInstanceId);
                        $scope.extendPing();
                        $scope.currentTotalUnread = $scope.currentTotalUnread - ($scope.chatInstances[idx].messages.length - $scope.chatInstances[idx].currentChatPosition);
                        $scope.chatInstances[idx].currentChatPosition = $scope.chatInstances[idx].messages.length;
                    }
                };

                $scope.chattConnection.on('readMessages', function (groupId, toUserId, sessionOneToOneChatInstanceId, fromUserId, userDisplayPicture) {
                    var idx = _.findIndex($scope.chatInstances, function (itm) {
                        return itm.groupId == groupId && itm.sessionOneToOneChatInstanceId == sessionOneToOneChatInstanceId;
                    });
                    if (idx > -1 && $scope.chatInstances[idx].mostRead < $scope.chatInstances[idx].messages.length) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.chatInstances[idx].mostRead = $scope.chatInstances[idx].messages.length;
                            });
                        });
                    }
                });

                $scope.shownTotalUnread = function () {
                    if ($scope.selectedInstance != undefined && $scope.chatInstances[$scope.selectedInstance].messages.length > $scope.chatInstances[$scope.selectedInstance].currentChatPosition) {
                        return $scope.currentTotalUnread - ($scope.chatInstances[$scope.selectedInstance].messages.length - $scope.chatInstances[$scope.selectedInstance].currentChatPosition);
                    }
                    else {
                        return $scope.currentTotalUnread;
                    }
                }

                $scope.chattConnection.on('newMessage', function (message, groupId, toUserId, sessionOneToOneChatInstanceId) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            var idx = _.findIndex($scope.chatInstances, function (itm)
                            {
                                return itm.groupId == groupId && itm.sessionOneToOneChatInstanceId == sessionOneToOneChatInstanceId;                    
                            });
                            if (idx > -1) {
                                $scope.chatInstances[idx].messages.push(message);
                                if ($scope.userId != message.fromUserId) {
                                    $scope.currentTotalUnread = $scope.currentTotalUnread + 1;
                                }
                                else {
                                    $scope.chatInstances[idx].currentChatPosition = $scope.chatInstances[idx].messages.length
                                }
                                if (idx == $scope.selectedInstance && $scope.isOpen) {
                                    var chatMessages = $("#chat-messages");
                                    setTimeout(function () {
                                        chatMessages.animate({
                                            scrollTop: chatMessages[0].scrollHeight - chatMessages[0].clientHeight
                                        }, 120);

                                        //$scope.chattConnection.invoke('Recieved', $scope.message)
                                    }, 120);
                                    $scope.someonesTyping = false;
                                }
                                else {
                                    var messageText = message.message.replace(/<\/script>/g, "").replace(/<script>/g, "");
                                    //messageText = messageText.replace(/<\/script>/g, "");
                                    //messageText = messageText.replace(/<script>/g, "");

                                    toastr.clear();
                                    //toastr.info('New message - "' + (messageText.length > 45 ? (messageText.slice(0, 45) + '...') : messageText) + '"'); //ML removed to stop scripts
                                    toastr.info('New message received');
                                    var audioElement = document.getElementById('messageSound');
                                    audioElement.load();
                                    audioElement.play().catch(function (e) { });
                                }
                                for (var i = 0; i < $scope.chatInstances[idx].chatPositions.length; i++) {
                                    if ($scope.chatInstances[idx].chatPositions[i].userId == message.fromUserId) {
                                        $timeout(function () {
                                            $scope.$apply(function () {
                                                $scope.chatInstances[idx].chatPositions[i].numberRead = $scope.chatInstances[idx].messages.length;
                                            });
                                        });
                                        break;
                                    }
                                }
                            }
                        });
                    });
                });

                $scope.chattConnection.on('userTyping', function (groupId, toUserId, sessionOneToOneChatInstanceId, displayName) {
                    if ($scope.selectedInstance !== undefined && $scope.selectedInstance != null &&
                        $scope.chatInstances[$scope.selectedInstance].groupId == groupId &&                        
                        $scope.chatInstances[$scope.selectedInstance].sessionOneToOneChatInstanceId == sessionOneToOneChatInstanceId) {
                        clearTimeout($scope.timeout);
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.someonesTyping = true;
                                $scope.typingDisplayName = displayName;
                                var chatMessages = $("#chat-messages");
                                chatMessages.animate({
                                    scrollTop: chatMessages[0].scrollHeight - chatMessages[0].clientHeight
                                }, 50);
                            });
                        });

                        $scope.timeout = setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.someonesTyping = false;
                                $scope.typingDisplayName = displayName;
                            });
                            }, 4000);
                            
                    }                    
                });

                /*************** TUTOR COMMAND LINK START ***************/

                $rootScope.$on('openAllChat', function (event) {
                    $scope.findAndOpenChat(null, null);
                });

                $rootScope.$on('openGroupChat', function (event, groupId) {
                    $scope.findAndOpenChat(groupId, null);
                });

                $rootScope.$on('openSingleChat', function (event, userId) {
                    $scope.findAndOpenChat(null, userId);
                });

                $scope.findAndOpenChat = function (groupId, userId) {
                    for (var i = 0; i < $scope.chatInstances.length; i++) {
                        if ($scope.chatInstances[i].groupId == groupId && $scope.chatInstances[i].toUserId == userId) {
                            if (!$scope.isOpen) {
                                $scope.isOpen = true;
                            }
                            $scope.showInstance(i);
                            break;
                        }
                    }
                };

                /*************** TUTOR COMMAND LINK END ***************/

                /**************** CALLS START *****************/

                $scope.makeCall = function (chatInstance) {
                    if (chatInstance.toUserId != null) {
                        $scope.callUser(chatInstance.toUserId);
                    }
                    else if (chatInstance.groupId != null) {
                        $scope.joinGroupRoom(chatInstance.groupId);
                    }
                    else {
                        $scope.joinAllRoom();
                    }
                };

                $scope.callUser = function (userId) {
                    if ($scope.isTutor) {
                        $rootScope.$broadcast('callUser', { classSessionId: $scope.classSessionId, userId: userId });
                    }
                    else {
                        $rootScope.$broadcast('callFromStudentFromChat', { classSessionId: $scope.classSessionId, userId: userId });
                    }
                };

                $scope.joinGroupRoom = function (groupId) {
                    if ($scope.isTutor) {
                        $rootScope.$broadcast('joinGroupCallFromChat', { classSessionId: $scope.classSessionId, groupId: groupId });
                    }
                    else {
                        $rootScope.$broadcast('callGroupFromStudentFromChat', { classSessionId: $scope.classSessionId, groupId: groupId });
                    }
                };

                $scope.joinAllRoom = function () {
                    if ($scope.isTutor) {
                        $rootScope.$broadcast('joinAllCallFromChat', { classSessionId: $scope.classSessionId });
                    }
                    else {
                        $rootScope.$broadcast('callAllFromStudentFromChat', { classSessionId: $scope.classSessionId });
                    }
                };

                /**************** CALLS END *******************/

                /*************** HELP REQUESTS START ***************/

                $rootScope.$on('helpRequested', function (event, userId) {
                    for (var a = 0; a < $scope.chatInstances.length; a++) {
                        if ($scope.chatInstances[a].toUserId == userId) {
                            $scope.chatInstances[a].helpRequested = true;
                            break;
                        }
                    }
                });

                $rootScope.$on('helpDelivered', function (event, userId) {
                    for (var a = 0; a < $scope.chatInstances.length; a++) {
                        if ($scope.chatInstances[a].toUserId == userId) {
                            $scope.chatInstances[a].helpRequested = false;
                            break;
                        }
                    }
                });

                /*************** HELP REQUESTS END ***************/

                /*************** PERMISSIONS START ***************/

                $rootScope.$on('individualPermissionChangeChat', function (event, chatActive) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.deviceOptions.chatIndividuals = chatActive;
                        });
                    });
                });

                $rootScope.$on('allPermissionChangeChat', function (event, chatActive) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.deviceOptions.chatAll = chatActive;
                        });
                    });
                });

                $rootScope.$on('groupPermissionChangeChat', function (event, chatActive) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.deviceOptions.chatGroup = chatActive;
                        });
                    });
                });

                $scope.isChatAvailableFromInstance = function (idx) {
                    if ($scope.chatInstances[idx].toUserId == undefined || $scope.chatInstances[idx].toUserId == null) {
                        if ($scope.chatInstances[idx].groupId == undefined || $scope.chatInstances[idx].groupId == null) {
                            return $scope.deviceOptions.chatAll;
                        }
                        else {
                            return $scope.deviceOptions.chatGroup;
                        }
                    }
                    else {
                        return $scope.deviceOptions.chatIndividuals;
                    }
                };

                $scope.isChatAvailable = function () {
                    if ($scope.selectedInstance != undefined) {
                        if ($scope.chatInstances[$scope.selectedInstance].toUserId == undefined || $scope.chatInstances[$scope.selectedInstance].toUserId == null) {
                            if ($scope.chatInstances[$scope.selectedInstance].groupId == undefined || $scope.chatInstances[$scope.selectedInstance].groupId == null) {
                                return $scope.deviceOptions.chatAll;
                            }
                            else {
                                return $scope.deviceOptions.chatGroup;
                            }
                        }
                        else {
                            return $scope.deviceOptions.chatIndividuals;
                        }
                    }
                };

                /*************** PERMISSIONS END ***************/

                /*************** GROUP ASSIGNMENT START ***************/

                $scope.$on('groupMoved', function (event, groupId) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            SessionMessagesService.getGroupInstance({ classSessionId: $scope.classSessionId, groupId: groupId }, function (success) {
                                var found = false;
                                for (var i = 0; i < $scope.chatInstances.length; i++) {
                                    if ($scope.chatInstances[i].toUserId == null && $scope.chatInstances[i].groupId != null) {
                                        if (i == $scope.selectedInstance) {
                                            $scope.messageBox = '';
                                            $scope.selectedInstance = undefined;
                                        }
                                        $scope.currentTotalUnread = $scope.currentTotalUnread - ($scope.chatInstances[i].messages.length - $scope.chatInstances[i].currentChatPosition) + (success.messages.length - success.currentChatPosition);
                                        var deletedChat = $scope.chatInstances.splice(i, 1, success)[0];
                                        found = true;
                                        $scope.chattConnection.invoke('disconnect', $scope.classSessionId, deletedChat.groupId, deletedChat.toUserId, deletedChat.sessionOneToOneChatInstanceId);
                                        $scope.extendPing();
                                        break;
                                    }
                                }
                                // If wasn't already in a group chat
                                if (found == false) {
                                    if ($scope.chatInstances.length > 0) {
                                        $scope.chatInstances.splice(1, 0, success);
                                    }
                                    else {
                                        $scope.chatInstances.push(success);
                                    }
                                }
                                $scope.deviceOptions.chatGroup = success.chatActive;
                                $scope.chattConnection.invoke('connect', $scope.classSessionId, success.groupId, success.toUserId, success.sessionOneToOneChatInstanceId);
                                $scope.extendPing();
                            }, function (err) {
                            });
                        });
                    });
                });

                // For when a student is removed from a group - NOT TO BE CONFUSED WITH A GROUP BEING REMOVED
                $scope.$on('groupRemoved', function (event) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            for (var i = 0; i < $scope.chatInstances.length; i++) {
                                if ($scope.chatInstances[i].toUserId == null && $scope.chatInstances[i].groupId != null) {
                                    $scope.removeGroupLogic(i);
                                    break;
                                }
                            }
                        });
                    });
                });

                // For when a new group is added from tutor command
                $scope.$on('newGroupChatroom', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.chatInstances.length == 0) {
                                // If it goes in here it's messed up anyway but for redundency's sake
                                $scope.chatInstances.push(data);
                            }
                            else {
                                // Find the end of the groups and splice it in there, connect to signalR
                                // (This way the ordering will match up with tutor command and look peng)
                                for (var i = 1; i < $scope.chatInstances.length; i++) {
                                    if ($scope.chatInstances[i].groupId == null) {
                                        $scope.chatInstances.splice(i - 1, 0, data);
                                        $scope.chattConnection.invoke('connect',
                                            $scope.classSessionId, data.groupId, data.toUserId, data.sessionOneToOneChatInstanceId
                                        );
                                        break;
                                    }
                                }
                            }
                        });
                    });
                });

                // For when a group is removed from tutor command - Shares logic when room found with student removal
                $scope.$on('removeGroup', function (event, data) {
                    // Find and remove the group
                    $timeout(function () {
                        $scope.$apply(function () {
                            for (var i = 0; i < $scope.chatInstances.length; i++) {
                                if ($scope.chatInstances[i].groupId == data) {
                                    $scope.removeGroupLogic(i);
                                    break;
                                }
                            }
                        });
                    });
                });

                $scope.removeGroupLogic = function (index) {
                    if (index == $scope.selectedInstance) {
                        $scope.messageBox = '';
                        $scope.selectedInstance = undefined;
                    }
                    $scope.currentTotalUnread = $scope.currentTotalUnread - ($scope.chatInstances[index].messages.length - $scope.chatInstances[index].currentChatPosition);
                    var deletedChat = $scope.chatInstances.splice(index, 1)[0];
                    $scope.chattConnection.invoke('disconnect', $scope.classSessionId, deletedChat.groupId, deletedChat.toUserId, deletedChat.sessionOneToOneChatInstanceId);
                };

                /*************** GROUP ASSIGNMENT END ***************/

                $scope.init();
            }
        ]);
})();