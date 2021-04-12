(function () {
    angular.module('standingOut.controllers').controller('ClassroomWebcamV2Controller',
        ['$scope', '$rootScope', '$timeout', 'ModalService', 'DeleteService', 'ClassroomSessionsService', 'ClassSessionVideoRoomsService', 'SessionAttendeesService',
            function ($scope, $rootScope, $timeout, ModalService, DeleteService, ClassroomSessionsService, ClassSessionVideoRoomsService, SessionAttendeesService) {
                $scope.classSessionId = classSessionId;
                $scope.userId = userId;
                $scope.tutorUserId = tutorId;
                $scope.devMode = devMode; // This prevents the room auto-joining - save some cash

                // General stuff
                $scope.isPanelOpen = true; // Is the main webcam panel open?
                $scope.isRecordingEnabled = true;
                $scope.toLoadOut = 1;
                $scope.loadedOut = 0;
                $scope.toLoad = 3;
                $scope.loaded = 0;
                $scope.isSettingsOpen = false; // Are the settings open
                $scope.screenTrack = null; // Have this so can easilly end the screenshare
                $scope.loader = null; // Loader for the webcam
                $scope.hideFloating = false;

                // Drag drop floaty boy
                $scope.floaterTransformTop = null;
                $scope.floaterTransformLeft = null;
                $scope.origTransformTop = null;
                $scope.origTransformLeft = null;
                $scope.origTransformPosition = null;
                $scope.origTransformZIndex = null;

                // User settings
                $scope.videoDevice = null;
                $scope.audioDevice = null;

                $scope.audioMuted = false;
                $scope.videoMuted = false;
                $scope.screenMuted = true;
                $scope.audioVolume = 1;
                $rootScope.forceActive = false;

                // Tutor Command Settings
                $scope.deviceOptions = {
                    videoEnabled: false,
                    audioEnabled: false,
                    screenShareEnabled: false,
                    groupVideoEnabled: false,
                    groupAudioEnabled: false,
                    groupScreenShareEnabled: false,
                    callIndividualsEnabled: false
                };

                // Settings stuff
                $scope.videoDevices = [];
                $scope.audioDevices = [];

                // Twillio stuff
                $scope.twillioToken = null; // Token for twillio
                $scope.twillioIdentity = null; // Identity in twillio
                $scope.twillioRoom = null; // Room from twillio
                $scope._video = Twilio.Video; // Twillio vid library

                // Room stuff
                $scope.webcamGroups = []; // The groups of rooms that can be joined
                $rootScope.selectedRoom = null; // The room selected in the dropdown
                $scope.joinedRoom = null; // The room currently in
                $scope.focusUserId = null; // The current pinned/expanded user
                $scope.isExpanded = false;
                $scope.dominantUserId = null; // The current dominant speaker

                $scope.previousRoom = null;


                $scope.init = function () {
                    $scope.loader = document.getElementById('loader_webcam');
                    $scope.setupMediaDevices();

                    ClassroomSessionsService.getWebcamGroups({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.webcamGroups = success.webcamGroups;
                        $scope.webcamGroupsAll = success.webcamGroupsAll;
                        // Loop is to find the correct first room
                        for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                            if ($scope.webcamGroupsAll[i].typeString == "All") {
                                $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                break;
                            }
                        }
                        $scope.handleRemainingInit();
                        $scope.incrementLoad();
                    }, function (error) {
                        console.log(error);
                    });


                };

                $scope.handleRemainingInit = function () {
                    // This is inneficient but will work for now
                    if ($scope.userId == $scope.tutorUserId) {
                        $scope.deviceOptions = {
                            videoEnabled: true,
                            audioEnabled: true,
                            screenShareEnabled: true,
                            groupVideoEnabled: true,
                            groupAudioEnabled: true,
                            groupScreenShareEnabled: true,
                            callIndividualsEnabled: true
                        };
                        $scope.incrementLoad();
                    }
                    else {
                        SessionAttendeesService.my({ classSessionId: $scope.classSessionId }, function (success) {
                            $scope.setPermissions(success);
                            $scope.audioMuted = !$scope.deviceOptions.audioEnabled;
                            $scope.videoMuted = !$scope.deviceOptions.videoEnabled;
                            $scope.incrementLoad();
                        }, function (error) {
                        });
                    }

                    // If session is Over 18s disables recording (use second twilio acc)
                    ClassroomSessionsService.getTwilioKeyByClassSession({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.twillioIdentity = success.identity;
                        $scope.twillioToken = success.token;
                        $scope.isRecordingEnabled = success.isRecordingEnabled;
                        console.log("IsRecording status:", success.isRecordingEnabled);
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.showLoader = function () {
                    $scope.loader.style.display = 'block';
                };
                $scope.hideLoader = function () {
                    $scope.loader.style.display = 'none';
                };

                $scope.toggleFloatingPanel = function () {
                    $scope.hideFloating = !$scope.hideFloating;
                };

                $scope.dragFloater = function (event) {

                    // https://javascript.info/mouse-drag-and-drop <- Excellent tutorial for how to impliment native drag drop

                    // Only do this if the panel is closed
                    if (!$scope.isPanelOpen) {
                        // Get our element
                        var element = document.getElementById('floaterPanel');

                        // Find out how much our click is from offset from the centre of the element
                        var shiftX = event.clientX - element.getBoundingClientRect().left;
                        var shiftY = event.clientY - element.getBoundingClientRect().top;

                        // Find the screen size minus the size of the element (so can prevent pushing out of the screen - for the most part)
                        var screenX = document.body.getBoundingClientRect().right - element.getBoundingClientRect().width;
                        var screenY = document.body.getBoundingClientRect().bottom - element.getBoundingClientRect().height;

                        // Prevent browser default behavior
                        element.ondragstart = function () {
                            return false;
                        };

                        // Set parameters so we can drag this easilly
                        element.style.position = 'absolute';
                        element.style.zIndex = 1000;

                        // Move the element
                        moveAt(element.pageX, event.pageY);

                        // Function for moving element definition
                        function moveAt(x, y) {
                            // Assign new positions
                            var newX = x - shiftX;
                            var newY = y - shiftY;
                            element.style.left = (newX < 0 ? 0 : (newX > screenX ? screenX : newX)) + 'px';
                            element.style.top = (newY < 0 ? 0 : (newY > screenY ? screenY : newY)) + 'px';
                        };


                        // Function for mouse move event
                        function onMouseMove(event) {
                            moveAt(event.pageX, event.pageY);
                        };

                        // Function for mouse up event or if the mouse leaves
                        function completeDrag() {
                            // Remove the full screen mouse move event and detection for leaving screen
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseleave', completeDrag);
                            // Remove our mouse up event
                            element.onmouseup = null;
                            // Set z-index back to it's original value
                            element.style.zIndex = $scope.origTransformZIndex;
                        }

                        // Assign event to whole screen so we can detect movement effectively
                        document.addEventListener('mousemove', onMouseMove); // This is the bit that makes the magic happen
                        // Detection for if the mouse leaves the screen (can result in not registering drop if not here)
                        document.body.addEventListener('mouseleave', completeDrag);

                        // Assign event to element so we can detect when to stop dragging
                        element.onmouseup = completeDrag;
                    }

                };


                $scope.$on('sessionHasStarted', function (event) {
                    if ($scope.isPanelOpen == true) {
                        $scope.togglePanel();
                    }
                });




                $scope.togglePanel = function () {
                    if ($scope.isPanelOpen) {
                        $scope.isPanelOpen = false;
                        // If opened previously - Place where was left last
                        if ($scope.floaterTransformTop != null && $scope.floaterTransformLeft != null) {

                            var element = document.getElementById('floaterPanel');
                            element.style.position = 'absolute';
                            element.style.top = $scope.floaterTransformTop;
                            element.style.left = $scope.floaterTransformLeft;
                        }
                    }
                    else {

                        if ($scope.focusUserId == null) {
                            $scope.resetOrder();
                        }

                        var element = document.getElementById('floaterPanel');

                        // Store last position so can be maintained when re-opened
                        $scope.floaterTransformTop = element.style.top;
                        $scope.floaterTransformLeft = element.style.left;

                        // Restore default panel positioning before re-opening 
                        element.style.top = $scope.origTransformTop;
                        element.style.left = $scope.origTransformLeft;
                        element.style.position = $scope.origTransformPosition;
                        element.style.zIndex = $scope.origTransformZIndex;
                        $scope.isPanelOpen = true;
                    }
                };

                // Actions to take once all data is loaded on init
                $scope.incrementLoad = function () {
                    $scope.loaded++;
                    if ($scope.loaded >= $scope.toLoad) {
                        // Gets some original values for the panel so can send back
                        var element = document.getElementById('floaterPanel');
                        $scope.origTransformTop = element.style.top;
                        $scope.origTransformLeft = element.style.left;
                        $scope.origTransformPosition = element.style.position;
                        $scope.origTransformZIndex = element.style.zIndex;

                        if ($scope.loadedOut >= $scope.toLoadOut) {
                            // Join now it is safe to do so - If dev mode switched on don't (just to save cost)
                            if ($scope.devMode != true) {
                                $scope.joinRoom($rootScope.selectedRoom);
                                console.log("Joined room:", $rootScope.selectedRoom);
                                // Inform user
                                toastr.clear();
                                if ($scope.isRecordingEnabled) {
                                    toastr.info('Your webcam and microphone will be recorded for safeguarding purposes when you share them');
                                }
                            }
                            else {
                                $scope.hideLoader();
                            }
                        }
                    }
                };

                // Recieved from the entry modal once a click has been aquired (so video can be displayed)
                $scope.$on('entryComplete', function (event, data) {
                    // Variable in case pop-up is closed before the component has loaded
                    $scope.loadedOut++;
                    if ($scope.loaded >= $scope.toLoad) {
                        // Join now it is safe to do so - If dev mode switched on don't (just to save cost)
                        if (!$scope.devMode) {
                            $scope.joinRoom($rootScope.selectedRoom);
                            console.log("Joined room:", $rootScope.selectedRoom);

                            // Inform user
                            toastr.clear();
                            if ($scope.isRecordingEnabled) {
                                toastr.info('Your webcam and microphone will be recorded for safeguarding purposes when you share them');
                            }
                        }
                        else {
                            $scope.hideLoader();
                        }
                    }
                });

                // Pulls the initial video and audio device selection
                $scope.setupMediaDevices = function () {
                    // Get device options and store them - if there is no device Id set yet, use the first found
                    var videoDevices = [];
                    var audioDevices = [];
                    navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
                        mediaDevices.forEach(function (mediaDevice) {
                            if (mediaDevice.kind === 'videoinput' && mediaDevice.deviceId != '') {
                                videoDevices.push({ deviceId: mediaDevice.deviceId, label: mediaDevice.label });
                                if ($scope.videoDevice == null) {
                                    $scope.videoDevice = mediaDevice.deviceId;
                                }
                            } else if (mediaDevice.kind === 'audioinput' && mediaDevice.deviceId != '') {
                                audioDevices.push({ deviceId: mediaDevice.deviceId, label: mediaDevice.label });
                                if ($scope.audioDevice == null) {
                                    $scope.audioDevice = mediaDevice.deviceId;
                                }
                            }
                        });
                        $scope.videoDevices = videoDevices;
                        $scope.audioDevices = audioDevices;
                    }, function (error) {
                    });
                };

                // Navigation to an individual chat by clicking on a user
                $scope.selectIndividual = function (user) {
                    // Only do this if the panel is open
                    if ($scope.isPanelOpen) {
                        // Ensure the permissions are set up for calling an individual
                        if ($scope.deviceOptions.callIndividualsEnabled) {
                            // Check it's possible to nav there (i.e. not the user themselves)
                            if ($scope.userId != user.userId) {
                                // Find the user's room in the groups and select it
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].typeString == 'Individual') {
                                        for (var k = 0; k < $scope.webcamGroupsAll[i].users.length; k++) {
                                            if ($scope.webcamGroupsAll[i].users[k].userId == user.userId) {
                                                $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                                $scope.joinRoom($rootScope.selectedRoom);
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            toastr.clear();
                            toastr.info('You don\'t have access to call individuals');
                        }
                    }
                };


                $scope.callUser = function (user) {
                    $rootScope.$broadcast('callUser', { classSessionId: $scope.classSessionId, userId: user.userId });
                    $scope.callMade = true;
                    $rootScope.$broadcast('helpDelivered', user.userId);
                };

                $scope.$on('callFromStudentFromChat', function (event, data) {
                    if ($scope.deviceOptions.popupEnabled) {
                        $rootScope.$broadcast('callUser', data);
                    }
                    else {
                        toastr.clear();
                        toastr.error('Video is not been enabled');
                    }
                });

                $scope.$on('startCall', function (event, opt) {
                    if ($scope.joinedRoom === undefined || $scope.joinedRoom == null || opt.roomId != $scope.joinedRoom.value || $scope.sessionInProgress == false) {
                        for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                            if ($scope.webcamGroupsAll[i].value == opt.roomId) {
                                $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                $scope.joinRoom($rootScope.selectedRoom);
                                break;
                            }
                        }

                    }
                    else {
                        $scope.awaitingUsers = opt.users;
                    }
                });

                // Navigation back to all chat
                $scope.backToAll = function () {
                    let joined = false;

                    if ($scope.previousRoom !== undefined && $scope.previousRoom != null && $scope.previousRoom != '') {
                        for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                            if ($scope.webcamGroupsAll[i].identifier == $scope.previousRoom) {
                                $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                $scope.joinRoom($rootScope.selectedRoom);
                                joined = true;
                                break;
                            }
                        }
                    }

                    if (joined == false) {
                        // Find the all room in the groups and select it
                        for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                            if ($scope.webcamGroupsAll[i].typeString == 'All') {
                                $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                $scope.joinRoom($rootScope.selectedRoom);
                                break;
                            }
                        }
                    }
                };

                // For making fully fullscreen
                $scope.fullscreenVideo = function (event, id) {
                    // Propagation stopped so a user isn't selected or dragged
                    event.stopPropagation();
                    var videoElement = document.getElementById(id).querySelector('video');
                    if (videoElement != undefined) {
                        if (videoElement.requestFullscreen) {
                            videoElement.requestFullscreen({ navigationUI: "hide" });
                        } else if (videoElement.mozRequestFullScreen) {
                            videoElement.mozRequestFullScreen();
                        } else if (videoElement.webkitRequestFullscreen) {
                            videoElement.webkitRequestFullscreen();
                        }
                    }
                };

                // For minor expanding
                $scope.toggleExpand = function (room, user) {
                    event.stopPropagation();

                    for (var i = 0; i < room.users.length; i++) {
                        if (room.users[i].userId == user.userId) {

                            if (this.isPanelOpen == false) {
                                var element = document.getElementById('floaterPanel');
                                let top = element.style.top.replace('px', '');
                                var actualBottom = $(window).height() - ($('#floaterPanel').offset().top + $('#floaterPanel').outerHeight(true));

                                if ((actualBottom - 400) < 0) {
                                    element.style.top = (top - 400) + 'px';
                                }
                                //if (room.users[i].isExpanded == true) {
                                //    element.style.top = '400px';
                                //    element.style.left = '40px';
                                //} else if ((actualBottom - 400) < 0) {
                                //    element.style.top = '400px';
                                //    element.style.left = '40px';
                                //}
                            }

                            room.users[i].isExpanded = !room.users[i].isExpanded;
                            break;
                        }
                    }
                };

                // For pinning
                $scope.setFocusUser = function (event, room, user) {
                    // Propagation stopped so a user isn't selected or dragged
                    event.stopPropagation();
                    $scope.focusUserId = user.userId;
                    $scope.moveToFront(user.userId, user.position);
                };

                // For removing pinning
                $scope.unsetFocusUser = function (event, room) {
                    // Propagation stopped so a user isn't selected or dragged
                    event.stopPropagation();
                    $scope.focusUserId = null;
                    $scope.resetOrder()
                };

                // For opening settings
                $scope.openSettings = function () {
                    // Open modal
                    $scope.isSettingsOpen = true;
                    $scope.setupMediaDevices();
                };

                // For closing settings
                $scope.closeSettings = function () {
                    // Close modal
                    $scope.isSettingsOpen = false;
                };

                // For setting the audio level
                $scope.setAudioVolume = function () {
                    var audioTags = document.getElementById('w_' + $scope.joinedRoom.value).getElementsByTagName("audio");
                    for (var i = 0; i < audioTags.length; i++) {
                        audioTags[i].volume = $scope.audioVolume;
                    }
                };

                // For setting the video device
                $scope.updateVideoDevice = function () {
                    if (!$scope.videoMuted && $scope.deviceOptions.videoEnabled) {
                        // Removes any video tracks already attached to html
                        $scope.unpublishLocalTracksByKind('video');
                        // This will connect in either a enabled/diabled state depending on muted the new track
                        $scope.connectLocalTrack('video');
                    }
                };

                // For setting the audio device
                $scope.updateAudioDevice = function () {
                    if (!$scope.audioMuted && $scope.deviceOptions.audioEnabled) {
                        // Removes any video tracks already attached to html
                        $scope.unpublishLocalTracksByKind('audio');
                        // This will connect in either a enabled/diabled state depending on muted the new track
                        $scope.connectLocalTrack('audio');
                    }
                };

                // For leaving a room
                $scope.leaveRoom = function () {
                    // Clear any settings
                    $scope.clearRoomUserSettings($scope.joinedRoom);
                    // Removes any tracks already attached to html - so we can remove the recording symbol
                    $scope.unpublishLocalTracksByKind('video');
                    $scope.unpublishLocalTracksByKind('audio');
                    // Gets ourself out the room
                    $scope.twillioRoom.disconnect();
                    $scope.focusUserId = null;
                    $scope.dominantUserId = null;
                    $scope.joinedRoom = null;
                };

                $scope.joinRoomBefore = function () {
                    $scope.joinRoom($rootScope.selectedRoom);
                };

                // Joining a room
                $scope.joinRoom = function (roomToJoin) {
                    if (roomToJoin.typeString == 'Individual' && $scope.userId == $scope.tutorUserId) {
                        for (var u = 0; u < roomToJoin.users.length; u++) {
                            if (roomToJoin.users[u].userId != $scope.tutorUserId) {
                                $rootScope.$broadcast('helpDelivered', roomToJoin.users[u].userId);
                            }
                        }
                    }


                    $scope.showLoader();
                    if ($scope.joinedRoom != null) {
                        $scope.previousRoom = $scope.joinedRoom.identifier;
                        $scope.leaveRoom();
                    }
                    $scope.clearRoomUserSettings(roomToJoin);
                    $scope.joinedRoom = roomToJoin;
                    $scope.connectToRoom(roomToJoin);

                    //if ($scope.userId != $scope.tutorUserId) {
                    //    SessionAttendeesService.my({ classSessionId: $scope.classSessionId }, function (success) {
                    //        $scope.setPermissions(success);
                    //        $scope.audioMuted = !$scope.deviceOptions.audioEnabled;
                    //        $scope.videoMuted = !$scope.deviceOptions.videoEnabled;
                    //        $scope.incrementLoad();
                    //    }, function (error) {
                    //    });
                    //}
                };

                $scope.clearRoomUserSettings = function (roomToJoin) {
                    for (var k = 0; k < roomToJoin.users.length; k++) {
                        roomToJoin.users[k].isInRoom = false;
                        roomToJoin.users[k].isMicOn = false;
                        roomToJoin.users[k].audioSid = null;
                        roomToJoin.users[k].sharingScreen = false;
                    }
                };

                // Connect to a room
                $scope.connectToRoom = function (roomToConnect) {
                    var connectOptions = {
                        name: roomToConnect.value,
                        //logLevel: 'debug',
                        logLevel: 'off',
                        dominantSpeaker: true,
                        video: false,
                        audio: false,
                        networkQuality: {
                            local: 2, // LocalParticipant's Network Quality verbosity [1 - 3]
                            remote: 2 // RemoteParticipants' Network Quality verbosity [0 - 3]
                        }
                    };

                    $scope._video.connect($scope.twillioToken, connectOptions).then(function (twillioRoom) {
                        // Set room to be
                        $scope.twillioRoom = twillioRoom;

                        // Connect own tracks
                        if (!$scope.audioMuted && $scope.deviceOptions.videoEnabled) {
                            $scope.connectLocalTrack('audio');
                        }
                        if (!$scope.videoMuted && $scope.deviceOptions.audioEnabled) {
                            $scope.connectLocalTrack('video');
                        }

                        // Set up self as in the room
                        for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                            if ($scope.joinedRoom.users[i].userId == $scope.userId) {
                                $scope.joinedRoom.users[i].isInRoom = true;
                                break;
                            }
                        }


                        // If the only person in the room, set self as dominant speaker (so looks fresh) - Otherwise set first user
                        if (twillioRoom.participants.size == 0) {
                            $scope.dominantUserId = $scope.userId;
                        }
                        else {
                            $scope.dominantUserId = roomToConnect.users[0].userId;
                        }

                        // Attach others tracks
                        twillioRoom.participants.forEach(function (participant) {
                            $scope.participantConnected(participant);
                        });

                        //local participant watcher
                        twillioRoom.localParticipant.on('networkQualityLevelChanged', function (networkQualityLevel, networkQualityStats) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                                        if ($scope.joinedRoom.users[i].userId == twillioRoom.localParticipant.identity) {

                                            let quality = 'Good';

                                            if (networkQualityLevel >= 4) {
                                                quality = 'Good';
                                            } else if (networkQualityLevel == 3) {
                                                quality = 'Average';
                                            } else if (networkQualityLevel > 0) {
                                                quality = 'Poor';
                                            }
                                            else if (networkQualityLevel == 0) {
                                                quality = 'Reconnecting';
                                            }

                                            $scope.joinedRoom.users[i].networkQualityLevel = quality;
                                            break;
                                        }
                                    }
                                });
                            });


                        });


                        // Setup the room for future changes
                        $scope.setupTwillioRoomTriggers(twillioRoom);

                        // For our own records of who joined where
                        ClassSessionVideoRoomsService.save({}, { classSessionId: $scope.classSessionId, roomSid: twillioRoom.sid, participantSid: twillioRoom.localParticipant.sid }, function (videoroom) {
                        }, function (error) {
                        });

                        $scope.hideLoader();
                    }, function (error) {
                        console.log(error);

                        $scope.hideLoader();
                        toastr.clear();
                        toastr.info('An error occured joining the call');
                    });
                };

                $scope.participantConnected = function (participant) {
                    for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                        if ($scope.joinedRoom.users[i].userId == participant.identity) {
                            $scope.joinedRoom.users[i].isInRoom = true;
                            $scope.joinedRoom.users[i].sharingScreen = false;
                            break;
                        }
                    }
                    // Sets up the user's triggers
                    $scope.setupTwillioUserTriggers(participant);
                };

                $scope.attachTrack = function (roomJoined, userId, track) {
                    // Attaches a track
                    if (track.kind == 'audio') {
                        var attachedTrack = track.attach();
                        // Adjusts the volume
                        attachedTrack.volume = $scope.audioVolume;
                        attachedTrack.id = track.sid == undefined ? track.id : track.sid;
                        if (!track.isEnabled) {
                            attachedTrack.muted = true;
                            attachedTrack.hidden = true;
                        }
                        document.getElementById('w_' + roomJoined.value + '_' + userId).appendChild(attachedTrack);
                        // Flags audio as on
                        for (var k = 0; k < $scope.joinedRoom.users.length; k++) {
                            if (roomJoined.users[k].userId == userId) {
                                roomJoined.users[k].isMicOn = true;
                                roomJoined.users[k].audioSid = track.sid;

                                // This seems to need to be here - Why is a mystery to me
                                $timeout(function () {
                                    $scope.$apply(function () {
                                        roomJoined.users[k];
                                    });
                                });

                                break;
                            }
                        }
                    }
                    else if (track.kind == 'video') {
                        var attachedTrack = track.attach();
                        attachedTrack.id = track.sid == undefined ? track.id : track.sid;
                        if (!track.isEnabled) {
                            attachedTrack.muted = true;
                            attachedTrack.hidden = true;
                        }
                        document.getElementById('w_' + roomJoined.value + '_' + userId).appendChild(attachedTrack);
                    }
                };

                $scope.detachTrack = function (track) {
                    var userTrack = document.getElementById(track.sid);
                    if (userTrack != undefined) {
                        userTrack.remove();
                    }
                    if (track.kind == 'audio') {
                        for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                            if ($scope.joinedRoom.users[i].audioSid == track.sid) {
                                $scope.joinedRoom.users[i].audioSid = null;
                                $scope.joinedRoom.users[i].isMicOn = false;
                            }
                        }
                    }
                };

                $scope.detachTracks = function (roomJoined, participant) {
                    for (var i = 0; i < roomJoined.users.length; i++) {
                        if (roomJoined.users[i].userId == participant.identity) {
                            roomJoined.users[i].isMicOn = false;
                            roomJoined.users[i].audioSid = null;

                            // This seems to need to be here - Why is a mystery to me
                            $timeout(function () {
                                $scope.$apply(function () {
                                    roomJoined.users[i];
                                });
                            });

                            break;
                        }
                    }
                    var userArea = document.getElementById('w_' + $scope.joinedRoom.value + '_' + participant.identity);
                    if (userArea != undefined) {
                        var userElementsVideo = userArea.querySelectorAll('video');
                        if (userElementsVideo != null) {
                            userElementsVideo.forEach(function (element) {
                                element.remove();
                            });
                        }
                        var userElementsAudio = userArea.querySelectorAll('audio');
                        if (userElementsAudio != null) {
                            userElementsAudio.forEach(function (element) {
                                element.remove();
                            });
                        }
                    }
                };

                // Safely detatches other users tracks
                $scope.detachTracksByKind = function (participant, kind) {
                    $scope.genericActionTrackByKind(participant, kind, $scope.detachTrack);
                };
                // Safely detatches local tracks
                $scope.unpublishLocalTracksByKind = function (kind) {

                    if ($scope.twillioRoom !== undefined && $scope.twillioRoom != null &&
                        $scope.twillioRoom.localParticipant !== undefined && $scope.twillioRoom.localParticipant != null) {

                        $scope.genericActionTrackByKind($scope.twillioRoom.localParticipant, kind, function (track) {
                            // Seems like it's doinjg a lot here to remove a track, it is.
                            // But for some reason stop and disable are both needed to stop the recording icon in browser
                            track.stop();
                            track.disable();
                            // This removes our track from twillio
                            $scope.twillioRoom.localParticipant.unpublishTrack(track);
                            // And then we clear the track locally
                            $scope.detachTrack(track);
                            // Seems to not remove from screen sometimes -> Sort it manually here
                            var userArea = document.getElementById('w_' + $scope.joinedRoom.value + '_' + $scope.userId);
                            var userElements = userArea.querySelectorAll(kind);
                            if (userElements != null) {
                                userElements.forEach(function (element) {
                                    element.remove();
                                });
                            }
                        });
                    }
                };
                // Generic function that performs a kind check then does something if it matches
                $scope.genericActionTrackByKind = function (participant, kind, action) {
                    participant.tracks.forEach(function (publication) {
                        if (publication.kind == kind) {
                            action(publication.track);
                        }
                    });
                };

                $scope.setupTwillioRoomTriggers = function (twillioRoom) {
                    // A participant connected
                    twillioRoom.on('participantConnected', function (participant) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.participantConnected(participant);
                            });
                        });
                    });
                    // A participant disconnected
                    twillioRoom.on('participantDisconnected', function (participant) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                                    if ($scope.joinedRoom.users[i].userId == participant.identity) {
                                        $scope.joinedRoom.users[i].isInRoom = false;
                                        $scope.joinedRoom.users[i].sharingScreen = false;
                                        break;
                                    }
                                }
                                $scope.detachTracks($scope.joinedRoom, participant);

                                if ($scope.joinedRoom.typeString == 'Individual') {
                                    $scope.backToAll();
                                }



                            });
                        });
                    });
                    // If disconnected
                    twillioRoom.once('disconnected', function (error) {
                        //twillioRoom.participants.forEach(function (participant) { $scope.detachTracks($scope.joinedRoom, participant); });
                    });

                    // Dominant speaker changes
                    twillioRoom.on('dominantSpeakerChanged', function (participant) {
                        // This comes through as null when audio is muted!!!

                        //original code
                        //if (participant != null) {

                        //    $timeout(function () {
                        //        $scope.$apply(function () {
                        //            $scope.dominantUserId = participant.identity;
                        //            for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                        //                if ($scope.joinedRoom.users[i].userId == $scope.dominantUserId) {
                        //                    if (i > 0) {
                        //                        if ($scope.focusUserId == null) {
                        //                            //MLToReplace//$scope.joinedRoom.users.unshift($scope.joinedRoom.users.splice(i, 1)[0]);
                        //                        }
                        //                        else if (i > 1) {
                        //                            //MLToReplace//$scope.joinedRoom.users.splice(1, 0, $scope.joinedRoom.users.splice(i, 1));
                        //                        }
                        //                    }
                        //                    break;
                        //                }
                        //            }
                        //        });
                        //    });
                        //}


                        //MLS second and final version
                        if ($scope.isPanelOpen == false && participant != null) {

                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.dominantUserId = participant.identity;
                                    for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                                        if ($scope.joinedRoom.users[i].userId == $scope.dominantUserId) {
                                            if (i > 0) {
                                                if ($scope.focusUserId == null) {
                                                    $scope.moveToFront($scope.joinedRoom.users[i].userId, $scope.joinedRoom.users[i].position)
                                                }
                                            }
                                            break;
                                        }
                                    }
                                });
                            });
                        }
                    });
                };

                $scope.setupTwillioUserTriggers = function (participant) {
                    // A participant subscribes a track
                    participant.on('trackSubscribed', function (track) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.attachTrack($scope.joinedRoom, participant.identity, track);
                            });
                        });
                    });
                    // A participant unsubscribes a track
                    participant.on('trackUnsubscribed', function (track) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.detachTrack(track);
                            });
                        });
                    });

                    participant.on('networkQualityLevelChanged', function (networkQualityLevel, networkQualityStats) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                                    if ($scope.joinedRoom.users[i].userId == participant.identity) {

                                        let quality = 'Good';

                                        if (networkQualityLevel >= 4) {
                                            quality = 'Good';
                                        } else if (networkQualityLevel == 3) {
                                            quality = 'Average';
                                        } else if (networkQualityLevel > 0) {
                                            quality = 'Poor';
                                        }
                                        else if (networkQualityLevel == 0) {
                                            quality = 'Reconnecting';
                                        }

                                        $scope.joinedRoom.users[i].networkQualityLevel = quality;
                                        break;
                                    }
                                }
                            });
                        });


                    });
                };

                //#endregion

                $scope.connectLocalTrack = function (type) {
                    if (type == 'video') {
                        $scope._video.createLocalVideoTrack($scope.videoDevice == null ? {} : {
                            deviceId: { exact: $scope.videoDevice },
                        }).then(function (localVideoTrack) {
                            $scope.twillioRoom.localParticipant.publishTrack(localVideoTrack);
                            $scope.attachTrack($scope.joinedRoom, $scope.userId, localVideoTrack);
                        }, function (err) {
                            if (err.name == 'NotAllowedError') {
                                toastr.clear()
                                toastr.error('We can\'t share your video without permission. You can change this in the address bar.');
                            }
                            else {
                                toastr.clear()
                                toastr.error('Oops, we couldn\'t find your camera');
                            }
                            if (!$scope.videoMuted) {
                                $scope.videoMuted = true;
                            }
                        });
                    } else if (type == 'audio') {
                        $scope._video.createLocalAudioTrack($scope.audioDevice == null ? {} : {
                            deviceId: { exact: $scope.audioDevice }
                        }).then(function (localAudioTrack) {
                            $scope.twillioRoom.localParticipant.publishTrack(localAudioTrack);
                        }, function (err) {
                            if (err.name == 'NotAllowedError') {
                                toastr.clear()
                                toastr.error('We can\'t share your audio without permission. You can change this in the address bar.');
                            }
                            else {
                                toastr.clear()
                                toastr.error('Oops, we couldn\'t find your microphone');
                            }
                            if (!$scope.audioMuted) {
                                $scope.audioMuted = true;
                            }
                        });
                    }
                };

                // #region MUTING

                // Mute video - yes I know I can use reflection but it's half 8 adn I just want to make it work good
                $scope.muteVideoToggle = function () {
                    // Only change if the user is allowed video - always works to mute
                    if ($scope.deviceOptions.videoEnabled || !$scope.videoMuted) {
                        $scope.videoMuted = !$scope.videoMuted;
                        if ($scope.screenMuted) {
                            if ($scope.videoMuted) {
                                $scope.unpublishLocalTracksByKind('video');
                            }
                            else {
                                if ($scope.twillioRoom.localParticipant.videoTracks.size > 0) {
                                    $scope.enableTracksByKind($scope.twillioRoom.localParticipant, 'video');
                                }
                                else {
                                    $scope.connectLocalTrack('video');
                                }
                            }
                        }
                    }
                    else {
                        toastr.clear();
                        toastr.info('You don\'t have access to share video');
                    }
                };

                // Mute audio
                $scope.muteAudioToggle = function () {
                    // Only change if the user is allowed audio - always works to mute
                    if ($scope.deviceOptions.audioEnabled || !$scope.audioMuted) {
                        $scope.audioMuted = !$scope.audioMuted;
                        if ($scope.audioMuted) {
                            $scope.unpublishLocalTracksByKind('audio');
                        }
                        else {
                            if ($scope.twillioRoom.localParticipant.audioTracks.size > 0) {
                                $scope.enableTracksByKind($scope.twillioRoom.localParticipant, 'audio');
                            }
                            else {
                                $scope.connectLocalTrack('audio');
                            }
                        }
                    }
                    else {
                        toastr.clear();
                        toastr.info('You don\'t have access to share audio');
                    }
                };

                // Enable, disable and detach specific track kinds
                $scope.enableTracksByKind = function (participant, kind) {
                    participant.tracks.forEach(function (publication) {
                        if (publication.kind == kind) {
                            publication.track.enable();
                            publication.track.start();
                        }
                    });
                    var userArea = document.getElementById('w_' + $scope.joinedRoom.value + '_' + participant.identity);
                    var userElements = userArea.querySelectorAll(kind);
                    if (userElements != null) {
                        userElements.forEach(function (element) {
                            element.muted = false;
                            element.hidden = false;
                        });
                    }
                };
                $scope.disableTracksByKind = function (participant, kind) {
                    participant.tracks.forEach(function (publication) {
                        if (publication.kind == kind) {
                            publication.track.stop();
                            publication.track.disable();
                        }
                    });
                    var userArea = document.getElementById('w_' + $scope.joinedRoom.value + '_' + participant.identity);
                    var userElements = userArea.querySelectorAll(kind);
                    if (userElements != null) {
                        userElements.forEach(function (element) {
                            element.muted = true;
                            element.hidden = true;
                        });
                    }
                };

                // #endregion MUTING

                // #region PERMISSIONS

                // For altering permissions from tutor command
                $scope.$on('studentPermissionChange', function (event, opt) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.setPermissions(opt);
                        });
                    });
                });

                $rootScope.$on('individualPermissionChangeChat', function (event, chatActive) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.deviceOptions.chatIndividuals = chatActive;
                        });
                    });
                });

                // For setting permissions from a sessionAttendee object
                $scope.setPermissions = function (opt) {

                    // Modify audio permissions
                    if (opt.audioEnabled != $scope.deviceOptions.audioEnabled || opt.groupAudioEnabled != $scope.deviceOptions.groupAudioEnabled) {
                        $scope.deviceOptions.audioEnabled = opt.audioEnabled;
                        $scope.deviceOptions.groupAudioEnabled = opt.groupAudioEnabled;

                        if ((opt.audioEnabled == false && $rootScope.selectedRoom.typeString == 'All') || (opt.groupAudioEnabled == false && $rootScope.selectedRoom.typeString == 'Group')) {
                            // Remove audio if active
                            if ($scope.audioMuted == false) {
                                $scope.muteAudioToggle();
                            }
                        }
                    }


                    // Modify video permissions
                    if (opt.videoEnabled != $scope.deviceOptions.videoEnabled || opt.groupVideoEnabled != $scope.deviceOptions.groupVideoEnabled) {
                        $scope.deviceOptions.videoEnabled = opt.videoEnabled;
                        $scope.deviceOptions.groupVideoEnabled = opt.groupVideoEnabled;

                        if ((opt.videoEnabled == false && $rootScope.selectedRoom.typeString == 'All') || (opt.groupVideoEnabled == false && $rootScope.selectedRoom.typeString == 'Group')) {
                            // Remove video if active
                            if ($scope.videoMuted == false) {
                                $scope.muteVideoToggle();
                            }
                        }
                    }

                    // Modify screen share permissions
                    if (opt.screenShareEnabled != $scope.deviceOptions.screenShareEnabled || opt.groupScreenShareEnabled != $scope.deviceOptions.groupScreenShareEnabled) {
                        $scope.deviceOptions.screenShareEnabled = opt.screenShareEnabled;
                        $scope.deviceOptions.groupScreenShareEnabled = opt.groupScreenShareEnabled;

                        if ((opt.screenShareEnabled == false && $rootScope.selectedRoom.typeString == 'All') || (opt.groupScreenShareEnabled == false && $rootScope.selectedRoom.typeString == 'Group')) {
                            // Remove screenshare if active
                            if ($scope.screenMuted == false) {
                                $scope.toggleScreenShare();
                            }
                        }
                    }

                    // Modify individual call permissions
                    if (opt.callIndividualsEnabled != $scope.deviceOptions.callIndividualsEnabled) {
                        if (opt.callIndividualsEnabled == true) {
                            $scope.deviceOptions.callIndividualsEnabled = true;
                        } else {
                            $scope.deviceOptions.callIndividualsEnabled = false;
                            // Move user out of room if it's an individual call - else show user a different room if it's individual
                            if ($scope.joinedRoom.typeString == 'Individual') {
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].typeString == 'All') {
                                        $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                        $scope.joinRoom($rootScope.selectedRoom);
                                        break;
                                    }
                                }
                            }
                            else if ($rootScope.selectedRoom.typeString == 'Individual') {
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].typeString == 'All') {
                                        $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                        break;
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                            if ($scope.webcamGroupsAll[i].typeString == 'Individual') {
                                $scope.webcamGroupsAll[i].hide = !$scope.deviceOptions.callIndividualsEnabled;
                            }
                        }
                    }
                };

                // #endregion PERMISSIONS

                // #region SCREENSHARE

                $scope.isChrome = function () {
                    return 'chrome' in window && window.navigator.userAgent.indexOf("Edg/") == -1;
                };

                $scope.isEdge = function () {
                    // THIS CHECKS FOR CHROMIUM BASED EDGE RELEASED IN JAN 2020
                    return 'chrome' in window && window.navigator.userAgent.indexOf("Edg/") >= -1;
                };

                $scope.isFirefox = function () {
                    var fireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                    // we need a version check here over 52
                    return fireFox;
                };

                $scope.canScreenShare = function () {
                    return $scope.isChrome() || $scope.isEdge() || $scope.isFirefox();
                };

                $scope.getUserScreen = function () {
                    if (!$scope.canScreenShare()) {
                        toastr.clear();
                        toastr.error('Screenshare is only available in Chrome, Firefox and Edge (Jan 2020 update).');
                        return;
                    }
                    else {
                        return navigator.mediaDevices.getDisplayMedia({
                            video: {
                                mediaSource: 'screen'
                            }
                        });
                    }
                };

                $scope.toggleScreenShare = function () {
                    // Only change if the user is allowed screenshare - always works to mute
                    if ($scope.deviceOptions.screenShareEnabled || !$scope.screenMuted) {
                        $scope.screenMuted = !$scope.screenMuted;



                        let roomVal = ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) ? $scope.joinedRoom.value : undefined;

                        if ($scope.screenMuted) {
                            // Removes any video tracks already attached to html
                            $scope.unpublishLocalTracksByKind('video');
                            // This will re-connect the user's video if allowed and not muted
                            if (!$scope.videoMuted && $scope.deviceOptions.videoEnabled) {
                                $scope.connectLocalTrack('video');
                            }
                            $scope.screenTrack = null;

                            if (roomVal !== undefined) {
                                $rootScope.$broadcast('screenShare', { screenMuted: $scope.screenMuted, room: roomVal });
                                $scope.setSelfSharing($scope.screenMuted)
                            }
                        }
                        else {
                            // Gets screen share pop up in browser
                            $scope.getUserScreen().then(function (stream) {
                                // Gets response from pop up, gets the video track
                                var screenTrack = stream.getVideoTracks()[0];
                                // Setup end process so if ended using browser it carries through to program
                                screenTrack.onended = function () {
                                    // Removes any video tracks already attached to html
                                    $scope.unpublishLocalTracksByKind('video');
                                    // This will connect in either a enabled/diabled state depending on muted
                                    if (!$scope.videoMuted && $scope.deviceOptions.videoEnabled) {
                                        $scope.connectLocalTrack('video');
                                    }
                                    $scope.screenTrack = null;
                                    $scope.screenMuted = true;

                                    if (roomVal !== undefined) {
                                        $rootScope.$broadcast('screenShare', { screenMuted: $scope.screenMuted, room: roomVal });
                                        $scope.setSelfSharing($scope.screenMuted)
                                    }
                                }
                                // Pull a version here so we can trigger on end
                                $scope.screenTrack = screenTrack;
                                // Removes any video tracks already attached to html
                                $scope.unpublishLocalTracksByKind('video');
                                // Publishes tracks to twillio
                                $scope.twillioRoom.localParticipant.publishTrack(screenTrack);
                                // Gets local track associated
                                var newLocalVideoTrack = Twilio.Video.LocalVideoTrack(screenTrack);
                                // Attaches the track locally to html
                                $scope.attachTrack($scope.joinedRoom, $scope.userId, newLocalVideoTrack);

                                if (roomVal !== undefined) {
                                    $rootScope.$broadcast('screenShare', { screenMuted: $scope.screenMuted, room: roomVal });
                                    $scope.setSelfSharing($scope.screenMuted)
                                }
                            }, function (reason) {
                                // If the user hits the cancel button on the pop up to selcect a screen to share
                                if (!$scope.screenMuted) {
                                    $scope.screenMuted = true;

                                    if (roomVal !== undefined) {
                                        $rootScope.$broadcast('screenShare', { screenMuted: $scope.screenMuted, room: roomVal });
                                        $scope.setSelfSharing($scope.screenMuted)
                                    }
                                }
                            });
                        }
                    }
                    else {
                        toastr.clear();
                        toastr.info('You don\'t have access to share your screen');
                    }
                };

                $scope.setSelfSharing = function (value) {
                    let roomVal = ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) ? $scope.joinedRoom.value : undefined;
                    if (roomVal !== undefined) {

                        for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                            if ($scope.joinedRoom.users[i].userId == $scope.userId) {
                                $scope.joinedRoom.users[i].sharingScreen = !value;
                            }
                        }
                    }
                }

                // Recieve info someones sharing screen { screenMuted: screenMuted, roomId: room, userId: userId }
                $scope.$on('receivescreenShared', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {

                            let roomVal = ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) ? $scope.joinedRoom.value : undefined;
                            if (roomVal !== undefined && roomVal == data.roomId) {

                                for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                                    if ($scope.joinedRoom.users[i].userId == data.userId) {
                                        $scope.joinedRoom.users[i].sharingScreen = !data.screenMuted;
                                    }
                                }
                            }

                        });
                    });
                });

                // #endregion SCREENSHARE

                // #region FORCE

                // Tutor's toggle for force mode (announce)
                $scope.toggleForce = function () {
                    if ($scope.userId == $scope.tutorUserId) {
                        $rootScope.forceActive = !$rootScope.forceActive;
                        if ($rootScope.forceActive) {
                            // Inform user if switched on - timeout for style points
                            $timeout(function () {

                                let message = 'You are announcing to the class.';

                                if ($scope.joinedRoom.typeString == 'All') {
                                    message = 'You are announcing to the class.';
                                } else if ($scope.joinedRoom.typeString == 'Group') {
                                    message = `You are announcing to the group ${$scope.joinedRoom.text}.`;
                                } else {
                                    message = `You are announcing to ${$scope.joinedRoom.text}.`;
                                }


                                toastr.clear();
                                toastr.success(message);
                            }, 1000);
                        } else {
                            $scope.backToAll();
                        }

                        let broadcastingTo = null;

                        if ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) {
                            if ($scope.joinedRoom.typeString == 'All') {
                                broadcastingTo = 'All';
                            } else {
                                broadcastingTo = $scope.joinedRoom.identifier;
                            }
                        }

                        let roomVal = ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) ? $scope.joinedRoom.value : undefined;
                        $rootScope.$broadcast('toggleForceMode', { forceMode: $rootScope.forceActive, room: roomVal, broadcastingTo: broadcastingTo });
                    }
                };

                // Recieve force mode for student { forceMode: boolean, roomId: string }
                $scope.$on('receiveToggleForceMode', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // Is this switching on or off
                            if (data.forceMode == true) {
                                $rootScope.forceActive = true;
                                // If on lets switch to the relavent room
                                //if ($scope.joinedRoom.value != data.roomId) {
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].value == data.roomId) {
                                        $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                        $scope.joinRoom($rootScope.selectedRoom);
                                    }
                                }
                                //}

                                let message = 'Your Tutor is presenting to you, please pay attention';

                                if ($rootScope.selectedRoom.typeString == 'All') {
                                    message = 'Your Tutor is presenting to the class, please pay attention';
                                } else if ($rootScope.selectedRoom.typeString == 'Group') {
                                    message = 'Your Tutor is presenting to your group, please pay attention';
                                } else {
                                    message = 'Your Tutor is presenting to you, please pay attention';
                                }


                                toastr.clear();
                                toastr.success(message);
                            }
                            else {
                                $rootScope.forceActive = false;
                                $scope.backToAll();
                            }
                        });
                    });
                });

                // Force for tutor originating from tutor command
                $scope.$on('tutorCommandForceUser', function (event, opt) {
                    $scope.forceFromTutorCommand(null, opt.userId, "Individual");
                });

                $scope.$on('tutorCommandForceGroup', function (event, opt) {
                    $scope.forceFromTutorCommand(null, opt.groupId, "Group");
                });

                $scope.$on('tutorCommandForceAll', function (event) {
                    $scope.forceFromTutorCommand($scope.classSessionId, null, "All");
                });

                // Logic for forcing from tutorCommand
                $scope.forceFromTutorCommand = function (roomId, identifier, roomType) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // If force mode is active already, deactivate it


                            if ($rootScope.forceActive) {
                                $scope.toggleForce();
                            }
                            else {
                                // If not in the forced room, join it
                                if ($scope.joinedRoom === undefined || $scope.joinedRoom == null || (roomId !== undefined && roomId != null && $scope.joinedRoom.value != roomId) || (identifier !== undefined && identifier != null && $scope.joinedRoom.identifier != identifier)) {
                                    for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                        if ($scope.webcamGroupsAll[i].type == roomType && (roomId !== undefined && roomId != null && $scope.webcamGroupsAll[i].value == roomId) || (identifier !== undefined && identifier != null && $scope.webcamGroupsAll[i].identifier == identifier)) {

                                            $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                            $scope.joinRoom($rootScope.selectedRoom);
                                            $scope.toggleForce();
                                            break;
                                        }
                                    }
                                } else if ($scope.joinedRoom !== undefined && $scope.joinedRoom != null && ($scope.joinedRoom.value == roomId) || ($scope.joinedRoom.identifier == identifier)) {
                                    $scope.toggleForce();
                                }
                            }


                        });
                    });
                };

                // #endregion FORCE

                // #region CALLS

                $scope.$on('receiveCall', function (event, data, incomingUserId) {
                    ModalService.showModal({
                        templateUrl: '/app/classroom/webcamCallIncomingModal.html',
                        controller: 'WebcamCallIncomingModalController',
                        inputs: {
                            incomingUserId: incomingUserId,
                            roomId: data
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result == true) {
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].typeString == "Individual") {
                                        if ($scope.webcamGroupsAll[i].identifier == incomingUserId) {
                                            if ($scope.webcamGroupsAll[i].helpRequested) {
                                                $rootScope.$broadcast('helpDelivered', incomingUserId);
                                            }
                                            $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                            $scope.joinRoom($rootScope.selectedRoom);
                                            break;
                                        }
                                        continue;
                                    }
                                }
                            }
                            else {
                                $rootScope.$broadcast('callDeclinedBy', { roomId: data, userThatMadeCallId: incomingUserId });
                            }
                        });
                    });
                });

                $scope.$on('callDeclined', function (event, userId, userThatMadeCallId) {
                    if ($scope.userId == userThatMadeCallId) {
                        $scope.backToAll();
                    }
                    //for (var i = 0; i < $scope.joinedRoom.users.length; i++) {
                    //    if ($scope.joinedRoom.users[i].userId == userId) {
                    //        $scope.backToAll();
                    //        toastr.clear();
                    //        toastr.info($scope.joinedRoom.users[i].firstName + ' ' + $scope.joinedRoom.users[i].lastName + ' declined the call');
                    //        break;
                    //    }
                    //}
                });

                $scope.$on('startCall', function (event, opt) {
                    if (opt.roomId != $scope.joinedRoom.value) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                    if ($scope.webcamGroupsAll[i].value == opt.roomId) {
                                        $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                        $scope.joinRoom($rootScope.selectedRoom);
                                        break;
                                    }
                                }
                            });
                        });
                    }
                });

                // #endregion CALLS

                // #region GROUPS

                // A new group has been created (TUTOR ONLY)
                $scope.$on('newGroupWebcam', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.webcamGroupsAll.push(data);
                        });
                    });
                });

                //Tutor has deleted a group need to remove from thier list
                $scope.$on('removeGroup', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {

                            if ($scope.joinedRoom != null) {
                                if ($scope.joinedRoom.typeString == 'Group' && $scope.joinedRoom.identifier == data) {
                                    for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                        if ($scope.webcamGroupsAll[i].typeString == "All") {
                                            $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                            $scope.joinRoom($rootScope.selectedRoom);
                                            break;
                                        }
                                    }
                                }
                            }

                            for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                if ($scope.webcamGroupsAll[i].typeString == 'Group' && $scope.webcamGroupsAll[i].identifier == data) {
                                    $scope.webcamGroupsAll.splice(i, 1);
                                    break;
                                }
                            }
                        });
                    });
                });

                // Users have been removed from this user's current group
                $scope.$on('groupAlteredRemove', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {

                            for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                if ($scope.webcamGroupsAll[i].typeString == 'Group') {
                                    for (var k = 0; k < data.users.length; k++) {
                                        // Loop backwards as we'll be removing
                                        for (var x = $scope.webcamGroupsAll[i].users.length - 1; x >= 0; x--) {
                                            if ($scope.webcamGroupsAll[i].users[x].userId == data.users[k].userId) {
                                                $scope.webcamGroupsAll[i].users.splice(x, 1);
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }

                        });
                    });
                });

                // Users have been added to this user's current group
                $scope.$on('groupAlteredAdd', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                if ($scope.webcamGroupsAll[i].typeString == 'Group' && data.identifier == $scope.webcamGroupsAll[i].identifier) {
                                    for (var k = 0; k < data.users.length; k++) {
                                        $scope.webcamGroupsAll[i].users.push(data.users[k]);
                                    }
                                    break;
                                }
                            }

                        });
                    });
                });

                // For when a student THEMSELF was removed from a group
                $scope.$on('groupRemoved', function (event) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // If the student is currently in that chatroom - If so, move them to the all chatroom
                            if ($scope.joinedRoom != null) {
                                if ($scope.joinedRoom.typeString == 'Group') {
                                    for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                        if ($scope.webcamGroupsAll[i].typeString == "All") {
                                            $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                            $scope.joinRoom($rootScope.selectedRoom);
                                            break;
                                        }
                                    }
                                }
                                // Else if the student is just currently looking at this room, show them the room they are currently in
                                else if ($rootScope.selectedRoom.typeString == 'Group') {
                                    $rootScope.selectedRoom = $scope.joinedRoom;
                                }
                            }

                            // Then remove the group chatroom as an option
                            for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                if ($scope.webcamGroupsAll[i].typeString == 'Group') {
                                    $scope.webcamGroupsAll.splice(i, 1);
                                    break;
                                }
                            }
                        });
                    });
                });

                // For when another student has been removed from a group
                $scope.$on('groupUsersRemoved', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {

                            // Fidn the correct room and remove the appropriate users
                            for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                if ($scope.webcamGroupsAll[i].typeString == 'Group' && $scope.webcamGroupsAll[i].identifier == data.groupId) {
                                    for (var k = 0; k < data.userIds.length; k++) {
                                        // Loop backwards as we'll be removing
                                        for (var x = $scope.webcamGroupsAll[i].users.length - 1; x >= 0; x--) {
                                            if ($scope.webcamGroupsAll[i].users[x].userId == data.userIds[k]) {
                                                $scope.webcamGroupsAll[i].users.splice(x, 1);
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }

                        });
                    });
                });

                // For when a student THEMSELF is moved to a new group
                $scope.$on('groupMovedWebcam', function (event, webcamRoom) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // If the student is currently in that chatroom - If so, move them to the all chatroom
                            if ($scope.joinedRoom != null) {
                                if ($scope.joinedRoom.typeString == 'Group') {
                                    for (var i = 0; i < $scope.webcamGroupsAll.length; i++) {
                                        if ($scope.webcamGroupsAll[i].typeString == "All") {
                                            $rootScope.selectedRoom = $scope.webcamGroupsAll[i];
                                            $scope.joinRoom($rootScope.selectedRoom);
                                            break;
                                        }
                                    }
                                }
                                // Else if the student is just currently looking at this room, show them the room they are currently in
                                else if ($rootScope.selectedRoom.typeString == 'Group') {
                                    $rootScope.selectedRoom = $scope.joinedRoom;
                                }
                            }

                            // Then add the group chatroom as an option - If there is already one - Replace this
                            for (var z = 0; z < webcamRoom.users.length; z++) {
                                if (webcamRoom.users[z].userId != $scope.tutorUserId && webcamRoom.users[z].position == 0) {
                                    webcamRoom.users[z].position = 1;
                                }
                            }
                            $scope.webcamGroupsAll.push(webcamRoom);

                        });
                    });
                });

                // #endregion GROUPS


                //#region ML ordering system

                $scope.resetOrder = function () {
                    if ($scope.joinedRoom !== undefined && $scope.joinedRoom != null) {
                        $.each($scope.joinedRoom.users, function (index, user) {
                            user.position = user.originalPosition;
                        });
                    }
                };

                $scope.moveToFront = function (userId, currentPosition) {
                    for (var i = 0; i < currentPosition; i++) {
                        $scope.joinedRoom.users[i].position++;
                    }

                    for (var i = currentPosition + 1; i < $scope.joinedRoom.users.length; i++) {
                        $scope.joinedRoom.users[i].position--;
                    }

                    $.each($scope.joinedRoom.users, function (index, user) {
                        if (user.userId == userId) {
                            user.position = 0;
                        }
                    });
                }

                //#endregion

                $scope.init();
            }
        ]);
})();