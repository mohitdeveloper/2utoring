(function () {
    angular.module('standingOut.services')
        .factory('SafeguardReportsService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    return $resource(API + 'api/safeguardReports/:id', null, {
                        'update': {
                            method: 'PUT',
                            url: API + 'api/safeguardReports/:id'
                        },
                    });
                }
            ]);
})();
