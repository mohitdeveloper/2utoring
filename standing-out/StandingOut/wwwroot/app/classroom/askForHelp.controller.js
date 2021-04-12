(function () {
    angular.module('standingOut.controllers').controller('AskForHelpController',
        ['$scope', 'close', '$rootScope',
            function ($scope, close, $rootScope) {

                $scope.cancel = function () {
                    close({ success: false }, 100);
                };

                $scope.sendHelpRequest = function () {
                    $rootScope.$broadcast('askForHelp');
                    close({ success: true }, 100);
                };
            }
        ]);
})();