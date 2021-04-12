(function () {
    angular.module('standingOut.services')
        .factory('AlertPopService', 
        ['ModalService',
            function (ModalService) {
                return {
                    alert: function (title, message, confirmButtons, noText, yesText, callback) {
                        ModalService.showModal({
                            templateUrl: '/app/alertPop/alertPop.html',
                            controller: 'AlertPopModalController',
                            inputs: {
                                title: title,
                                message: message,
                                confirmButtons: confirmButtons,
                                noText: noText,
                                yesText: yesText
                            }
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