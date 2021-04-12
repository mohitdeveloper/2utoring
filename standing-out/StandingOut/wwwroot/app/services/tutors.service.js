(function () {
    angular.module('standingOut.services')
        .factory('TutorsService',
        ['$resource', 'API', 'Upload',
            function ($resource, API, Upload) {
                var resource = $resource(API + 'api/Tutors/:id', null, {
                        'update': {
                            method: 'POST',
                            url: API + 'api/Tutors/:id'
                        },
                        'my': {
                            method: 'GET',
                            url: API + 'api/Tutors/my',
                            isArray: false
                        },
                });

                resource.upload = function (data, success, error) {
                    Upload.upload({
                        url: API + "api/tutors/upload", // webapi url
                        method: "POST",
                        data: data
                    }).then(function (resp) {
                        success(resp.data);
                    }, function (err) {
                        error(err);
                    }, function (evt) {
                    });
                };

                return resource;
            }
        ]);
})();
