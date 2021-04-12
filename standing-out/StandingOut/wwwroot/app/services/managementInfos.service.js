(function () {
    angular.module('standingOut.services')
        .factory('ManagementInfosService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    var resource = $resource(API + 'api/managementInfos', null, {
                        'dashboard': {
                            method: 'POST',
                            url: API + 'api/managementInfos/dashboard',
                            isArray: false
                        },
                        'courses': {
                            method: 'POST',
                            url: API + 'api/managementInfos/courses',
                            isArray: false
                        },
                    });

                    return resource;

                }
            ]);
})();
