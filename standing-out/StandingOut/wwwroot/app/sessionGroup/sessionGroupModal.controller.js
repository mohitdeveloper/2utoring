(function () {
    angular.module('standingOut.controllers').controller('SessionGroupModalController',
        ['$scope', '$log', 'close', 'ModalService', 'group', 'EnumsService', 'SessionGroupsService',
            function ($scope, $log, close, ModalService, group, EnumsService, SessionGroupsService) {
                $scope.group = group;
                $scope.result = { success: false };
                
                $scope.cancel = function () {
                    $scope.result.success = false;
                    close($scope.result, 100);
                };

                $scope.save = function () {
                    $scope.groupForm.submitted = true;

                    if ($scope.groupForm.$valid) {
                        if ($scope.group.sessionGroupId !== undefined && $scope.group.sessionGroupId != null && $scope.group.sessionGroupId != '') {

                            SessionGroupsService.update({ classSessionId: $scope.group.classSessionId, id: $scope.group.sessionGroupId }, $scope.group, function (success) {
                                $scope.result = success;
                                $scope.result.success = true;
                                $('.loading').hide();
                                close($scope.result, 100);
                                toastr.success('Save successsful.');
                            }, function (err) {
                            });
                        } else {
                            SessionGroupsService.save({ classSessionId: $scope.group.classSessionId }, $scope.group, function (success) {
                                $scope.result = success;
                                $scope.result.success = true;
                                $('.loading').hide();
                                close($scope.result, 100);
                                toastr.success('Save successsful.');
                            }, function (err) {
                            });
                        }
                    }
                };

            }
        ]);
})();