(function () {
    angular.module('standingOut.services')
        .factory('DeleteService', 
        ['ModalService',
            function (ModalService) {
                return {
                    confirm: function (callback) {
                        ModalService.showModal({
                            templateUrl: '/app/delete/delete.html',
                            controller: 'DeleteModalController',
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                callback(result);
                                return;
                            });
                        });
                    }
                };
            }
        ]);
})();