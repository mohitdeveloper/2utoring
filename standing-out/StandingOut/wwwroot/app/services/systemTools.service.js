(function () {
    angular.module('standingOut.services')
        .factory('SystemToolsService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    var resource = $resource(API + 'api/classroom/systemtools/:id', null, {
                        'query': {
                            method: 'GET',
                            isArray: true,
                            url: API + 'api/classroom/systemtools/:classSessionId',
                        },

                    });

                    return resource;
                }
            ]);
})();
