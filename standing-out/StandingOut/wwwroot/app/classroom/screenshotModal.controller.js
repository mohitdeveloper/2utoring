(function () {
    angular.module('standingOut.controllers').controller('ScreenshotModalController',
        ['$scope', '$filter', 'close', 'ModalService', 'img', 'SessionDocumentsService', 'ClassSessionsService', 
            function ($scope, $filter, close, ModalService, img, SessionDocumentsService, ClassSessionsService) {
                $scope.result = { success: false };
                $scope.media = {};
                $scope.classSessionId = classSessionId;
                $scope.uploadToDrive = false;
                $scope.placeHolder = 'Screenshot ' + $filter('date')(Date.now(), 'HH-mm-ss dd-MM-yyyy');
                $scope.img = img;

                $scope.cancel = function () {
                    $scope.result.success = false;
                    close($scope.result, 100);
                };

                $scope.init = function () {
                    $scope.uploadToDrive = false;
                    setTimeout(function () {
                        $('#replaceable-img').attr('src', img);
                    }, 500);

                    ClassSessionsService.get({ id: $scope.classSessionId }, function (success) {
                        $scope.classSession = success;
                    }, function (err) {
                    });
                };

                $scope.save = function () {
                    console.log($scope.uploadToDrive);
                    $scope.mediaForm.submitted = true;

                    if ($scope.mediaForm.$valid) {

                        if (img.length > 0) {

                            if ($scope.uploadToDrive) {
                                $('#screenshot-submit').attr("disabled", true);

                                var data = { imageData: img, name: $scope.media.name == null || $scope.media.name == '' ? $scope.placeHolder : $scope.media.name };

                                SessionDocumentsService.uploadScreenshot({ classSessionId: $scope.classSessionId }, data, function (success) {
                                    $scope.result.success = true;
                                    close($scope.result, 100);

                                    toastr.clear();
                                    toastr.success('Saved "' + ($scope.media.name == null || $scope.media.name == '' ? $scope.placeHolder : $scope.media.name) + '" to Drive classroom folder');
                                }, function (err) {
                                        toastr.clear();
                                    toastr.error('Error saving "' + ($scope.media.name == null || $scope.media.name == '' ? $scope.placeHolder : $scope.media.name) + '"');
                                    $('#screenshot-submit').attr("disabled", false);
                                    });
                            }
                            else {
                                var dlLink = document.createElement('a');
                                dlLink.download = $scope.media.name == null || $scope.media.name == '' ? $scope.placeHolder : $scope.media.name;
                                dlLink.href = img;
                                dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');
                                document.body.appendChild(dlLink);
                                dlLink.click();
                                document.body.removeChild(dlLink);

                                $scope.result.success = true;
                                close($scope.result, 100);
                            }
                        }
                    }
                };


                $scope.init();
            }
        ]);
})();