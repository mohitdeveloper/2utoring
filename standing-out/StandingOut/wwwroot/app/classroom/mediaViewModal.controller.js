(function () {
    angular.module('standingOut.controllers').controller('MediaViewModalController',
        ['$scope', '$log', 'close', 'ModalService', 'media','$sce',
            function ($scope, $log, close, ModalService, media, $sce) {
                $scope.media = media;               


                $scope.getPreviewString = function (media) {
                    if (media.content !== undefined && media.content != null && media.content.length > 0 && media.content.includes('.')) {
                        if (media.content.startsWith("https://") || media.content.startsWith("http://")) {
                            return media.content;
                        }
                        else {
                            return "https://" + media.content;
                        }
                    } else {
                        return '';
                    }
                };

                $scope.trustedUrl = function () {
                    var previewString = $scope.getPreviewString($scope.media);
                    return $sce.trustAsResourceUrl(previewString);
                };

                $scope.cancel = function () {
                    close($scope.result, 100);
                };
            }
        ]);
})();