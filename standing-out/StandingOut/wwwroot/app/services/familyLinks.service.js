(function () {
    angular.module('standingOut.services')
        .factory('FamilyLinksService',
        ['$resource', 'API',
            function ($resource, API) {
                var resource = $resource(API + 'api/FamilyLinks/:id', null, {
                        'remove': {
                            method: 'DELETE',
                            url: API + 'api/FamilyLinks/:id',
                            isArray: false
                        },
                        'resend': {
                            method: 'GET',
                            url: API + 'api/FamilyLinks/:id/resend',
                            isArray: false
                        },
                });

                return resource;
            }
        ]);
})();
