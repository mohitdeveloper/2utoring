(function () {
    angular.module('standingOut.controllers').controller('DeleteModalController',
        ['$scope', '$timeout', 'close',
            function ($scope, $timeout, close) {
                $scope.decision = false;
                $scope.closed = false;                

                $scope.remove = function (decision) {
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