(function () {
    angular.module('standingOut.controllers').controller('ClassroomWebcamController',
        ['$scope', '$rootScope', '$timeout', 'ModalService', 'DeleteService', 'ClassroomSessionsService', 'ClassSessionVideoRoomsService', 'SessionAttendeesService',
            function ($scope, $rootScope, $timeout, ModalService, DeleteService, ClassroomSessionsService, ClassSessionVideoRoomsService, SessionAttendeesService) {
                $scope.classSessionId = classSessionId;
                $scope.sessionAttendeeId = sessionAttendeeId;
                $scope.sessionAttendee = undefined;
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.isOpen = false;
                $scope.sessionInProgress = false;
                $scope.tutorSetForceMode = false;
                $scope.forceMode = false;
                $scope.callStartedOnForceAudio = false;
                $scope.callStartedOnForceVideo = false;
                $scope.callMade = false;
                $scope._Video = Twilio.Video;
                $scope.roomToJoin = undefined;
                $scope.dominantSpeaker = null;
                $scope.videoLockUserId = null;
                $scope.videoLock = false;
                $scope.activeRoom = undefined;
                $scope.previewTracks = null;
                $scope.previewActive = false;
                $scope.screenTrack = undefined;
                $scope.identity = undefined;
                $scope.token = undefined;
                $scope.deviceOptions = { videodevice: undefined, audiodevice: undefined, popupEnabled: true, roomJoinEnabled: true, showaudio: true, showvideo: true, screenShareEnabled: true, callIndividuals: false, localaudiomuted: false, localvideomuted: false, audioVolume: 1, screenShareMode: false, paneMode: false, paneNumber: undefined };
                $scope.videodeviceOptions = [];
                $scope.audiodeviceOptions = [];
                $scope.paneNumberOptions = [{ value: 0, text: '1' }];
                $scope.externalParticipants = [];
                $scope.audioAnalyzers = [];
                $scope.awaitingUsers = [];

                // Hide and Show webcam controls in Webcam Pane mode
                $scope.showWebcamControls = function () {
                    const hideButton = document.querySelector('.Controls__Hide');
                    const controls = document.querySelector('#room-controls-inner');
                    const paneSettings = document.querySelector('.pane-settings');

                    if (!controls.classList.contains('hidden')) {
                        controls.classList.add("hidden");
                        hideButton.classList.add("hidden");
                        paneSettings.classList.add("hidden");

                    } else {
                        controls.classList.remove("hidden");
                        hideButton.classList.remove("hidden");
                        paneSettings.classList.remove("hidden");
                    }
                };

                $scope.getPreviewContainer = function () {
                    return document.getElementById('local-media');
                };

                $scope.getRemoteContainer = function () {
                    return document.getElementById('remote-media');
                };

                $scope.getPaneContainer = function () {
                    return document.getElementsByClassName('webcam-pane')[$scope.deviceOptions.paneNumber];
                };

                $scope.getPaneSettingsContainer = function () {
                    return document.getElementsByClassName('pane-settings')[0];
                };

                $scope.getRoomControlsContainer = function () {
                    return document.getElementById('room-controls');
                };

                $rootScope.$on('joinGroupCallFromChat', function (event, data) {
                    if (!$scope.isTutor) {
                        if ($scope.deviceOptions.popupEnabled) {
                            $scope.joinRoomFromChat(data.groupId);
                        }
                        else {
                            toastr.clear();
                            toastr.error('Video is not been enabled');
                        }
                    }
                    else {
                        $scope.joinRoomFromChat(data.groupId);
                    }
                });

                $scope.joinRoomFromChat = function (groupId) {
                    if (groupId == undefined) {
                        for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                            if ($scope.groupsToJoin[i].permissionType == 'All') {
                                $scope.roomToJoin = $scope.groupsToJoin[i];
                                document.getElementById('button-join').click();
                                break;
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < $scope.groupsToJoin.length; j++) {
                            if ($scope.groupsToJoin[j].value.endsWith(groupId)) {
                                $scope.roomToJoin = $scope.groupsToJoin[j];
                                document.getElementById('button-join').click();
                                break;
                            }
                        }
                    }
                };

                $scope.forceModeJoin = function () {
                    $scope.joinLogic(false);
                    $scope.toggleForceMode();
                };

                $scope.joinLogic = function (wasForced) {

                    if ($scope.roomToJoin == null || $scope.roomToJoin === undefined) {
                        alert('Please select a group.');
                        return;
                    }

                    $scope.sessionInProgress = true;
                    var connectOptions = {
                        name: $scope.roomToJoin.value,
                        //logLevel: 'debug'
                        logLevel: 'off',
                        dominantSpeaker: true,
                        video: false,//wasForced || $scope.deviceOptions.showvideo == false ? false : { deviceId: $scope.deviceOptions.videodevice },
                        audio: wasForced || $scope.deviceOptions.showaudio == false ? false : { deviceId: $scope.deviceOptions.audiodevice },
                    };

                    // HAVE WEBCAM OFF BY DEFAULT
                    $scope.callStartedOnForceVideo = true;
                    $scope.deviceOptions.localvideomuted = true;
                    // END HAVE WEBCAM OFF BY DEFAULT

                    if ($scope.previewActive) {
                        $scope.preview();
                    }

                    if ($scope.previewTracks) {
                        connectOptions.tracks = $scope.previewTracks;
                    } else if ($scope.deviceOptions.screenShareMode == true) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.deviceOptions.screenShareMode = false;
                                $scope.getPreviewContainer().innerHTML = '';
                                $scope.screenTrack = null;
                            });
                        });
                    }

                    $scope._Video.connect($scope.token, connectOptions).then(function (success) {
                        //No clear here as chance of 2 messages required
                        //toastr.clear();
                        toastr.info('Your webcam and microphone are being recorded for safeguarding purposes');
                        ClassSessionVideoRoomsService.save({}, { classSessionId: $scope.classSessionId, roomSid: success.sid, participantSid: success.localParticipant.sid }, function (videoroom) {
                            $scope.roomJoined(success);
                        }, function (error) {
                        });
                    }, function (error) {
                        alert('An error has occured. Please refresh your browser');
                    });
                };

                $scope.init = function () {
                    $scope.sessionInProgress = false;

                    ClassroomSessionsService.getAvailableGroups({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.groupsToJoin = success;
                        $scope.roomToJoin = $scope.groupsToJoin[0];
                        if ($scope.sessionAttendeeId != null && $scope.sessionAttendeeId !== undefined && $scope.sessionAttendeeId != '') {
                            SessionAttendeesService.my({ classSessionId: $scope.classSessionId }, function (success) {
                                $scope.sessionAttendee = success;
                                $scope.setPermissions();
                            }, function (error) {
                            });
                        }
                    }, function (error) {
                    });

                    ClassroomSessionsService.getTwilioKey({}, function (success) {
                        $scope.identity = success.identity;
                        $scope.token = success.token;
                        //document.getElementById('room-controls-inner').style.display = 'inline-flex';

                    }, function (err) {
                    });

                    $scope.setMediaDevices();
                };

                //$scope.detachMediaDevices = function () {
                //    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                //        .then(function (stream) {
                //            console.log(stream.getTracks());
                //            stream.getTracks().forEach((track) => track.stop());
                //        });
                //};

                //$scope.attachMediaDevices = function () {
                //    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                //        .then(function (stream) {
                //            $scope.setMediaDevices();
                //        })
                //        .catch(function (err) {
                //            console.log('mic not accepted');
                //        });
                //};

                $scope.setMediaDevices = function () {
                    navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
                        mediaDevices.forEach(function (mediaDevice) {
                            if (mediaDevice.kind === 'videoinput') {
                                var vlabel = mediaDevice.label || 'Camera';
                                $scope.videodeviceOptions.push({ value: mediaDevice.deviceId, label: vlabel });
                            } else if (mediaDevice.kind === 'audioinput') {
                                var alabel = mediaDevice.label || 'Audio';
                                $scope.audiodeviceOptions.push({ value: mediaDevice.deviceId, label: alabel });
                            }
                        });
                        $scope.deviceOptions.videodevice = $scope.videodeviceOptions[0].value;
                        $scope.deviceOptions.audiodevice = $scope.audiodeviceOptions[0].value;
                        angular.element('#videodevices').focus();
                        angular.element('#audiodevices').focus();
                    }, function (error) {
                    });
                };

                $scope.toggle = function () {
                    if ($rootScope.sessionEnded) {
                        toastr.clear();
                        toastr.error('Camera and Microphone are not available to use out of class');
                    }
                    else if ($rootScope.checkSessionStart()) {
                        if (!$scope.deviceOptions.paneMode) {
                            if ($scope.deviceOptions.popupEnabled == false) {
                                $scope.isOpen = false;
                            } else {
                                $scope.isOpen = !$scope.isOpen;
                            }
                        }
                    }
                };

                $scope.setupMediaTrackDiv = function (identity) {
                    var node = document.createElement("Div");
                    var textnode = document.createTextNode(identity);
                    node.appendChild(textnode);

                    return node;
                };

                $scope.roomJoined = function (room) {
                    window.room = $scope.activeRoom = room;

                    $scope.sessionInProgress = true;

                    if ($scope.previewTracks == null) {
                        $scope.attachParticipantTracks(room.localParticipant, $scope.getPreviewContainer());
                    }

                    if ($scope.isTutor && $scope.roomToJoin.helpRequested == true && room.participants.size > 0) {
                        $rootScope.$broadcast('helpDelivered', $scope.roomToJoin.userId);
                    }

                    room.participants.forEach(function (participant) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.awaitingUsers.length > 0) {
                                    for (var i = 0; i < $scope.awaitingUsers.length; i++) {
                                        if ($scope.awaitingUsers[i].userId == participant.identity) {
                                            $scope.awaitingUsers.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                $scope.externalParticipants.push({ userId: participant.identity });
                                $scope.embelishUser(participant.identity);
                            });
                        });

                        participant.tracks.forEach(function (publication) {
                            if (publication.isSubscribed) {
                                setTimeout(function () {
                                    var track = publication.track;
                                    var attachedTrack = track.attach();
                                    attachedTrack.id = track.name;
                                    document.getElementById(participant.identity + '_media').appendChild(attachedTrack);
                                    if (track.kind == 'video') {
                                        $scope.externalParticipants.forEach(function (attendee) {
                                            if (attendee.userId == participant.identity) {
                                                attendee.videoActive = true;
                                            }
                                        });
                                    }
                                    $scope.setVolume();
                                }, 200);
                            }
                        });

                        participant.on('trackSubscribed', function (track) {
                            var attachedTrack = track.attach();
                            attachedTrack.id = track.name;
                            document.getElementById(participant.identity + '_media').appendChild(attachedTrack);
                            if (track.kind == 'video') {
                                $scope.externalParticipants.forEach(function (attendee) {
                                    if (attendee.userId == participant.identity) {
                                        attendee.videoActive = true;
                                    }
                                });
                            }
                            $scope.setVolume();
                        });
                    });

                    if (room.participants.length > 0) {
                        $scope.dominantSpeaker = room.participants[0].identity;
                    }

                    room.on('participantConnected', function (participant) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.isTutor && $scope.roomToJoin.helpRequested == true) {
                                    $rootScope.$broadcast('helpDelivered', $scope.roomToJoin.userId);
                                }

                                if ($scope.awaitingUsers.length > 0) {
                                    for (var i = 0; i < $scope.awaitingUsers.length; i++) {
                                        if ($scope.awaitingUsers[i].userId == participant.identity) {
                                            $scope.awaitingUsers.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                $scope.externalParticipants.push({ userId: participant.identity });
                                $scope.embelishUser(participant.identity);
                            });
                        });

                        participant.tracks.forEach(function (publication) {
                            if (publication.isSubscribed) {
                                var track = publication.track;
                                var attachedTrack = track.attach();
                                attachedTrack.id = track.name;
                                document.getElementById(participant.identity + '_media').appendChild(attachedTrack);
                                if (track.kind == 'video') {
                                    $scope.externalParticipants.forEach(function (attendee) {
                                        if (attendee.userId == participant.identity) {
                                            attendee.videoActive = true;
                                        }
                                    });
                                }
                                $scope.setVolume();
                            }
                        });

                        participant.on('trackSubscribed', function (track) {
                            var attachedTrack = track.attach();
                            attachedTrack.id = track.name;
                            document.getElementById(participant.identity + '_media').appendChild(attachedTrack);
                            if (track.kind == 'video') {
                                $scope.externalParticipants.forEach(function (attendee) {
                                    if (attendee.userId == participant.identity) {
                                        attendee.videoActive = true;
                                    }
                                });
                            }
                            $scope.setVolume();
                        });

                        if (room.participants.length == 1) {
                            $scope.dominantSpeaker = room.participants[0].identity;
                        }
                    });

                    room.on('trackUnsubscribed', function (track) {
                        track.detach().forEach(function (detachedElement) {
                            if (track.kind == 'video') {
                                if (detachedElement.parentElement != null) {
                                    var userId = detachedElement.parentElement.id.split('_')[0];
                                    $scope.externalParticipants.forEach(function (attendee) {
                                        if (attendee.userId == userId) {
                                            attendee.videoActive = false;
                                        }
                                    });
                                }
                            }
                            detachedElement.remove();
                        });

                    });

                    room.on('trackDisabled', function (track) {
                        if (track.track != null) {
                            var element = document.getElementById(track.trackName);
                            if (track.kind == 'video') {
                                if (element != undefined) {
                                    var userId = element.parentElement.id.split('_')[0];
                                    $scope.externalParticipants.forEach(function (attendee) {
                                        if (attendee.userId == userId) {
                                            attendee.videoActive = false;
                                        }
                                    });
                                    element.remove();
                                }
                            }
                            else {
                                element.muted = true;
                                element.hidden = true;
                            }
                        }
                    });

                    room.on('trackEnabled', function (track) {
                        if (track.track != null) {
                            var element = document.getElementById(track.trackName);
                            if (track.kind == 'video') {
                                var userId = element.parentElement.id.split('_')[0];
                                $scope.externalParticipants.forEach(function (attendee) {
                                    if (attendee.userId == userId) {
                                        attendee.videoActive = true;
                                    }
                                });
                            }
                            element.muted = false;
                            element.hidden = false;
                        }
                    });

                    room.on('participantDisconnected', function (participant) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                for (var i = 0; i < $scope.externalParticipants.length; i++) {
                                    if ($scope.externalParticipants[i].userId == participant.identity) {
                                        if ($scope.videoLock == true && $scope.videoLockUserId == $scope.externalParticipants[index].userId) {
                                            $scope.videoLock = false;
                                            $scope.videoLockUserId = null;
                                        }

                                        if ($scope.forceMode && $scope.externalParticipants[i].isTutor) {
                                            $scope.forceMode = false;
                                        }

                                        $scope.externalParticipants.splice(i, 1);
                                    }
                                }
                            });
                        });
                    });

                    room.on('disconnected', function () {
                        if ($scope.previewTracks) {
                            $scope.previewTracks.forEach(function (track) {
                                track.stop();
                            });
                            $scope.previewTracks = null;
                        }
                        $scope.detachParticipantTracks(room.localParticipant);
                        room.participants.forEach($scope.detachParticipantTracks);
                        $scope.awaitingUsers = [];
                        $scope.activeRoom = null;
                        $scope.getPreviewContainer().innerHTML = '';
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.externalParticipants = [];
                            });
                        });
                        $scope.sessionInProgress = false;
                        $scope.callStartedOnForceAudio = false;
                        $scope.callStartedOnForceVideo = false;
                    });

                    room.on('dominantSpeakerChanged', function (participant) {
                        if (participant != null) {
                            $scope.dominantSpeaker = participant.identity;
                        }
                    });
                };

                $scope.lockVideo = function (index) {
                    if ($scope.videoLock == true) {
                        // If lock is on - Could be unlocking or changing
                        if (index == undefined) {
                            if ($scope.videoLockUserId == null) {
                                $scope.videoLock = false;
                            }
                            else {
                                $scope.videoLockUserId = null;
                            }
                        }
                        else {
                            if ($scope.externalParticipants[index].userId == $scope.videoLockUserId) {
                                $scope.videoLock = false;
                            }
                            else {
                                $scope.videoLockUserId = $scope.externalParticipants[index].userId;
                            }
                        }
                    }
                    else {
                        // If lock is off - Can only be locking
                        if (index == undefined) {
                            $scope.videoLockUserId = null;
                        }
                        else {
                            $scope.videoLockUserId = $scope.externalParticipants[index].userId;
                        }
                        $scope.videoLock = true;
                    }
                };

                $scope.showVideoFullscreen = function (id) {
                    var videoElements = document.getElementById(id).getElementsByTagName('video');
                    if (videoElements.length == 0) {
                        return false;
                    }
                    else {
                        for (var i = 0; i < videoElements.length; i++) {
                            if (!videoElements[i].hasAttribute('hidden')) {
                                return true;
                            }
                        }
                        return false;
                    }
                };

                $scope.fullscreenVideo = function (id) {
                    var videoElement;
                    if (id == undefined) {
                        videoElement = document.getElementById('local-media').getElementsByTagName('video')[0];
                    }
                    else {
                        videoElement = document.getElementById(id).getElementsByTagName('video')[0];
                    }
                    if (videoElement.requestFullscreen) {
                        videoElement.requestFullscreen();
                    } else if (videoElement.mozRequestFullScreen) {
                        videoElement.mozRequestFullScreen();
                    } else if (videoElement.webkitRequestFullscreen) {
                        videoElement.webkitRequestFullscreen();
                    }
                };

                $scope.preview = function () {
                    if ($scope.previewTracks != null) {
                        $scope.previewActive = false;
                        for (var i = 0; i < $scope.previewTracks.length; i++) {
                            $scope.previewTracks[i].stop();
                        }
                        $scope.detachTracks($scope.previewTracks);
                        $scope.previewTracks = null;
                        toastr.clear();
                        toastr.success('You have stopped previewing your webcam');
                    } else {
                        $scope.previewActive = true;
                        var localTracksPromise = $scope.previewTracks ?
                            Promise.resolve($scope.previewTracks) :
                            $scope._Video.createLocalTracks({ audio: { deviceId: $scope.deviceOptions.audiodevice }, video: { deviceId: $scope.deviceOptions.videodevice } });

                        localTracksPromise.then(function (tracks) {

                            $timeout(function () {
                                $scope.$apply(function () {
                                    window.previewTracks = $scope.previewTracks = tracks;
                                });
                            });
                            toastr.clear();
                            toastr.success('You are now previewing your webcam');
                            if ($scope.getPreviewContainer().querySelector('video')) {
                                var childVideo = $scope.getPreviewContainer().getElementsByTagName('video');
                                $scope.getPreviewContainer().removeChild(childVideo[0]);
                            }
                            if ($scope.sessionInProgress) {
                                // Results in track being re-attached when video un-muted
                                $scope.callStartedOnForceVideo = true;
                            }
                            //if (!$scope.getPreviewContainer().querySelector('video')) {
                            var i = 1;
                            tracks.forEach(function (track) {
                                $scope.getPreviewContainer().appendChild(track.attach());
                            });
                            //}
                        }, function (error) {
                            $scope.log('Unable to access Camera and Microphone');
                        });
                    }
                };

                $scope.leaveRoomIfJoined = function () {
                    if ($scope.activeRoom) {
                        $scope.activeRoom.disconnect();
                    }
                };

                $scope.updateVideoDevice = function () {
                    if ($scope.sessionInProgress == true) {
                        $scope.disconnectTracks('video');
                        $scope.connectTracks('video');
                    } else if ($scope.getPreviewContainer().querySelector('video')) { // for preiew. CB need to split out
                        $scope._Video.createLocalVideoTrack({
                            deviceId: { exact: $scope.deviceOptions.videodevice }
                        }).then(function (localVideoTrack) {
                            for (var i = 0; i < $scope.previewTracks.length; i++) {
                                if ($scope.previewTracks[i].kind == 'video') {
                                    $scope.detachTracks([$scope.previewTracks[i]]);
                                    $scope.attachTracks([localVideoTrack], $scope.getPreviewContainer());
                                    $scope.previewTracks[i] = localVideoTrack;
                                }
                            }
                        });
                    }
                };

                $scope.updateAudioDevice = function () {
                    if ($scope.sessionInProgress == true) {
                        $scope.disconnectTracks('audio');
                        $scope.connectTracks('audio');
                    } else if ($scope.getPreviewContainer().querySelector('audio')) { // for preiew. CB need to split out
                        $scope._Video.createLocalAudioTrack({
                            deviceId: { exact: $scope.deviceOptions.audiodevice }
                        }).then(function (localAudioTrack) {
                            for (var i = 0; i < $scope.previewTracks.length; i++) {
                                if ($scope.previewTracks[i].kind == 'audio') {
                                    $scope.detachTracks([$scope.previewTracks[i]]);
                                    $scope.attachTracks([localAudioTrack], $scope.getPreviewContainer());
                                    $scope.previewTracks[i] = localAudioTrack;
                                }
                            }
                        });
                    }
                };

                $scope.setPermissions = function () {
                    if ($scope.sessionAttendee) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.sessionAttendee.roomJoinEnabled == false && $scope.sessionAttendee.groupRoomJoinEnabled == false) {
                                    $scope.deviceOptions.popupEnabled = false;
                                } else {
                                    $scope.deviceOptions.popupEnabled = true;
                                }
                                if ($scope.roomToJoin == null || $scope.roomToJoin === undefined) {
                                    $scope.deviceOptions.showaudio = true;
                                    $scope.deviceOptions.showvideo = true;
                                    $scope.deviceOptions.roomJoinEnabled = true;
                                } else {
                                    if (($scope.sessionAttendee.roomJoinEnabled == true && $scope.roomToJoin.permissionType == 'All') || ($scope.sessionAttendee.groupRoomJoinEnabled == true && $scope.roomToJoin.permissionType == 'Group')) {
                                        $scope.deviceOptions.roomJoinEnabled = true;
                                    } else {
                                        $scope.deviceOptions.roomJoinEnabled = false;
                                    }
                                    if (($scope.sessionAttendee.audioEnabled == true && $scope.roomToJoin.permissionType == 'All') || ($scope.sessionAttendee.groupAudioEnabled == true && $scope.roomToJoin.permissionType == 'Group')) {
                                        $scope.deviceOptions.showaudio = true;
                                    } else {
                                        $scope.deviceOptions.showaudio = false;
                                    }
                                    if (($scope.sessionAttendee.videoEnabled == true && $scope.roomToJoin.permissionType == 'All') || ($scope.sessionAttendee.groupVideoEnabled == true && $scope.roomToJoin.permissionType == 'Group')) {
                                        $scope.deviceOptions.showvideo = true;
                                    } else {
                                        $scope.deviceOptions.showvideo = false;
                                    }
                                    if (($scope.sessionAttendee.screenShareEnabled == true && $scope.roomToJoin.permissionType == 'All') || ($scope.sessionAttendee.groupScreenShareEnabled == true && $scope.roomToJoin.permissionType == 'Group')) {
                                        $scope.deviceOptions.screenShareEnabled = true;
                                    } else {
                                        $scope.deviceOptions.screenShareEnabled = false;
                                    }
                                }
                                if ($scope.sessionAttendee.callIndividualsEnabled == true) {
                                    $scope.deviceOptions.callIndividuals = true;
                                } else {
                                    $scope.deviceOptions.callIndividuals = false;
                                }
                            });
                        });
                    }
                };

                $scope.$on('studentPermissionChange', function (event, opt) {
                    var oldPermissions = angular.copy($scope.deviceOptions);
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.sessionAttendee = opt;
                        });
                    });

                    $scope.setPermissions();

                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.sessionInProgress == true) {
                                // room join
                                if ($scope.deviceOptions.roomJoinEnabled != oldPermissions.roomJoinEnabled) {
                                    if ($scope.deviceOptions.roomJoinEnabled == false) { // roomJoin switched to off
                                        $scope.leaveRoom();
                                    }
                                }
                                // audio
                                if ($scope.deviceOptions.showaudio != oldPermissions.showaudio) {
                                    if ($scope.deviceOptions.showaudio == false) { // audio switched to off

                                        $scope.disconnectTracks('audio');
                                    } else if ($scope.deviceOptions.showaudio == true) { // audio switched to on
                                        if (!$scope.callStartedOnForceAudio) {
                                            $scope.callStartedOnForceAudio = true;
                                            $scope.deviceOptions.localaudiomuted = true;
                                        }
                                    }
                                }
                                // video
                                if ($scope.deviceOptions.showvideo != oldPermissions.showvideo) {
                                    if ($scope.deviceOptions.showvideo == false) { // video switched to off
                                        $scope.disconnectTracks('video');
                                    } else if ($scope.deviceOptions.showvideo == true) { // video switched to on
                                        if (!$scope.callStartedOnForceVideo) {
                                            $scope.callStartedOnForceVideo = true;
                                            $scope.deviceOptions.localvideomuted = true;
                                        }
                                    }
                                }
                                // screenshare
                                if ($scope.deviceOptions.screenShareEnabled != oldPermissions.screenShareEnabled) {
                                    if ($scope.deviceOptions.screenShareEnabled == false) { // video switched to off
                                        if ($scope.deviceOptions.screenShareMode == true) {
                                            $scope.stopShareScreen();
                                        }
                                    } else if ($scope.deviceOptions.screenShareEnabled == true) { // video switched to on
                                        // don't do anything wait for button
                                    }
                                }
                            }

                            if ($scope.deviceOptions.popupEnabled == false) {
                                $scope.isOpen = false;
                            }

                            // call individuals
                            if ($scope.deviceOptions.callIndividuals != oldPermissions.callIndividuals) { //call individuals changed
                                ClassroomSessionsService.getAvailableGroups({ classSessionId: $scope.classSessionId }, function (success) {
                                    $scope.groupsToJoin = success;
                                    var roomToJoin = $scope.roomToJoin;
                                    $scope.roomToJoin = null;
                                    for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                                        if (roomToJoin.value == $scope.groupsToJoin[i].value) {
                                            $scope.roomToJoin = $scope.groupsToJoin[i];
                                        }
                                    }
                                    if ($scope.roomToJoin == null) {
                                        if ($scope.sessionInProgress) {
                                            $scope.leaveRoom();
                                        }
                                        $scope.roomToJoin = $scope.groupsToJoin[0];
                                    }
                                }, function (error) {
                                });
                            }

                        });
                    });
                });

                $scope.genericMute = function (type) {
                    var mutedVariable = eval('$scope.deviceOptions.local' + type + 'muted');

                    if ($scope.sessionInProgress == true && $scope.activeRoom != null) {
                        if (type == 'audio') {
                            if (mutedVariable == true) {
                                if ($scope.callStartedOnForceAudio == true) {
                                    $scope.connectTracks('audio');
                                    $scope.callStartedOnForceAudio = false;
                                }
                                else {
                                    $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                                        if (track.kind == type) {
                                            track.track.enable();
                                        }
                                    });
                                }
                            }
                            else {
                                $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                                    if (track.kind == type) {
                                        track.track.disable();
                                    }
                                });
                            }
                            $scope.deviceOptions.localaudiomuted = !$scope.deviceOptions.localaudiomuted;
                        } else if (type == 'video') {
                            if (mutedVariable == true) {
                                if ($scope.previewTracks != null) {
                                    // If there is a preview showing -> Remove
                                    $scope.preview();
                                }
                                if ($scope.callStartedOnForceVideo == true) {
                                    $scope.connectTracks('video');
                                    $scope.callStartedOnForceVideo = false;
                                }
                                else {
                                    $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                                        if (track.kind == type) {
                                            track.track.enable();
                                        }
                                    });
                                }
                            }
                            else {
                                $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                                    if (track.kind == type) {
                                        track.track.disable();
                                    }
                                });
                                if ($scope.getPreviewContainer().querySelector('video')) {
                                    var childVideo = $scope.getPreviewContainer().getElementsByTagName('video');
                                    $scope.getPreviewContainer().removeChild(childVideo[0]);
                                }
                                if ($scope.sessionInProgress) {
                                    // Results in track being re-attached when video un-muted
                                    $scope.callStartedOnForceVideo = true;
                                }
                            }
                            $scope.deviceOptions.localvideomuted = !$scope.deviceOptions.localvideomuted;
                        }
                    }
                };

                $scope.setVolume = function () {
                    var audioTags = $scope.getRemoteContainer().getElementsByTagName("audio");
                    for (var i = 0; i < audioTags.length; i++) {
                        audioTags[i].volume = $scope.deviceOptions.audioVolume;
                    }
                };


                /*************** FORCE MODE START ***************/


                $scope.toggleForceMode = function () {
                    $scope.tutorSetForceMode = !$scope.tutorSetForceMode;
                    $rootScope.$broadcast('toggleForceMode', { forceMode: $scope.tutorSetForceMode, room: $scope.roomToJoin.value });
                };

                $scope.$on('receiveToggleForceMode', function (event, data) {
                    if (data.forceMode == true) {

                        if ($scope.sessionInProgress == true) {
                            if ($scope.roomToJoin.value == data.roomId) {
                                $timeout(function () {
                                    $scope.$apply(function () {
                                        $scope.forceMode = data.forceMode;
                                        if (!$scope.isOpen) {
                                            $scope.isOpen = true;
                                        }
                                    });
                                });
                            }
                            else {
                                for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                                    if ($scope.groupsToJoin[i].value == data.roomId) {
                                        $scope.leaveRoom();
                                        $scope.roomToJoin = $scope.groupsToJoin[i];
                                        $scope.forceMode = data.forceMode;
                                        $scope.callStartedOnForceVideo = true;
                                        $scope.callStartedOnForceAudio = true;
                                        $scope.deviceOptions.localvideomuted = true;
                                        $scope.deviceOptions.localaudiomuted = true;
                                        $scope.joinLogic(true);
                                        if (!$scope.isOpen) {
                                            $scope.isOpen = true;
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        else {

                            for (var j = 0; j < $scope.groupsToJoin.length; j++) {
                                if ($scope.groupsToJoin[j].value == data.roomId) {
                                    if ($scope.previewTracks != null) {
                                        $scope.detachTracks($scope.previewTracks);
                                        $scope.previewTracks = null;
                                    }
                                    else if ($scope.screenTrack != null) {
                                        $scope.deviceOptions.screenShareMode = false;
                                        $scope.getPreviewContainer().innerHTML = '';
                                        $scope.screenTrack = null;
                                    }

                                    // !!!Ensure that if a student is pulled into a room they are completely muted!!!
                                    $scope.deviceOptions.localvideomuted = true;
                                    $scope.deviceOptions.localaudiomuted = true;
                                    $scope.roomToJoin = $scope.groupsToJoin[j];
                                    $scope.forceMode = data.forceMode;
                                    $scope.callStartedOnForceVideo = true;
                                    $scope.callStartedOnForceAudio = true;
                                    $scope.joinLogic(true);
                                    if (!$scope.isOpen) {
                                        $scope.isOpen = true;
                                    }
                                    break;
                                }
                            }
                        }

                        toastr.success('Your Tutor is presenting to you, please pay attention');
                    }
                    else {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.forceMode = data.forceMode;
                            });
                        });
                    }
                });

                /*************** FORCE MODE END ***************/

                /*************** twilio functions start ***************/
                $scope.leaveRoom = function (fromForceMode) {
                    $scope.sessionInProgress = false;
                    if ($scope.deviceOptions.screenShareMode == true) {
                        $scope.stopShareScreen();
                    }

                    $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                        track.track.stop();
                    });

                    if ($scope.activeRoom) {
                        $scope.activeRoom.disconnect();
                    }

                    if ($scope.callMade == true) {
                        $scope.callMade = false;
                        $rootScope.$broadcast('cancelledByCall', $scope.roomToJoin.value);
                    }

                    if (!fromForceMode) {
                        $scope.deviceOptions.localaudiomuted = false;
                        $scope.deviceOptions.localvideomuted = false;
                    }

                    if ($scope.isTutor) {
                        $scope.tutorSetForceMode = false;
                    }
                };

                $scope.attachTracks = function (tracks, container) {
                    tracks.forEach(function (track) {
                        var attachedTrack = track.attach();
                        attachedTrack.id = track.trackName;
                        container.appendChild(attachedTrack);
                    });
                };

                $scope.attachParticipantTracks = function (participant, container) {
                    var tracks = $scope.getTracks(participant);
                    $scope.attachTracks(tracks, container);
                };

                $scope.detachTracks = function (tracks) {
                    tracks.forEach(function (track) {
                        track.detach().forEach(function (detachedElement) {
                            detachedElement.remove();
                        });
                    });
                };

                $scope.detachParticipantTracks = function (participant) {
                    var tracks = $scope.getTracks(participant);
                    $scope.detachTracks(tracks);
                };

                $scope.getTracks = function (participant) {
                    return Array.from(participant.tracks.values()).filter(function (publication) {
                        var track = publication.track;
                        return publication.track;
                    }).map(function (publication) {
                        return publication.track;
                    });
                };

                $scope.disconnectTracks = function (type) {
                    $scope.activeRoom.localParticipant.tracks.forEach(function (track) {
                        if (track.kind == type) {
                            $scope.activeRoom.localParticipant.unpublishTracks([track.track]);
                            $scope.detachTracks([track.track]);
                        }
                    });
                };

                $scope.connectTracks = function (type) {
                    if (type == 'video') {
                        $scope._Video.createLocalVideoTrack({
                            deviceId: { exact: $scope.deviceOptions.videodevice }
                        }).then(function (localVideoTrack) {
                            $scope.activeRoom.localParticipant.publishTrack(localVideoTrack);
                            $scope.attachTracks([localVideoTrack], $scope.getPreviewContainer());
                        });
                    } else if (type == 'audio') {
                        $scope._Video.createLocalAudioTrack({
                            deviceId: { exact: $scope.deviceOptions.audiodevice }
                        }).then(function (localAudioTrack) {
                            $scope.activeRoom.localParticipant.publishTrack(localAudioTrack);
                            $scope.attachTracks([localAudioTrack], $scope.getPreviewContainer());
                        });
                    }
                };

                /*************** twilio functions end ***************/

                $scope.$on('change_pane', function (event, args) {
                    // CB. must be a better way to do this
                    var optionCount = 0;
                    if (args == 'full') {
                        optionCount = 1;
                    } else if (args == 'half') {
                        optionCount = 2;
                    } else if (args == 'thirds') {
                        optionCount = 3;
                    } else if (args == 'quad') {
                        optionCount = 4;
                    }

                    $scope.paneNumberOptions = [];
                    for (var i = 0; i < optionCount; i++) {
                        $scope.paneNumberOptions.push({ text: (i + 1).toString(), value: i });
                    }

                    if ($scope.deviceOptions.paneMode == true) {
                        if ($scope.deviceOptions.paneNumber > $scope.paneNumberOptions[$scope.paneNumberOptions.length - 1].value) {
                            $scope.deviceOptions.paneNumber = $scope.paneNumberOptions[$scope.paneNumberOptions.length - 1].value;
                        }
                    }
                    else if ($scope.deviceOptions.paneNumber > $scope.paneNumberOptions[$scope.paneNumberOptions.length - 1].value) {
                        $scope.deviceOptions.paneNumber = $scope.paneNumberOptions[0].value;
                    }
                });

                $scope.$on('webcamPaneClosed', function (event, data) {
                    if ($scope.deviceOptions.paneMode == true) {
                        $scope.triggerPane();
                    }
                });

                $scope.triggerPane = function () {
                    $scope.deviceOptions.paneMode = !$scope.deviceOptions.paneMode;
                    $timeout(function () {
                        if ($scope.deviceOptions.paneMode == true) {
                            if ($scope.isOpen) {
                                $scope.isOpen = false;
                            }
                            $timeout(function () {
                                var localVid = document.getElementById('webcam-area');
                                $scope.getPaneContainer().appendChild(localVid);
                                var controls = document.getElementById('room-controls-inner');
                                $scope.getPaneSettingsContainer().appendChild(controls);
                                $rootScope.$broadcast('callInPane', { paneIndex: $scope.deviceOptions.paneNumber });
                            }, 400);
                        }
                        else {
                            var controls = document.getElementById('room-controls-inner');
                            document.getElementById('room-controls-outer').appendChild(controls);
                            var localVid = document.getElementById('webcam-area');
                            document.getElementById('webcam-area-outer').appendChild(localVid);
                            $rootScope.$broadcast('callOutPane', { paneIndex: $scope.deviceOptions.paneNumber });
                            if (!$scope.isOpen) {
                                $scope.isOpen = true;
                            }
                        }
                    }, 200);
                };

                $scope.embelishUser = function (userId) {
                    ClassroomSessionsService.getUserDetails({ id: userId }, function (success) {
                        for (var i = 0; i < $scope.externalParticipants.length; i++) {
                            if ($scope.externalParticipants[i].userId == userId) {
                                $scope.externalParticipants[i].username = success.username;
                                $scope.externalParticipants[i].fullName = success.fullName;
                                $scope.externalParticipants[i].isTutor = success.isTutor;
                            }
                        }
                    }, function (error) {
                    });
                };

                $scope.$on('callFromStudentFromChat', function (event, data) {
                    if ($scope.deviceOptions.popupEnabled) {
                        $rootScope.$broadcast('startCallFromStudent', data);
                    }
                    else {
                        toastr.clear();
                        toastr.error('Video is not been enabled');
                    }
                });

                $scope.$on('callGroupFromStudentFromChat', function (event, data) {
                    if ($scope.deviceOptions.popupEnabled) {
                        $rootScope.$broadcast('startGroupCallFromStudent', data);
                    }
                    else {
                        toastr.clear();
                        toastr.error('Video is not been enabled');
                    }
                });

                $scope.$on('callAllFromStudentFromChat', function (event, data) {
                    if ($scope.deviceOptions.popupEnabled) {
                        $rootScope.$broadcast('startAllCallFromStudent', data);
                    }
                    else {
                        toastr.clear();
                        toastr.error('Video is not been enabled');
                    }
                });

                $scope.callUser = function () {
                    $rootScope.$broadcast('startCallFromStudent', { classSessionId: $scope.classSessionId, userId: $scope.roomToJoin.userId });
                    $scope.callMade = true;
                    if ($scope.roomToJoin.helpRequested == true) {
                        $rootScope.$broadcast('helpDelivered', $scope.roomToJoin.userId);
                    }
                };

                $scope.$on('receiveCall', function (event, data, incomingUserId) {
                    console.log('THIS IS THE ONLY WAY', data, incomingUserId);
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
                                for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                                    if ($scope.groupsToJoin[i].userId == incomingUserId) {
                                        if ($scope.groupsToJoin[i].helpRequested) {
                                            $rootScope.$broadcast('helpDelivered', incomingUserId);
                                        }
                                        break;
                                    }
                                }
                                $scope.startIncomingCall(data);
                            }
                            else {
                                $rootScope.$broadcast('callDeclinedBy', { roomId: data });
                            }
                        });
                    });
                });

                $scope.$on('callDeclined', function (event, userId) {
                    for (var i = $scope.awaitingUsers.length - 1; i >= 0; i--) {
                        if ($scope.awaitingUsers[i].userId == userId) {
                            $scope.awaitingUsers.splice(i, 1);
                            break;
                        }
                    }
                });

                $scope.$on('startCall', function (event, opt) {
                    if (opt.roomId != $scope.roomToJoin.value || $scope.sessionInProgress == false) {
                        if ($scope.sessionInProgress == true) {
                            $scope.leaveRoom();
                        }
                        $scope.callMade = true;
                        $scope.startIncomingCall(opt.roomId, opt.users);
                    }
                    else {
                        $scope.awaitingUsers = opt.users;
                    }
                });

                $scope.$on('tutorCommandForceUser', function (event, opt) {
                    if ($scope.tutorSetForceMode) {
                        $scope.toggleForceMode();
                    }
                    if ($scope.roomToJoin.userId != opt.userId) {
                        if ($scope.sessionInProgress == true) {
                            $scope.leaveRoom();
                        }
                        for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                            if ($scope.roomToJoin.userId == opt.userId) {
                                $scope.roomToJoin = $scope.groupsToJoin[i];
                                break;
                            }
                        }
                        document.getElementById('button-join').click();
                    }
                    else if ($scope.sessionInProgress != true) {
                        document.getElementById('button-join').click();
                    }
                    $scope.toggleForceMode();
                    if (!$scope.isOpen) {
                        $scope.isOpen = true;
                    }
                });

                $scope.$on('tutorCommandForceGroup', function (event, opt) {
                    if ($scope.tutorSetForceMode) {
                        $scope.toggleForceMode();
                    }
                    if ($scope.roomToJoin.value != opt.groupId) {
                        if ($scope.sessionInProgress == true) {
                            $scope.leaveRoom();
                        }
                        for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                            if ($scope.roomToJoin.value == opt.groupId) {
                                $scope.roomToJoin = $scope.groupsToJoin[i];
                                break;
                            }
                        }
                        document.getElementById('button-join').click();
                    }
                    else if ($scope.sessionInProgress != true) {
                        document.getElementById('button-join').click();
                    }
                    $scope.toggleForceMode();
                    if (!$scope.isOpen) {
                        $scope.isOpen = true;
                    }
                });

                $scope.$on('tutorCommandForceAll', function (event) {
                    if ($scope.tutorSetForceMode) {
                        $scope.toggleForceMode();
                    }
                    if ($scope.roomToJoin.permissionType != "All") {
                        if ($scope.sessionInProgress == true) {
                            $scope.leaveRoom();
                        }
                        for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                            if ($scope.groupsToJoin[i].permissionType == 'All') {
                                $scope.roomToJoin = $scope.groupsToJoin[i];
                                break;
                            }
                        }
                        document.getElementById('button-join').click();
                    }
                    else if ($scope.sessionInProgress != true) {
                        document.getElementById('button-join').click();
                    }
                    $scope.toggleForceMode();
                    if (!$scope.isOpen) {
                        $scope.isOpen = true;
                    }
                });

                $scope.startIncomingCall = function (roomId, awaitingUsers) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.sessionInProgress == true) {
                                $scope.leaveRoom();
                            }

                            $scope.isOpen = true;

                            for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                                if ($scope.groupsToJoin[i].value == roomId) {
                                    $scope.roomToJoin = $scope.groupsToJoin[i];
                                }
                            }

                            if (awaitingUsers != undefined) {
                                $scope.awaitingUsers = awaitingUsers;
                            }
                            $('#button-join').click();
                        });
                    });
                };

                /*************** HELP REQUESTS START ***************/

                $rootScope.$on('helpRequested', function (event, userId) {
                    for (var a = 0; a < $scope.groupsToJoin.length; a++) {
                        if ($scope.groupsToJoin[a].userId == userId) {
                            $scope.groupsToJoin[a].helpRequested = true;
                            break;
                        }
                    }
                });

                $rootScope.$on('helpDelivered', function (event, userId) {
                    for (var a = 0; a < $scope.groupsToJoin.length; a++) {
                        if ($scope.groupsToJoin[a].userId == userId) {
                            $scope.groupsToJoin[a].helpRequested = false;
                            break;
                        }
                    }
                });

                /*************** HELP REQUESTS END ***************/

                /*************** GROUP ASSIGNMENT START ***************/

                $rootScope.$on('groupMoved', function (event, groupId) {
                    ClassroomSessionsService.getWebcamGroup({ classSessionId: $scope.classSessionId, groupId: groupId }, function (success) {
                        var found = false;
                        for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                            if ($scope.groupsToJoin.permissionType == 'Group') {
                                var deletedRoom = $scope.groupsToJoin.splice(i, 1, success);
                                if ($scope.roomToJoin.value == deletedRoom.value) {
                                    if ($scope.sessionInProgress == true) {
                                        $scope.leaveRoom();
                                    }
                                    if ($scope.groupsToJoin.length > 0) {
                                        $scope.roomToJoin = $scope.groupsToJoin[0];
                                    }
                                }
                                found = true;
                                break;
                            }
                        }
                        if (found == false) {
                            if ($scope.groupsToJoin.length > 1) {
                                $scope.groupsToJoin.splice(2, 0, success);
                            }
                            else {
                                $scope.groupsToJoin.push(success);
                            }
                        }
                    }, function (err) {
                    });
                });

                $rootScope.$on('groupRemoved', function (event) {
                    for (var i = 0; i < $scope.groupsToJoin.length; i++) {
                        if ($scope.groupsToJoin[i].permissionType == 'Group') {
                            var deletedRoom = $scope.groupsToJoin.splice(i, 1)[0];
                            if ($scope.roomToJoin.value == deletedRoom.value) {
                                if ($scope.sessionInProgress == true) {
                                    $scope.leaveRoom();
                                }
                                if ($scope.groupsToJoin.length > 0) {
                                    $scope.roomToJoin = $scope.groupsToJoin[0];
                                }
                            }
                            break;
                        }
                    }
                });

                /*************** GROUP ASSIGNMENT END ***************/

                /*************** SCREENSHARE ASSIGNMENT START ***************/

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
                    var extensionId = 'bomnhpeeelhikfijdbgnfmcicjehajdh';
                    if (!$scope.canScreenShare()) {
                        toastr.clear();
                        toastr.error('Screenshare is only available in Chrome, Firefox and Edge (Jan 2020).');
                        return;
                    }
                    if ($scope.isChrome() || $scope.isEdge()) {
                        // THE NEW EDGE CAN TAKE CHROME EXTENSIONS!
                        return new Promise(function (resolve, reject) {
                            var request = {
                                sources: ['screen']
                            };
                            chrome.runtime.sendMessage(extensionId, request, function (response) {
                                if (response) {
                                    if (response.type === 'success') {
                                        resolve({ streamId: response.streamId });
                                    }
                                    else {
                                        reject();
                                    }
                                } else {
                                    alert('Our extension is required for screenshare in ' + ($scope.isChrome() ? 'Chrome' : 'Edge') + '. Hit okay and we\'ll show you where to get it!');
                                    window.open('https://chrome.google.com/webstore/detail/standing-out-screen-share/bomnhpeeelhikfijdbgnfmcicjehajdh', '_blank');
                                    reject(new Error('Could not get stream'));
                                }
                            });
                        }).then(function (response) {
                            return navigator.mediaDevices.getUserMedia({
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: response.streamId
                                    }
                                }
                            });
                        });
                    } else if ($scope.isFirefox()) {
                        return navigator.mediaDevices.getUserMedia({
                            video: {
                                mediaSource: 'screen'
                            }
                        });
                    } else {
                        toastr.clear();
                        toastr.error('Screenshare is only available in Firefox and Chrome');
                    }
                };

                $scope.previewScreenshare = function () {
                    if ($scope.deviceOptions.screenShareMode == true) {
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.deviceOptions.screenShareMode = false;
                                $scope.getPreviewContainer().innerHTML = '';
                                $scope.screenTrack = null;
                            });
                        });
                    } else {
                        $scope.getUserScreen().then(function (stream) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.deviceOptions.screenShareMode = true;
                                    $scope.screenTrack = stream.getVideoTracks()[0];

                                    //$scope.disconnectTracks('video');
                                    //$scope.activeRoom.localParticipant.publishTrack($scope.screenTrack);
                                    var newLocalVideoTrack = Twilio.Video.LocalVideoTrack($scope.screenTrack);
                                    $scope.attachTracks([newLocalVideoTrack], $scope.getPreviewContainer());
                                });
                            });
                        });
                    }
                };

                $scope.startShareScreen = function () {
                    $scope.getUserScreen().then(function (stream) {
                        if ($scope.previewActive == true) {
                            $scope.preview();
                        }
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.deviceOptions.screenShareMode = true;
                                $scope.screenTrack = stream.getVideoTracks()[0];

                                $scope.screenTrack.onended = function () {
                                    $scope.stopShareScreenLogic();
                                }

                                $scope.disconnectTracks('video');
                                $scope.activeRoom.localParticipant.publishTrack($scope.screenTrack);
                                var newLocalVideoTrack = Twilio.Video.LocalVideoTrack($scope.screenTrack);
                                $scope.attachTracks([newLocalVideoTrack], $scope.getPreviewContainer());
                            });
                        });
                    });
                };

                $scope.stopShareScreen = function (leaveRoom) {
                    if ($scope.deviceOptions.screenShareMode == true) {
                        $scope.deviceOptions.screenShareMode = false;

                        $scope.screenTrack.stop(); // NOTE THAT THIS WILL CAUSE stopShareScreenLogic TO BE CALLED SO WE MUST HAVE THE IF STATEMENT IN START OF BOTH (didn't saperate out due to leaveRoom variable)
                        $scope.disconnectTracks('video');
                        $scope.getPreviewContainer().innerHTML = '';
                        $scope.screenTrack = null;

                        if ($scope.deviceOptions.showvideo && leaveRoom == false && !$scope.deviceOptions.localvideomuted) {
                            $scope.connectTracks('video');
                        }
                    }
                };

                $scope.stopShareScreenLogic = function () {
                    if ($scope.deviceOptions.screenShareMode == true) {
                        $scope.deviceOptions.screenShareMode = false;

                        $scope.disconnectTracks('video');
                        $scope.getPreviewContainer().innerHTML = '';
                        $scope.screenTrack = null;

                        if ($scope.deviceOptions.showvideo && !$scope.deviceOptions.localvideomuted) {
                            $scope.connectTracks('video');
                        }
                    }
                };

                /*************** SCREENSHARE ASSIGNMENT END ***************/                

                $scope.init();
            }
        ]);
})();