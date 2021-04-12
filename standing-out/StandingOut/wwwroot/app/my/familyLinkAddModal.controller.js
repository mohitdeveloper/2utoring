(function () {
    angular.module('standingOut.controllers').controller('FamilyLinkAddModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'currentEmails', 'FamilyLinksService',
            function ($scope, $log, $sce, close, ModalService, currentEmails, FamilyLinksService) {
                $scope.currentEmails = currentEmails;
                $scope.newEmail = '';

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    
                };

                $scope.save = function (index) {

                    $scope.currentEmails.forEach(function (currentEmail) {
                        if (currentEmail == $scope.newEmail) {
                            toastr.error('You\'ve already added this email!');
                            return;
                        }
                    });

                    FamilyLinksService.save({}, { childEmail: $scope.newEmail }, function (success) {
                        toastr.success('Invitation sent!');
                        close(success, 100);
                    }, function (err) {
                        toastr.error('We had some issues adding this email. Please check it\'s correct and try again.');
                    });
                };

                $scope.init();
            }
        ]);
})();