(function () {
    angular.module('standingOut.controllers').controller('ManagementInfoController',
        ['$scope', 'ManagementInfosService', 'ClassSessionsService',
            function ($scope, ManagementInfosService, ClassSessionsService) {
                $scope.toLoad = 3;
                $scope.loaded = 0;

                var date = new Date();
                $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
                $scope.endDate = new Date();

                $scope.dashboard = {};
                $scope.dashboardSearch = { startDate: $scope.startDate, endDate: $scope.endDate };
                $scope.sessions = {};
                $scope.sessionsSearch = { page: 1, take: 10, search: '', filter: '', sortType: '', order: '', startDate: $scope.startDate, endDate: $scope.endDate };
                $scope.courses = {};
                $scope.coursesSearch = { page: 1, take: 10, search: '', filter: '', sortType: '', order: '', startDate: $scope.startDate, endDate: $scope.endDate };

                $scope.incrementLoad = function () {
                    $scope.loaded++;
                    if ($scope.loaded >= $scope.toLoad) {
                        $('.loading').hide();
                    }
                };

                $scope.init = function () {
                    $('.loading').show();
                    $scope.loaded = 0;
                    $scope.loadSessions();
                    $scope.loadDashboard();
                    $scope.loadCourses();
                };

                $scope.search = function () {
                    $scope.dashboardSearch.startDate = $scope.startDate;
                    $scope.dashboardSearch.endDate = $scope.endDate;
                    $scope.sessionsSearch.startDate = $scope.startDate;
                    $scope.sessionsSearch.endDate = $scope.endDate;
                    $scope.coursesSearch.startDate = $scope.startDate;
                    $scope.coursesSearch.endDate = $scope.endDate;

                    $scope.init();
                };

                $scope.loadDashboard = function () {
                    ManagementInfosService.dashboard({}, $scope.dashboardSearch, function (success) {
                        $scope.dashboard = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.loadSessions = function () {
                    ClassSessionsService.search({}, $scope.sessionsSearch, function (success) {
                        $scope.sessions = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.loadCourses = function () {
                    ManagementInfosService.courses({}, $scope.coursesSearch, function (success) {
                        $scope.courses = success;
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };


                $scope.nextSessions = function () {
                    $scope.sessionsSearch.page = $scope.sessionsSearch.page + 1;
                    $scope.loadSessions();
                };

                $scope.prevSessions = function () {
                    $scope.sessionsSearch.page = $scope.sessionsSearch.page - 1;
                    $scope.loadSessions();
                };

                $scope.nextCourses = function () {
                    $scope.coursesSearch.page = $scope.coursesSearch.page + 1;
                    $scope.loadCourses();
                };

                $scope.prevCourses = function () {
                    $scope.coursesSearch.page = $scope.coursesSearch.page - 1;
                    $scope.loadCourses();
                }; 

                $scope.init();
            }
        ]);
})();