(function () {
    angular.module('standingOut.controllers').controller('WhiteboardImportModalController',
        ['$scope', '$log', '$sce', 'close', 'ModalService', 'SessionWhiteBoardsService',
            function ($scope, $log, $sce, close, ModalService, SessionWhiteBoardsService) {

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init = function () {
                };

                $scope.setFiles = function (files) {
                    if (files.length > 0) {
                        $scope.validateFiles({ file: files[0] });
                    }
                };

                $scope.validateFiles = function (data) {
                    console.log(data);
                    var fileSize = +data.file.size / +1024;
                    var maxSize = 500;//500kb



                    if ((data.file.type == 'application/pdf' || data.file.type == 'image/png' || data.file.type == 'image/jpeg' || data.file.type == 'image/jpg' || data.file.type == 'image/bmp') && fileSize <= maxSize) {
                        close(data, 100);
                    }
                    else {
                        toastr.clear();

                        if (fileSize > maxSize) {
                            toastr.error('Sorry! This picture file is too large. Images should be less than 500kb to add to the whiteboard.');
                        } else {
                            toastr.error('File type not supported (Supported - png, jpeg, bmp, pdf)');
                        }                        
                    }
                };

                $scope.init();
            }
        ]);
})();