(function () {
    angular.module('standingOut.services')
        .factory('SessionAttendeesService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    return $resource(API + 'api/classroom/:classSessionId/sessionAttendees/:id', null, {
                        'my': {
                            method: 'GET',
                            url: API + 'api/classroom/:classSessionId/sessionAttendees/my'
                        },
                        'update': {
                            method: 'PUT',
                            url: API + 'api/assets/:id'
                        },
                    });
                }
            ]);
})();
