(function () {
    angular.module('standingOut.services')
        .factory('EnumsService',
        ['$resource', 'API',
            function ($resource, API) {
                return $resource(API + 'api/enums/:type', null, {
                });
            }
        ]);
})();