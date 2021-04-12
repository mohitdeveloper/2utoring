(function () {
    angular.module('standingOut.services')
        .factory('SessionDocumentsService',
            ['$resource', 'API', 'Upload',
                function ($resource, API, Upload) {
                    // NOTE -> SOME METHODS REQUIRE THE HUBURL AS THEY NEED A RESPONSE AND USAGE OF THE HUBS
                    var resource = $resource(API + 'api/session/:classSessionId/SessionDocuments/:id', null, {
                        'update': {
                            method: 'PUT',
                            url: API + 'api/session/:classSessionId/SessionDocuments/:id'
                        },
                        'getForSetup': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments',
                        },
                        'getForClassroom': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments?studentId=:studentId',
                        },
                        'getForSetupByFolderSame': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments/navigation/same/:folderId',
                        },
                        'getForClassroomByFolderSame': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/navigation/same/:folderId',
                        },
                        'getForSetupByFolderDown': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments/navigation/down/:folderId',
                        },
                        'getForClassroomByFolderDown': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/navigation/down/:folderId',
                        },
                        'getForSetupByFolderUp': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments/navigation/up/:folderId',
                        },
                        'getForClassroomByFolderUp': {
                            method: 'GET',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/navigation/up/:folderId',
                        },
                        'postForSetupByFolderPage': {
                            method: 'POST',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments/navigation/page/:folderId',
                        },
                        'postForClassroomByFolderPage': {
                            method: 'POST',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/navigation/page/:folderId',
                        },
                        'uploadScreenshot': {
                            method: 'POST',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/screenshot',
                        },
                        'deleteFromSetup': {
                            method: 'DELETE',
                            isArray: false,
                            url: API + 'api/session/:classSessionId/SessionDocuments/:id/delete',
                        },
                        'getAttendeesForFileSetup': {
                            method: 'GET',
                            url: API + 'api/session/:classSessionId/SessionDocuments/getAttendeesForFileSetup/:fileId',
                            isArray: true
                        },
                        'getAttendeesForFileSetupUpload': {
                            method: 'GET',
                            url: API + 'api/session/:classSessionId/SessionDocuments/getAttendeesForFileUpload',
                            isArray: true
                        },
                        'getMasterFilePermission': {
                            method: 'GET',
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/getMasterFilePermission/:fileId?folderId=:folderId',
                            isArray: true
                        },

                        'shareFileUploadSetup': {
                            method: 'POST',
                            url: API + 'api/session/:classSessionId/SessionDocuments/shareFileUpload',
                            isArray: false
                        },
                        'deleteFromClassroom': {
                            method: 'DELETE',
                            isArray: false,
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/delete/:id',
                        },
                        'getAttendeesForFileUpload': {
                            method: 'GET',
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/getAttendeesForFileUpload',
                            isArray: true
                        },
                        'shareFileUpload': {
                            method: 'POST',
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/shareFileUpload',
                            isArray: false
                        },
                        'getPermissions': {
                            method: 'GET',
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/getPermissions/:fileId?folderId=:folderId',
                            isArray: true
                        },
                        'updatePermissions': {
                            headers: { 'Authorization': 'Bearer ' + accessToken },
                            method: 'POST',
                            url: hubUrl + '/api/classroom/:classSessionId/SessionDocuments/updatePermissions',
                            isArray: false
                        },
                        'createGoogleFile': {
                            method: 'POST',
                            url: API + 'api/classroom/:classSessionId/SessionDocuments/createGoogleFile',
                            isArray: false
                        },
                    });

                    resource.uploadFromClassroom = function (data, id, folderId, success, error) {
                        Upload.upload({
                            url: API + "api/classroom/" + id + '/SessionDocuments/upload/' + folderId,
                            method: "POST",
                            data: data
                        }).then(function (resp) {
                            success(resp.data);
                        }, function (err) {
                            error(err);
                        }, function (evt) {
                        });
                    };

                    resource.upload = function (data, id, folderId, success, error) {
                        Upload.upload({
                            url: API + "api/session/" + id + '/SessionDocuments/upload/' + folderId,
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
