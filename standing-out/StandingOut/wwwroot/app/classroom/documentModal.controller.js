(function () {
    angular.module('standingOut.controllers').controller('DocumentModalController',
        ['$scope', '$timeout', '$log', '$sce', 'close', 'ModalService', 'documentUrl', 'SessionDocumentsService', 
            function ($scope, $timeout, $log, $sce, close, ModalService, documentUrl, SessionDocumentsService) {
                $scope.selectedDocument = documentUrl;

                $scope.cancel = function () {
                    close($scope.result, 100);
                };


                $scope.$on('filePermissionsChange', function (event, data) {
                    for (var i = 0; i < data.length; i++) {
                        if ($scope.selectedDocument != null && $scope.selectedDocument.includes('/d/' + data[i] + '/edit')) {
                            var tempDoc = $scope.selectedDocument;
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.selectedDocument = null;
                                });
                            });
                            $timeout(function () {
                                $scope.$apply(function () {
                                    $scope.selectedDocument = tempDoc;
                                });
                            }, 50);
                        }
                    }
                });


                $scope.trust = function (link) {
                    return $sce.trustAsResourceUrl(link);
                };

                $scope.init = function () {
                };

                $scope.init();
            }
        ]);
})();