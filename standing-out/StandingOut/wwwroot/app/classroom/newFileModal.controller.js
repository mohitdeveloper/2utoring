(function () {
    angular.module('standingOut.controllers').controller('NewFileModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'classSessionId', 'fileType', 'folderId', 'SessionDocumentsService',
            function ($scope, $log, $sce, close, ModalService, classSessionId, fileType, folderId, SessionDocumentsService) {
                $scope.classSessionId = classSessionId;
                $scope.name = Date().toString() + '_' + fileType;
                $scope.folderId = folderId;
                $scope.fileType = fileType;

                $scope.cancel = function () {
                    close(false, 100);
                };

                $scope.init = function () {

                };

                $scope.tempHidePopup = function () {
                    document.getElementById('newFilePopup').style.display = 'none';
                };
                $scope.tempShowPopup = function () {
                    document.getElementById('newFilePopup').style.display = 'block';
                };

                $scope.save = function (index) {
                    $scope.tempHidePopup();
                    SessionDocumentsService.createGoogleFile({ classSessionId: classSessionId }, { folderId: $scope.folderId, fileType: $scope.fileType, name: $scope.name }, function (success) {
                        toastr.clear();
                        toastr.success('New ' + fileType + ' created.');
                        close(true, 100);
                    }, function (err) {
                            toastr.clear();
                            toastr.error('Error creating new ' + $scope.fileType + '.');
                            close(true, 100);
                    });
                };

                $scope.init();
            }
        ]);
})();