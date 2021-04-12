(function () {
    angular.module('standingOut.services')
        .factory('SessionMessagesService',
        ['$resource', 'API',
            function ($resource, API) {
                return $resource(API + 'api/session/:classSessionId/SessionMessages/:id', null, {                    
                    'getChatroomInstances': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/SessionMessages/Chatrooms'
                    },
                    'getChatPermissions': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/SessionMessages/ChatPermissions/:userId'
                    },
                    'getGroupInstance': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/SessionMessages/GroupInstance/:groupId'
                    }
                });
            }
        ]);
})();
