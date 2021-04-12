(function () {
    angular.module('standingOut.services')
        .factory('SessionMediasService',
        ['$resource', 'API',
            function ($resource, API) {
                return $resource(API + 'api/session/:classSessionId/sessionMedias/:id', null, {
                    'update': {
                        method: 'PUT',
                        url: API + 'api/session/:classSessionId/sessionMedias/:id'
                    },
                    'getForClassroom': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionMedias',
                    }
                });
            }
        ]);
})();
