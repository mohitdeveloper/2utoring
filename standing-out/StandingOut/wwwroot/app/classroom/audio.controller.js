﻿(function () {
    angular.module('standingOut.controllers').controller('ClassroomAudioController',
        ['$scope', 'ModalService', 'DeleteService',
            function ($scope, ModalService, DeleteService) {
                $scope.classSessionId = classSessionId;       
                $scope.isOpen = false;
              
                $scope.init = function () {
                };

                $scope.toggle = function () {
                    $scope.isOpen = !$scope.isOpen;
                };

                $scope.init();
            }
        ]);
})();