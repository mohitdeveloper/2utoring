(function () {
    angular.module('standingOut.services')
        .factory('ClassroomSessionsService',
            ['$resource', 'API', '$rootScope',
                function ($resource, API, $rootScope) {
                    var resource = $resource(API + 'api/classroom/sessions/:id', null, {
                        'update': {
                            method: 'PUT',
                            url: API + 'api/assets/:id'
                        },
                        'startRecording': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/startrecording/:classSessionId', // Api endpoint doesn't exist
                            isArray: false
                        },
                        'stopRecording': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/stoprecording/:classSessionId', // Api endpoint doesn't exist
                            isArray: false
                        },
                        'getTwilioKey': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/GetTwilioKey',
                            isArray: false
                        },
                        // New call to get keys based on Session Id (whether to have recording or not)
                        'getTwilioKeyByClassSession': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/getTwilioKeyByClassSession/:classSessionId',
                            isArray: false
                        },
                        'getAvailableGroups': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/getAvailableGroups/:classSessionId',
                            isArray: true
                        },
                        'getUserDetails': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/GetUserDetails/:id',
                            isArray: false
                        },
                        'endSession': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/EndSession/:classSessionId',
                            isArray: false
                        },
                        'startSession': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/StartSession/:classSessionId',
                            isArray: false
                        },
                        'cancelSession': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/CancelLesson/:classSessionId',
                            isArray: false
                        },
                        'getAllChatPermission': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/GetAllChatPermission/:classSessionId',
                            isArray: false
                        },
                        'getWebcamGroup': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/WebcamGroup/:groupId'
                        },
                        'getWebcamGroups': {
                            method: 'GET',
                            url: API + 'api/classroom/sessions/:classSessionId/webcamGroups',
                            isArray: false
                        }
                    });


                    resource.updateInitListeners = function () {
                        $rootScope.$broadcast('init_complete');
                    };

                    resource.broadcastSessionStart = function () {
                        $rootScope.$broadcast('session_start');
                    };

                    resource.broadcastSessionEnd = function () {
                        $rootScope.$broadcast('session_end');
                    };

                    resource.updateChangePaneListeners = function (pane) {
                        $rootScope.$broadcast('change_pane', pane);
                    };

                    resource.broadcastScreenshotTaken = function () {
                        $rootScope.$broadcast('screenshotTaken');
                    };

                    return resource;

                }
            ]);
})();
