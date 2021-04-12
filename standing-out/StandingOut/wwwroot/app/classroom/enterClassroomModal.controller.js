(function () {
    angular.module('standingOut.controllers').controller('EnterClassroomModalController',
        ['$scope', '$rootScope', '$timeout',
            function ($scope, $rootScope, $timeout) {

                $scope.entered = false;
                $scope.timeCheck = false;
                // The purpose of this modal is to trigger a click from the user
                // The reason for wanting this is that, video and audio may not be played until a user has interacted with a page

                $scope.enter = function () {
                    // This is picked up by the webcam modal and will trigger a join room
                    if ($rootScope.sessionEnded == false) {
                        $rootScope.$broadcast('entryComplete');
                    }
                    $scope.entered = true;
                };




                $scope.init = function () {
                    $timeout(function () {
                        $scope.timeCheck = true;
                    }, 1000);

                    //navigator.mediaDevices.getUserMedia(
                    //    {
                    //        audio: true,
                    //        video: true
                    //    },
                    //    function (success) {
                    //        console.log('success');
                    //    },
                    //    function (fail) {
                    //        console.log('fail');
                    //    });

                };
                $scope.init();
            }
        ]);
})();