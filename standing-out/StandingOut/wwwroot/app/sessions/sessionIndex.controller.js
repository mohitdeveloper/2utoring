(function () {
    angular.module('standingOut.controllers').controller('SessionIndexController',
        ['$scope', 'ClassSessionsService', 'ModalService', 'TutorsService', 'FamilyLinksService',
            function ($scope, ClassSessionsService, ModalService, TutorsService, FamilyLinksService) {
                $scope.toLoad = 0;
                $scope.loaded = 0;
                $scope.possibleTakes = [10, 20, 50];
                $scope.upcomingSessions = [];
                $scope.upcomingSessionsSearch = { page: 1, take: 20, search: '', filter: '', sortType: '', order: '' };
                $scope.previousSessions = [];
                $scope.previousSessionsSearch = { page: 1, take: 20, search: '', filter: '', sortType: '', order: '' };
                $scope.searchText = '';
                $scope.take = 20;
                $scope.isTutor = isTutor;
                $scope.isParent = isParent;
                $scope.tutor = {};
                $scope.familyLinks = [];
                
                $scope.incrementLoad = function () {
                    $scope.loaded++;

                    if ($scope.loaded >= $scope.toLoad) {
                        $('.loading').hide();
                    }
                };

                $scope.resetLoadSet = function (end) {
                    $('.loading').show();
                    $scope.toLoad = end;
                    $scope.loaded = 0;
                };

                $scope.init = function () {

                    $scope.resetLoadSet(2 + ($scope.isTutor ? 1 : 0) + ($scope.isParent ? 1 : 0));

                    if ($scope.isTutor) {
                        TutorsService.my({}, function (success) {
                            $scope.tutor = success;
                            $scope.incrementLoad();
                        }, function (err) {
                        });
                    }

                    if ($scope.isParent) {
                        FamilyLinksService.query({}, function (success) {
                            $scope.familyLinks = success;
                            $scope.incrementLoad();
                        }, function (err) {
                        });
                    }

                    $scope.sessionSearch();
                };

                /* START - Sessions */

                $scope.reloadSessionSearch = function () {
                    $scope.resetLoadSet(2);
                    $scope.sessionSearch();
                };

                $scope.sessionSearch = function () {
                    $scope.upcomingCall();
                    $scope.previousCall();
                };

                $scope.search = function () {
                    $scope.upcomingSessionsSearch.search = $scope.searchText;
                    $scope.previousSessionsSearch.search = $scope.searchText;
                    $scope.upcomingSessionsSearch.page = 1;
                    $scope.previousSessionsSearch.page = 1;
                    $scope.reloadSessionSearch();
                };

                $scope.upcomingCall = function () {
                    ClassSessionsService.upcomingSessions({}, $scope.upcomingSessionsSearch, function (success) {
                        $scope.upcomingSessions = success.data;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.previousCall = function () {
                    ClassSessionsService.previousSessions({}, $scope.previousSessionsSearch, function (success) {
                        $scope.previousSessions = success.data;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.toSession = function (classSessionId) {
                    window.location.href = '/classroom/sessions/main/' + classSessionId;
                };

                $scope.toSetup = function (classSessionId) {
                    window.location.href = '/session/' + classSessionId;
                };

                $scope.nextPage = function (type) {
                    $scope.resetLoadSet(1);
                    if (type == 'previous') {
                        if ($scope.previousSessionsSearch.page < $scope.previousSessionsSearch.totalPages) {
                            $scope.previousSessionsSearch.page = $scope.previousSessionsSearch.page + 1;
                        }
                        $scope.previousCall();
                    }
                    else {
                        if ($scope.upcomingSessionsSearch.page < $scope.upcomingSessionsSearch.totalPages) {
                            $scope.upcomingSessionsSearch.page = $scope.upcomingSessionsSearch.page + 1;
                        }
                        $scope.upcomingCall();
                    }
                };

                $scope.prevPage = function (type) {
                    $scope.resetLoadSet(1);
                    if (type == 'previous') {
                        if ($scope.previousSessionsSearch.page > 1) {
                            $scope.previousSessionsSearch.page = $scope.previousSessionsSearch.page - 1;
                        }
                        $scope.previousCall();
                    }
                    else {
                        if ($scope.upcomingSessionsSearch.page > 1) {
                            $scope.upcomingSessionsSearch.page = $scope.upcomingSessionsSearch.page - 1;
                        }
                        $scope.upcomingCall();
                    }
                };

                $scope.takeChange = function () {
                    $scope.upcomingSessionsSearch.page = 1;
                    $scope.previousSessionsSearch.page = 1;
                    $scope.upcomingSessionsSearch.take = $scope.take;
                    $scope.previousSessionsSearch.take = $scope.take;
                    $scope.reloadSessionSearch();
                };

                /* END - Sessions */

                /* START - Family Links */

                $scope.addFamily = function () {
                    if (isParent) {
                        var currentEmails = [];
                        $scope.familyLinks.forEach(function (familyLink) {
                            currentEmails.push(familyLink.childEmail);
                        });
                        ModalService.showModal({
                            templateUrl: '/app/my/familyLinkAddModal.html',
                            controller: 'FamilyLinkAddModalController',
                            inputs: {
                                currentEmails: currentEmails
                            }
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                if (result != undefined) {
                                    $scope.familyLinks.push(result);
                                }
                            });
                        });
                    }
                };

                $scope.resendFamily = function (index) {
                    if (isParent && !$scope.familyLinks[index].linked && !$scope.familyLinks[index].recentRequest) {
                        FamilyLinksService.resend({ id: $scope.familyLinks[index].familyLinkId }, function (success) {
                            $scope.familyLinks[index] = success;
                        }, function (err) {
                            toastr.error('Error sending email');
                        });
                    }
                };

                $scope.removeFamily = function (index) {
                    if (isParent) {
                        FamilyLinksService.remove({ id: $scope.familyLinks[index].familyLinkId }, function (success) {
                            $scope.familyLinks.splice(index, 1);
                        }, function (err) {
                            toastr.error('Error removing family member');
                        });
                    }
                };

                /* START - Family Links */

                //#region report abuse
                $scope.toggleReportAbuse = function () {
                    ModalService.showModal({
                        templateUrl: '/app/safeguardReport/safeguardReportModal.html',
                        controller: 'SafeguardReportModalController',
                        inputs: {
                            safeguardReport: { safeguardReportId: undefined, classSessionId: undefined, }
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            $('.loading').show();
                        });
                    });
                };
                     //#endregion

                $scope.uploadFiles = function (files) {
                    if (files.length > 0) {
                        if (files[0].type != 'image/jpeg' && files[0].type != 'image/jpg' && files[0].type != 'image/png') {
                            toastr.error('Please upload a png or jpg only');
                        }
                        else {
                            $('.loading').show();
                            var data = { file: files[0], tutorId: $scope.tutor.tutorId };
                            TutorsService.upload(data, function (success) {


                                $scope.tutor.imageDirectory = success.imageDirectory;
                                $scope.tutor.imageName = success.imageName;
                                $scope.tutor.imageDownlaodUrl = success.imageDownlaodUrl;
                                $('.loading').hide();
                            }, function (err) {
                                toastr.error("Failed to upload document.");
                                $('.loading').hide();
                            });
                        }
                        
                    }
                };

                $scope.updateTutor = function () {
                    $scope.tutorForm.submitted = true;
                    if ($scope.tutorForm.$valid) {
                        $('.loading').show();
                        TutorsService.update({ id: $scope.tutor.tutorId }, $scope.tutor, function (success) {
                            $scope.tutor = success;
                                toastr.success('Save Successful');
                                $('.loading').hide();
                            }, function (err) {
                                toastr.error('Save Unsuccessful');
                                $('.loading').hide();
                            });                       
                    }
                };

                $scope.init();
            }
        ]);
})();