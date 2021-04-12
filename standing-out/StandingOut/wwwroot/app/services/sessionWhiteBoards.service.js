(function () {
    angular.module('standingOut.services')
        .factory('SessionWhiteBoardsService',
        ['$resource', 'API', 'Upload',
            function ($resource, API, Upload) {
                // NOTE -> SOME METHODS REQUIRE THE HUBURL AS THEY NEED A RESPONSE AND USAGE OF THE HUBS
                var resource = $resource(API + 'api/classroom/:classSessionId/sessionWhiteBoards/:id', null, {
                    'update': {
                        method: 'PUT',
                        url: API + 'api/session/:classSessionId/sessionWhiteBoards/:id'
                    },
                    'getMyWhiteBoards': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getMyWhiteBoards',
                    },
                    'createIndividualBoard': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/createIndividualBoard',
                    },
                    'addCommand': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/addCommand',
                    },
                    'toggleLock': {
                        method: 'PUT',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/toggleLock/:sessionWhiteBoardId'
                    },
                    'addLoadCommand': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/:sessionWhiteBoardId/addLoadCommand',
                    },
                    'undo': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/undo',
                    },
                    'redo': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/redo',
                    },
                    'clear': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/clear',
                    },
                    'getMySavedWhiteBoards': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getMySavedWhiteBoards'
                    },
                    'getLoadData': {
                        method: 'POST',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getLoadData'
                    },
                    'setInactive': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/setInactive'
                    },
                    'openIndividualBoard': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/openIndividualBoard/:sessionWhiteBoardSaveId',
                    },
                    'openInactiveBoard': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/openInactiveBoard/:sessionWhiteBoardId',
                    },
                    'getUsersForShare': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getUsersForShare',
                    },
                    'share': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/share/:individual',
                    },
                    'getSharedBoard': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getSharedBoard',
                    },
                    'getMySharedWhiteBoards': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getMySharedWhiteBoards',
                    },
                    'getMyInactiveWhiteboards': {
                        method: 'GET',
                        isArray: true,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getMyInactiveWhiteboards',
                    },
                    'getWhiteBoardsForCollaborate': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getWhiteBoardsForCollaborate',
                    },
                    'getWhiteBoardForCollaboration': {
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        method: 'GET',
                        isArray: false,
                        url: hubUrl + '/api/classroom/:classSessionId/sessionWhiteBoards/getWhiteBoardForCollaboration',
                    }, 
                    'tutorStoppedCollaborating': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/tutorStoppedCollaborating/:sessionWhiteBoardId',
                    },
                    'alterSize': {
                        method: 'POST',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/alterSize/:sizeX/:sizeY',
                    },
                    'getImage': {
                        method: 'GET',
                        isArray: false, 
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/getImage/:sessionWhiteBoardId/:fileName',
                    },
                    'deleteSavedWhiteboard': {
                        method: 'DELETE',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/sessionWhiteBoardSaves/:sessionWhiteBoardSaveId'
                    },
                    'getGroupWhiteBoard': {
                        method: 'GET',
                        isArray: false,
                        url: API + 'api/classroom/:classSessionId/sessionWhiteBoards/sessionGroup/:sessionGroupId'
                    },
                    'importFromDrive': {
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        method: 'POST',
                        isArray: false,
                        url: hubUrl + '/api/classroom/:classSessionId/sessionWhiteBoards/importFromDrive/:sessionWhiteBoardId'
                    },
                    'changeName': {
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        method: 'POST',
                        isArray: false,
                        url: hubUrl + '/api/classroom/:classSessionId/sessionWhiteBoards/:sessionWhiteBoardId/name'
                    }
                });

                resource.save = function (data, name, sizeX, sizeY, classSessionId, sessionWhiteBoardId, success, error) {
                    Upload.upload({
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        url: hubUrl + '/api/classroom/' + classSessionId + '/SessionWhiteBoards/' + sessionWhiteBoardId + '/save',
                        method: "POST",
                        data: {
                            name: name,
                            imageData: data,
                            sizeX,
                            sizeY
                        }
                    }).then(function (resp) {
                        success(resp.data);
                    }, function (err) {
                        error(err);
                    }, function (evt) {
                    });
                };

                resource.exportToDrive = function (data, name, classSessionId, userId, success, error) {
                    Upload.upload({
                        url: API + 'api/classroom/' + classSessionId + '/SessionWhiteBoards/exportWhiteBoard/' + userId,
                        method: "POST",
                        data: {
                            name: name,
                            imageData: data
                        }
                    }).then(function (resp) {
                        success(resp.data);
                    }, function (err) {
                        error(err);
                    }, function (evt) {
                    });
                };

                resource.uploadImage = function (data, classSessionId, sessionWhiteBoardId, sizeX, sizeY, success, error) {
                    Upload.upload({
                        headers: { 'Authorization': 'Bearer ' + accessToken },
                        url: hubUrl + '/api/classroom/' + classSessionId + '/sessionWhiteBoards/uploadImage/' + sessionWhiteBoardId + '/' + sizeX + '/' + sizeY,
                        method: 'POST',
                        data: data
                    }).then(function (resp) {
                        success(resp);
                    }, function (err) {
                        error(err);
                    }, function (evt) {

                    });
                };

                resource.uploadToWhiteBoard = function (data, classSessionId, sessionWhiteBoardId, userId, sizeX, sizeY, success, error) {
                    Upload.upload({
                        url: API + 'api/classroom/' + classSessionId + '/sessionWhiteBoards/uploadToWhiteBoard/' + sessionWhiteBoardId + '/' + userId + '/' + sizeX + '/' + sizeY,
                        method: 'POST',
                        data: data
                    }).then(function (resp) {
                        success(resp);
                    }, function (err) {
                        error(err);
                    }, function (evt) {

                    });
                };

                return resource;
            }
        ]);
})();
