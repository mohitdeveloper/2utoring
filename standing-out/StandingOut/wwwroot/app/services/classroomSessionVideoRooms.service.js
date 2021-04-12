(function () {
    angular.module('standingOut.services')
        .factory('ClassSessionVideoRoomsService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    return $resource(API + 'api/classroom/classsessionvideorooms/:id', null, {
                        'update': {
                            method: 'PUT',
                            url: API + 'api/classroom/classsessionvideorooms/:id'
                        },
                    });
                }
            ]);
})();
