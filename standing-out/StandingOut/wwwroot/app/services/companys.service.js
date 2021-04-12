(function () {
    angular.module('standingOut.services')
        .factory('CompanysService',
            ['$resource', 'API', 'Upload',
                function ($resource, API, Upload) {
                    var resource = $resource(API + 'api/companys/:id', null, {
                        'update': {
                            method: 'POST',
                            url: API + 'api/companys/:id'
                        },
                    });

                    resource.updateWithImage = function (id, data, success, error) {
                        Upload.upload({
                            url: API + "api/companys/" + id,
                            method: "POST",
                            data: {
                                companyId: data.companyId,
                                name: data.name,
                                header: data.header,
                                subHeader: data.subHeader,
                                biography: data.biography,
                                file: data.file
                            }
                        }).then(function (resp) {
                            success(resp.data);
                        }, function (err) {
                            error(err);
                        }, function (evt) {
                        });
                    };

                    resource.saveWithImage = function (data, success, error) {
                        Upload.upload({
                            url: API + "api/companys",
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
