(function () {
    angular.module('standingOut.services')
        .factory('CompanyTutorsService',
            ['$resource', 'API',
                function ($resource, API) {
                    return $resource(API + 'api/companyTutors/:id', null, {
                        'update': {
                            method: 'PUT',
                            url: API + 'api/companyTutors/:id'
                        },
                        'company': {
                            method: 'GET',
                            url: API + 'api/companyTutors/company/:id',
                            isArray: true
                        },
                        'tutors': {
                            method: 'GET',
                            url: API + 'api/companyTutors/tutors',
                            isArray: true
                        },
                    });
                }
            ]);
})();
