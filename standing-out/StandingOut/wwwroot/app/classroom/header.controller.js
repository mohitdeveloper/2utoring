
(function () {
    angular.module('standingOut.controllers').controller('HeaderController',
        ['$scope','API', '$rootScope', '$timeout', 'ModalService', 'DeleteService', 'ClassroomSessionsService',
            function ($scope, API, $rootScope, $timeout, ModalService, DeleteService, ClassroomSessionsService) {
                $scope.classSessionId = classSessionId;
                $scope.firstLoad = true;
                $scope.counter = '00:00:00';
                $scope.showBlink = false;
                $scope.sessionEnd = false;
                $rootScope.sessionStarted = false;
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.askedForHelp = false;

                $scope.init = function () {
                    //wizcraft 03 Apr 2021
                    //to set the transform for firefox
                    var wdth = $(window).width(); 
                    if (wdth < 1400) {
                        var currFFZoom = 0.77;
                        if (navigator.userAgent.indexOf('Firefox') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) { //Firefox
                            var step = 0.02;
                            currFFZoom -= step;
                            $('body').css('MozTransform', 'scale(' + currFFZoom + ')');
                            $('body').css('-webkit-transform-origin', 'top left');
                            $('body').css('width', '133%');
                        }
                    } else {
                        if (navigator.userAgent.indexOf('Firefox') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) { //Firefox
                            $('body').css('MozTransform', 'scale(1)');
                        }
                    }
                    
                    //ModalService.showModal({
                    //    templateUrl: '/app/classroom/enterClassroomModal.html',
                    //    controller: 'EnterClassroomModalController'
                    //}).then(function (modal) {
                    //    modal.close.then(function (result) {
                    //        // The purpose of this modal is to trigger a click from the user
                    //        // The reason for wanting this is that, video and audio may not be played until a user has interacted with a page
                    //    });
                    //});


                    //ClassroomSessionsService.getToken(null, function (success) {
                    //    console.log(success);
                    //    accessToken = success.accessToken;
                    //}, function (err) {
                    //        console.log(err);
                    //});
                     

                    ClassroomSessionsService.get({ id: $scope.classSessionId }, function (success) {
                        $scope.classSession = success;
                        $rootScope.sessionStarted = success.started;
                        $rootScope.sessionEnded = success.ended;
                         
                        $scope.startTimer();
                        if ($scope.isChrome()) {
                            toastr.info('It looks like you\'re on Chrome. If you can\'t access a file you may be logged into the browser as another user!');
                        }
                    }, function (err) {
                    });
                };

                //to check lesson start time is equal or more with current time then lesson will start automatically
                if (!$rootScope.sessionStarted && $scope.isTutor) {
                     
                    var y = setInterval(function () {
                        //console.log(new Date($scope.classSession.startDate).getTime(), new Date().getTime())
                        if (new Date().getTime() >= new Date($scope.classSession.startDate).getTime()) {
                            console.log('Session start');
                            if (!$rootScope.sessionStarted) {
                                $scope.startSession();
                            } else {
                                console.log('interval clear')
                                clearInterval(y);
                            }
                        }
                    }, 800);
                }

                //to redirect students out side the classroom after 15min form start time if lesson not started
                setTimeout(function () {
                    if (!$rootScope.sessionStarted && !$scope.isTutor) {
                        var z = setInterval(function () {
                            //console.log(new Date($scope.classSession.startDate).getTime(), new Date().getTime())
                            var ct = new Date().getTime();
                            var lst = new Date($scope.classSession.startDate).getTime();
                            var stdTimeDiff = ct - lst;
                            var stdDiffInSeconds = Math.floor(stdTimeDiff/60000 * 60); //CONVERT IN SECONDS
                            if (stdDiffInSeconds > 900 && !$rootScope.sessionStarted && !$scope.isTutor) {
                                clearInterval(z);
                                console.log(stdTimeDiff, stdDiffInSeconds, 'class gone')
                                ClassroomSessionsService.cancelSession({ classSessionId: $scope.classSessionId }, function (success) {
                                    window.location.href = success.url;
                                }, function (err) {
                                });
                            }
                        }, 800);
                    }
                }, 2000);



                $rootScope.checkSessionStart = function () {
                    if (!$rootScope.sessionStarted && $scope.isTutor == false) {
                        toastr.clear();
                        toastr.info('Only chat is available until the session has begun');
                        return false;
                    }
                    else {
                        return true;
                    }
                };


                //#region timer functionality

                $scope.startTimer = function () {
                    if ($rootScope.sessionStarted == false || $scope.classSession.dueEndDate == null) {
                        $scope.setCounterFromTimes(new Date($scope.classSession.startDate).getTime(), new Date($scope.classSession.endDate).getTime());
                    }
                    else {
                        // Update the count down every 1 second
                        var x = setInterval(function () {
                            if ($scope.sessionEnd && !$rootScope.sessionEnded) {
                                if (((new Date($scope.classSession.dueEndDate).getTime() - new Date().getTime()) / (1000 * 60)) < -5) {
                                    clearInterval(x);
                                    if ($scope.isTutor) {
                                        $scope.endSessionLogic();
                                    }
                                    else {
                                        $rootScope.sessionEnded = true;
                                        $('.loading').show();
                                        window.location = '/f/' + $scope.classSessionId;
                                    }
                                }
                            }
                            else if ($scope.setCounterFromTimes(new Date().getTime(), new Date($scope.classSession.dueEndDate).getTime())) {

                                $scope.setCounter("00:00:00");
                                $scope.setBlink(true);
                                $scope.setEnd(true);

                                setTimeout(function () {
                                    $scope.setBlink(false);
                                }, 5000);
                            }
                        }, 1000);
                    }

                    //show timer once enabled (only do this once)
                    if ($scope.firstLoad == true) {
                        $scope.firstLoad = false;
                        $('#countdown').show();
                    }
                };

                $scope.$on('startTimer', function (event, dueEndDate) {
                    if (dueEndDate != undefined && dueEndDate != null) {
                        $scope.classSession.dueEndDate = dueEndDate;
                    }
                    $scope.startTimer();
                });

                $scope.setCounterFromTimes = function (startDate, endDate) {
                     
                    // Find the distance between now and the count down date
                    //to check get the difference from start lesson time  and current time
                    var distance;

                    var cTime = new Date().getTime();
                    var lessonStartTime = startDate;
                    var timeDiff = cTime - lessonStartTime;
                    var diffInSeconds = Math.floor(timeDiff/60000 * 60); //CONVER IN SECONDS
                    if (diffInSeconds > 0 && $scope.isTutor) {
                        if ($rootScope.sessionStarted) {
                            //do nothing
                        } else {
                            $scope.startSession();
                        }
                        var preDistance = endDate - startDate;
                        distance = preDistance - timeDiff;
                        console.log('automated');
                         
                    } else {
                        distance = endDate - startDate;
                    }
                    //end



                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    $scope.setCounter(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2));
                    //once within 5 mins turn red
                    if (hours < 1 && minutes < 5) {
                        document.getElementById("countdown").style.color = "#ff0000";
                    }


                    // If the count down is finished, write some text
                    if (distance < 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                $scope.setCounter = function (string) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.counter = string;
                        });
                    });
                };

                $scope.setBlink = function (val) {
                    $scope.$apply(function () {
                        $scope.showBlink = val;
                    });
                };

                $scope.setEnd = function (val) {
                    $scope.$apply(function () {
                        $scope.sessionEnd = true;
                    });
                };

                $scope.endSession = function () {
                    ModalService.showModal({
                        templateUrl: '/app/classroom/endClassModal.html',
                        controller: 'EndClassModalController',
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result) {
                                $scope.endSessionLogic();
                            }
                        });
                    });
                };

                $scope.endSessionLogic = function () {
                    ClassroomSessionsService.endSession({ classSessionId: classSessionId }, function (success) {
                        toastr.clear();
                        toastr.success("Session complete!");
                        ClassroomSessionsService.broadcastSessionEnd();
                    }, function (err) {
                        toastr.clear();
                        toastr.error("Error ending session");
                    });
                };

                $scope.startSession = function () {
                    ClassroomSessionsService.startSession({ classSessionId: classSessionId }, function (success) {
                        ClassroomSessionsService.broadcastSessionStart();
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.classSession.dueEndDate = success.dueEndDate;
                                 
                                $rootScope.sessionStarted = true;
                                $scope.startTimer();
                            });
                        });
                        toastr.clear();
                        toastr.success("The lesson has started – all Students screens have been cleared.");
                    }, function (err) {
                        toastr.clear();
                        toastr.error("Couldn't start session");
                    });
                };

                //#endregion

                //#region screenshot

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
                        toastr.error('Screenshot is only available in Chrome, Firefox and Edge (Jan 2020 update).');
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

                $scope.takeScreenshot = function () {
                    if ($rootScope.checkSessionStart()) {

                        var videoTag = document.createElement('video');
                        var canvas = document.createElement('canvas');

                        // Gets screen share pop up in browser

                        $scope.getUserScreen().then(function (stream) {

                            if (stream != undefined) {

                                videoTag.srcObject = stream;
                                videoTag.width = $(document.body)[0].clientWidth;
                                videoTag.height = $(document.body)[0].clientHeight;

                                videoTag.play().then(function () {

                                    $timeout(function () {

                                        canvas.width = videoTag.videoWidth;
                                        canvas.height = videoTag.videoHeight;
                                        canvas.getContext('2d').drawImage(videoTag, 0, 0);
                                        return canvas;

                                    }, 500).then(function (canvas) {

                                        var img = canvas.toDataURL('image/png');

                                        ModalService.showModal({
                                            templateUrl: '/app/classroom/screenshotModal.html',
                                            controller: 'ScreenshotModalController',
                                            inputs: {
                                                img: img
                                            }
                                        }).then(function (modal) {

                                            modal.close.then(function (result) {
                                                if (result.success) {
                                                    $scope.screenshotTaken();
                                                }

                                            });
                                        });

                                        stream.getTracks().forEach(function (track) {
                                            track.stop();
                                        });
                                        videoTag.remove();
                                        canvas.remove();

                                    });

                                }, function () {

                                    stream.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                    videoTag.remove();
                                    canvas.remove();

                                });
                            }
                            else {

                                videoTag.remove();
                                canvas.remove();

                            }

                        }, function () {

                            videoTag.remove();
                            canvas.remove();

                        });

                        //html2canvas(document.body, {
                        //    allowTaint: true
                        //}).then(function (canvas) {

                        //    $(canvas).prop("id", "screenshot-canvas");
                        //    $(canvas).css("width", "100%");
                        //    $(canvas).css("height", "auto");

                        //    ModalService.showModal({
                        //        templateUrl: '/app/classroom/screenshotModal.html',
                        //        controller: 'ScreenshotModalController',
                        //        inputs: {
                        //            canvas: canvas
                        //        }
                        //    }).then(function (modal) {
                        //        modal.close.then(function (result) {
                        //            if (result.success) {
                        //                $scope.screenshotTaken();
                        //            }
                        //        });
                        //    });
                        //});
                    }

                };

                $scope.screenshotTaken = function () {
                    ClassroomSessionsService.broadcastScreenshotTaken();
                };

                //#endregion

                //#region pane

                // Gets pane ='full', 'half', 'thirds', 'quad'
                $scope.changePane = function (pane) {
                    if ($rootScope.checkSessionStart()) {
                        ClassroomSessionsService.updateChangePaneListeners(pane);
                    }
                };

                //#endregion

                //#region report abuse
                $scope.toggleReportAbuse = function () {
                    ModalService.showModal({
                        templateUrl: '/app/safeguardReport/safeguardReportModal.html',
                        controller: 'SafeguardReportModalController',
                        inputs: {
                            safeguardReport: { safeguardReportId: undefined, classSessionId: $scope.classSessionId, }
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {

                        });
                    });
                };
                //#endregion

                //#region ask for help

                $scope.toggleAskForHelp = function () {
                    if ($rootScope.sessionEnded) {
                        toastr.clear();
                        toastr.error('Ask for Help is not available to use out of class');
                    }
                    else if ($rootScope.checkSessionStart()) {
                        ModalService.showModal({
                            templateUrl: '/app/classroom/askForHelp.html',
                            controller: 'AskForHelpController',
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                if (result.success) {
                                    $scope.askedForHelp = true;
                                    toastr.clear();
                                    toastr.success('Your help request has been sent!');
                                }
                            });
                        });
                    }
                };

                $rootScope.$on('helpComing', function (event) {
                    console.log('$scope.askedForHelp: ', $scope.askedForHelp);

                    if ($scope.askedForHelp == true) {
                        $scope.askedForHelp = false;
                        toastr.clear();
                        toastr.info('Help is on the way!');
                    }
                });

                //#endregion

                //#region calc

                $scope.toggleCalculator = function () {
                    if ($rootScope.checkSessionStart()) {
                        $rootScope.$broadcast('toggleCalculator');
                    }
                };

                //#endregion

                $scope.init();
            }
        ]);
})();