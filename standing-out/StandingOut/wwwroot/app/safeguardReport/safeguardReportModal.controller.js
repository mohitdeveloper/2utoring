(function () {
    angular.module('standingOut.controllers').controller('SafeguardReportModalController',
        ['$scope', '$log', 'close', 'SafeguardReportsService', 'ClassSessionsService', 'safeguardReport',
            function ($scope, $log, close, SafeguardReportsService, ClassSessionsService, safeguardReport) {
                $scope.result = { success: false };
                $scope.classSessionDisabled = false;
                $scope.safeguardReport = safeguardReport;
                $scope.saveDisabled = false;

                $scope.init = function () {
                    $('.loading').show();

                    if (safeguardReport.classSessionId != undefined) {
                        $scope.classSessionDisabled = true;
                    }

                    ClassSessionsService.lastMonth({}, function (success) {
                        $scope.classSessions = success;
                        $('.loading').hide();
                    }, function (err) {
                    });
                };

                $scope.formatDate = function (item) {
                    var itemDate = new Date(item);
                    var month = (itemDate.getMonth() + 1).toString();
                    var day = itemDate.getDate().toString();
                    var year = itemDate.getFullYear();

                    return [day.length < 2 ? '0' + day : day, month.length < 2 ? '0' + month : month, year].join('/');
                };

                $scope.save = function () {
                    $scope.safeguardReportForm.submitted = true;
                    $scope.saveDisabled = true;
                    if ($scope.safeguardReportForm.$valid) {
                        $('.loading').show();
                        SafeguardReportsService.save({}, $scope.safeguardReport, function (success) {
                            $scope.result.safeguardReport = success;
                            toastr.success('Your report has been submitted successfully.');
                            $('.loading').hide();
                            $scope.result.success = true;
                            close($scope.result, 100);
                        }, function (err) {
                            $scope.saveDisabled = false;
                            toastr.error('Save Unsuccessful');
                            $('.loading').hide();
                        });
                    }
                    else {
                        $scope.saveDisabled = false;
                    }
                };

                $scope.cancel = function () {
                    close($scope.result, 100);
                };

                $scope.init();
            }
        ]);
})();