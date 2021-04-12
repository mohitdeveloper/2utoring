(function () {
    angular.module('standingOut.services')
        .factory('SearchService',
            ['$resource', 'API',
                function ($resource, API) {
                    return $resource(API + 'api/search/:id', null, {
                        'search': {
                            method: 'POST',
                            url: API + 'api/search/:type',
                            isArray: false
                        },
                    });
                }
            ]);
})();
