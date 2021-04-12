(function () {
    angular.module('standingOut.services')
        .factory('ClassSessionsService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    var resource = $resource(API + 'api/classSession/:id', null, {
                        'upcomingSessions': {
                            method: 'POST',
                            url: API + 'api/classSession/upcomingSessions',
                            isArray: false
                        },
                        'previousSessions': {
                            method: 'POST',
                            url: API + 'api/classSession/previousSessions',
                            isArray: false
                        },
                        'search': {
                            method: 'POST',
                            url: API + 'api/classSession/search',
                            isArray: false
                        },
                        'lastMonth': {
                            method: 'GET',
                            url: API + 'api/classSession/lastMonth',
                            isArray: true
                        },
                    });

                    return resource;

                }
            ]);
})();
