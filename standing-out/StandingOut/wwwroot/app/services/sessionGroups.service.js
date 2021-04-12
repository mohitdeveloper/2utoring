(function () {
    angular.module('standingOut.services')
        .factory('SessionGroupsService',
        ['$resource', 'API',
            function ($resource, API) {
                // NOTE -> SOME METHODS REQUIRE THE HUBURL AS THEY NEED A RESPONSE AND USAGE OF THE HUBS
                return $resource(API + 'api/session/:classSessionId/SessionGroups/:id', null, {
                    'update': {
                        method: 'PUT',
                        url: API + 'api/session/:classSessionId/SessionGroups/:id'
                    },
                    'getDraggable': {
                        method: 'GET',
                        url: API + 'api/session/:classSessionId/SessionGroups/:id/Draggable',
                        isArray: true
                    },
                    'move': {
                        method: 'PUT',
                        url: API + 'api/session/:classSessionId/SessionGroups/Move/:sessionAttendeeId'
                    },
                    'getTutorCommandGroups': {
                        method: 'GET',
                        //isArray: true,
                        url: API + 'api/classroom/:classSessionId/SessionGroups/TutorCommand'
                    },
                    'addGroup': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/SessionGroups'
                    },
                    'removeGroup': {
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        method: 'DELETE',
                        isArray: false,
                        url: hubUrl + '/api/classroom/:classSessionId/SessionGroups/:sessionGroupId',
                    }, 
                });
            }
        ]);
})();
