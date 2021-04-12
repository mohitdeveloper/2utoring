(function () {
    angular.module('standingOut.controllers').controller('CompanyController',
        ['$scope', 'ModalService', 'DeleteService', 'CompanysService', 'CompanyTutorsService',
            function ($scope, ModalService, DeleteService, CompanysService, CompanyTutorsService) {
                $scope.companyId = companyId;
                $scope.companyTutors = [];
                $scope.tutors = [];

                $scope.init = function () {
                    $(document).foundation();
                    if ($scope.companyId !== undefined) {
                        $('.loading').show();
                        CompanysService.get({ id: $scope.companyId }, function (success) {
                            $scope.company = success;
                            $('.loading').hide();
                        }, function (err) {
                        });

                        CompanyTutorsService.company({ id: $scope.companyId }, function (success) {
                            $scope.companyTutors = success;
                        }, function (err) {
                        });

                        CompanyTutorsService.tutors({}, function (success) {
                            $scope.tutors = success;
                        }, function (err) {
                        });
                    } else {
                        $scope.company = { companyId: undefined };
                    }
                };

                $scope.setFile = function (files) {
                    console.log('hi', files);
                    if (files.length > 0) {
                        $scope.company.file = files[0];
                        $scope.company.imageName = files[0].name;
                    }
                };

                $scope.addTutor = function () {
                    if ($scope.tutorId != undefined && $scope.tutorId != null) {
                        $('.loading').show();
                        var exist = false;
                        for (var i = 0; i < $scope.companyTutors.length; i++) {
                            if ($scope.companyTutors[i].tutorId == $scope.tutorId) {
                                exist = true;
                            }
                        }

                        if (exist == false) {
                            CompanyTutorsService.save({}, { companyId: $scope.companyId, tutorId: $scope.tutorId }, function (createSuccess) {
                                CompanyTutorsService.company({ id: $scope.companyId }, function (success) {
                                    $scope.companyTutors = success;
                                    $('.loading').hide();
                                }, function (err) {
                                });
                            }, function (err) {
                            });
                        } else {
                            $('.loading').hide();
                        }
                    }
                };

                $scope.removeTutor = function (companyTutor) {
                    DeleteService.confirm(function (result) {
                        if (result == true) {
                            $('.loading').show();
                            CompanyTutorsService.delete({ id: companyTutor.companyTutorId },
                                function (success) {
                                    $('.loading').hide();
                                    for (var i = 0; i < $scope.companyTutors.length; i++) {
                                        if ($scope.companyTutors[i].$$hashKey == companyTutor.$$hashKey) {
                                            $scope.companyTutors.splice(i, 1);
                                        }
                                    }
                                    toastr.success('Delete successsful.');
                                },
                                function (error) {
                                    $('.loading').hide();
                                    toastr.error('Delete unsuccesssful.');
                                }
                            );
                        }
                    }, function (err) {
                    });
                };

                $scope.save = function () {
                    $scope.companyForm.submitted = true;
                    if ($scope.companyForm.$valid) {
                        $('.loading').show();
                        if ($scope.companyId !== undefined) {
                            CompanysService.updateWithImage($scope.companyId, $scope.company, function (success) {
                                $scope.company = success;
                                toastr.success('Save Successful');
                                $('.loading').hide();
                            }, function (err) {
                                toastr.error('Save Unsuccessful');
                                $('.loading').hide();
                            });
                        } else {
                            CompanysService.saveWithImage($scope.company, function (success) {
                                $scope.company = success;
                                window.location.href = '/admin/companys/edit/' + $scope.company.companyId;
                                toastr.success('Save Successful');
                                $('.loading').hide();
                            }, function (err) {
                                toastr.error('Save Unsuccessful');
                                $('.loading').hide();
                            });
                        }
                    }
                };

                $scope.init();
            }
        ]);
})();