(function () {
    angular.module('standingOut.controllers').controller('SessionMediaModalController',
        ['$scope', '$log', 'close', 'ModalService', 'media', 'EnumsService', 'SessionMediasService', '$sce',
            function ($scope, $log, close, ModalService, media, EnumsService, SessionMediasService, $sce) {
                $scope.media = media;
                $scope.result = { success: false };
                $scope.mediaTypes = [];

                $scope.toLoad = 1;
                $scope.loaded = 0;

                $scope.incrementLoad = function () {
                    $scope.loaded++;

                    if ($scope.loaded >= $scope.toLoad) {
                        $('.loading').hide();
                    }
                };

                $scope.init = function () {
                    $('.loading').show();

                    EnumsService.query({ type: 'SessionMediaType' }, function (success) {
                        $scope.mediaTypes = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.getPreviewString = function () {
                    if ($scope.media.content !== undefined && $scope.media.content != null && $scope.media.content.length > 0 && $scope.media.content.includes('.')) {
                        if ($scope.media.content.startsWith("https://") || $scope.media.content.startsWith("http://")) {
                            return $scope.media.content;
                        }
                        else {
                            return "https://" + $scope.media.content;
                        }
                    } else {
                        return '';
                    }
                };

                $scope.getPreview = function () {
                    var previewString = $scope.getPreviewString();
                    if (previewString == '')
                        return '';
                    else
                        return $sce.trustAsResourceUrl(previewString);
                };

                $scope.cancel = function () {
                    $scope.result.success = false;
                    close($scope.result, 100);
                };


                $scope.save = function () {
                    $scope.mediaForm.submitted = true;
                    if ($scope.mediaForm.$valid) {
                        var previewString = $scope.getPreviewString();
                        if (previewString == '') {
                            toastr.clear();
                            toastr.error('It looks like the address is invalid');
                        }
                        else {
                            $scope.media.content = previewString;
                            if ($scope.media.sessionMediaId !== undefined && $scope.media.sessionMediaId != null && $scope.media.sessionMediaId != '') {
                                SessionMediasService.update({ classSessionId: $scope.media.classSessionId, id: $scope.media.sessionMediaId }, $scope.media, function (success) {
                                    $scope.result = success;
                                    $scope.result.success = true;
                                    $('.loading').hide();
                                    close($scope.result, 100);
                                    toastr.success('Save successsful.');
                                }, function (err) {
                                });
                            } else {
                                SessionMediasService.save({ classSessionId: $scope.media.classSessionId }, $scope.media, function (success) {
                                    $scope.result = success;
                                    $scope.result.success = true;
                                    $('.loading').hide();
                                    close($scope.result, 100);
                                    toastr.success('Save successsful.');
                                }, function (err) {
                                });
                            }
                        }
                    }
                };

                $scope.init();
            }
        ]);
})();