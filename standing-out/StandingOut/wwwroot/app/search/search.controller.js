(function () {
    angular.module('standingOut.controllers').controller('SearchController',
        ['$scope', 'SearchService',
            function ($scope, SearchService) {
                $scope.initialFilterTerm = filterTerm;
                $scope.loaded = 0;
                $scope.toLoad = 1;
                $scope.globalData = {};
                $scope.takeData = [{ value: 5, label: 'Show 5' }, { value: 10, label: 'Show 10' }, { value: 20, label: 'Show 20' }, { value: 50, label: 'Show 50' }];
                $scope.globalSearch = { page: 0, take: 10, search: searchTerm, sortType: 'header', order: 'ASC', tutors: true, companies: true };

                $scope.incrementLoad = function () {
                    $scope.loaded++;
                    if ($scope.loaded >= $scope.toLoad) {
                        $('.loading').hide();
                    }
                };

                $scope.init = function () {
                    $('.loading').show();
                    $scope.globalSearch.take = 10;
                    if ($scope.initialFilterTerm == 'tutors') {
                        $scope.globalSearch.companies = false;
                    }
                    else if ($scope.initialFilterTerm == 'organisations') {
                        $scope.globalSearch.tutors = false;
                    }
                    $scope.genericSearch('global');
                };

                $scope.search = function (type) {
                    SearchService.search({ type: type }, $scope.globalSearch, function (success) {
                        $scope.globalData = success;
                        console.log(success);
                        $scope.incrementLoad();
                    }, function (err) {
                    });
                };

                $scope.reloadData = function (type) {
                    $('.loading').show();
                    $scope.search(type);
                };

                $scope.genericPage = function (action, type) {
                    var searchModel = eval('$scope.' + type + 'Search');
                    if (action == 'next') {
                        searchModel.page++;
                    } else if (action == 'back') {
                        searchModel.page--;
                    }
                    $scope.reloadData(type);
                };

                $scope.genericAlterOrder = function (field, type) {
                    var searchModel = eval('$scope.' + type + 'Search');
                    searchModel.sortType = field;
                    if (searchModel.order == 'DESC') {
                        searchModel.order = 'ASC';
                    } else {
                        searchModel.order = 'DESC';
                    }
                    searchModel.page = 0;
                    $scope.reloadData(type);
                };

                $scope.genericSearch = function (type) {
                    var searchModel = eval('$scope.' + type + 'Search');
                    searchModel.page = 0;
                    $scope.reloadData(type);
                };

                $scope.goTo = function (record) {
                    var win = undefined;
                    if (record.globalSearchTypeDisplay == 'Tutor') {
                        win = window.open('/tutors/' + record.id, '_blank');
                        win.focus();
                    } else if (record.globalSearchTypeDisplay == 'Company') {
                        win = window.open('/organisations/' + record.id, '_blank');
                        win.focus();
                    }
                };

                //$scope.tutorClick = function () {
                //    if ($scope.globalSearch.companies == false && $scope.globalSearch.tutors == false) {
                //        $scope.globalSearch.companies = true;
                //    }
                //    $scope.genericSearch('global');
                //};

                //$scope.companyClick = function () {
                //    if ($scope.globalSearch.companies == false && $scope.globalSearch.tutors == false) {
                //        $scope.globalSearch.tutors = true;
                //    }
                //    $scope.genericSearch('global');
                //};

                $scope.init();
            }
        ]);
})();