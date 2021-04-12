(function () {
    angular.module('standingOut.controllers').controller('AlertPopModalController',
        ['$scope', '$timeout', 'close', 'title', 'message', 'confirmButtons', 'noText', 'yesText',
            function ($scope, $timeout, close, title, message, confirmButtons, noText, yesText) {

                $scope.decision = false;
                $scope.confirmButtons = confirmButtons;
                $scope.closed = false;
                $scope.title = title;
                $scope.message = message;

                $scope.noText = noText;
                $scope.yesText = yesText;
                

                $scope.confirm = function (decision) {
                    $scope.decision = decision;
                    $scope.close();
                };

                $scope.close = function () {
                    if (!$scope.closed) {
                        $scope.closed = true;

                        close($scope.decision, 500);
                        return;
                    }

                };
            }
        ]);
})();