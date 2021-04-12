(function () {
    angular.module('standingOut.controllers').controller('ClassroomMainController',
        ['$scope', '$rootScope', '$timeout', 'ModalService', 'ClassroomSessionsService', 'SystemToolsService',
            function ($scope, $rootScope, $timeout, ModalService, ClassroomSessionsService, SystemToolsService) {
                $scope.classSessionId = classSessionId;
                $scope.fullScreenForced = false;
                $scope.maximumPanes = 4; // NOT used

                $scope.currentPages = [
                    { type: 'none', show: true, ngInclude: '', fullScreen: false, toolBar: true, id: 1, commandHeld: false },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: 2, commandHeld: false },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: 3, commandHeld: false },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: 4, commandHeld: false }
                ];
                $scope.paneClassList = ['full', 'half', 'thirds', 'quad'];
                $scope.selectedPane = 'full';
                $scope.tools = [];
                $scope.fullScreenOn = false;
                $scope.awaitingWhiteboard = null;
                $scope.awaitingFolder = null;
                $scope.uuIdLookUp = []; for (var i = 0; i < 256; i++) { $scope.uuIdLookUp[i] = (i < 16 ? '0' : '') + (i).toString(16); }
                $scope.heldCommands = [];

                //triggered by header controller view options
                $scope.$on('change_pane', function (event, args) {
                    $scope.changeView(args);
                });

                $scope.toggleToolbar = function (index, paneId) {
                    $scope.currentPages[index].toolBar = !$scope.currentPages[index].toolBar;
                    $rootScope.$broadcast('toggleToolbar', { paneId: paneId, toolBar: $scope.currentPages[index].toolBar });
                };

                $scope.changeView = function (paneSelection, idx, add) {
                    if ($scope.fullScreenOn && !$scope.fullScreenForced) {
                        for (var i = 0; i < $scope.currentPages.length; i++) {
                            if ($scope.currentPages[i].fullScreen) {
                                $scope.currentPages[i].fullScreen = false;
                                break;
                            }
                        }
                        $scope.fullScreenOn = false;
                    }

                    if (idx == undefined || add) {
                        var shouldBeShown = _.findIndex($scope.paneClassList, function (itm, index) { return itm == paneSelection; }) + 1;
                        var currentShownPanes = 0;
                        for (var j = 0; j < $scope.currentPages.length; j++) {
                            if ($scope.currentPages[j].show) {
                                currentShownPanes++;
                            }
                        }

                        if (currentShownPanes > shouldBeShown) {
                            // Remove pane
                            while (currentShownPanes > shouldBeShown) {
                                var paneToGo = undefined;
                                for (var k = 0; k < $scope.currentPages.length; k++) {
                                    if ($scope.currentPages[k].type == 'none' && $scope.currentPages[k].show) {
                                        paneToGo = k;
                                        break;
                                    }
                                }

                                if (paneToGo == undefined) {
                                    for (var a = $scope.currentPages.length - 1; a >= 0; a--) {
                                        if ($scope.currentPages[a].show && $scope.currentPages[a].type != 'webcam') {
                                            paneToGo = a;
                                            break;
                                        }
                                    }
                                }

                                if (paneToGo == currentShownPanes - 1) {
                                    $scope.currentPages[paneToGo].show = false;
                                }
                                else {
                                    $scope.currentPages.push($scope.currentPages.splice(paneToGo, 1)[0]);
                                    $scope.currentPages[$scope.currentPages.length - 1].show = false;
                                }

                                currentShownPanes--;
                            }
                        }
                        else {
                            // Add pane
                            while (currentShownPanes < shouldBeShown) {
                                var paneToAdd = undefined;
                                if (idx == undefined) {
                                    for (var b = 0; b < $scope.currentPages.length; b++) {
                                        if ($scope.currentPages[b].type != 'none' && !$scope.currentPages[b].show) {
                                            paneToAdd = b;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    paneToAdd = idx;
                                }

                                if (paneToAdd == undefined) {
                                    for (var c = 0; c < $scope.currentPages.length; c++) {
                                        if (!$scope.currentPages[c].show) {
                                            paneToAdd = c;
                                            break;
                                        }
                                    }
                                }

                                if (paneToAdd == currentShownPanes - 1) {
                                    $scope.currentPages[paneToAdd].show = true;
                                }
                                else {
                                    $scope.currentPages.splice(currentShownPanes, 0, $scope.currentPages.splice(paneToAdd, 1)[0]);
                                    $scope.currentPages[currentShownPanes].show = true;
                                }

                                currentShownPanes++;
                            }
                        }
                    }
                    else {
                        $scope.currentPages.push($scope.currentPages.splice(idx, 1)[0]);
                        $scope.currentPages[$scope.currentPages.length - 1].show = false;
                    }
                    
                    $scope.selectedPane = paneSelection;
                };

                $scope.setFullscreen = function (idx) {
                    if ($rootScope.checkSessionStart()) {
                        $scope.currentPages[idx].fullScreen = !$scope.currentPages[idx].fullScreen;
                    }
                    $scope.fullScreenOn = $scope.currentPages[idx].fullScreen;
                };

                $scope.fullScreenActive = function () {
                    for (var i = 0; i < $scope.currentPages.length; i++) {
                        if ($scope.currentPages[i].fullScreen) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.uuIdGeneration = function () {
                    var k = ['x', 'x', 'x', 'x', '-', 'x', 'x', '-', '4', 'x', '-', 'y', 'x', '-', 'x', 'x', 'x', 'x', 'x', 'x'];
                    var u = '', i = 0, rb = Math.random() * 0xffffffff | 0;
                    while (i++ < 20) {
                        var c = k[i - 1], r = rb & 0xff, v = c == 'x' ? r : (c == 'y' ? (r & 0x3f | 0x80) : (r & 0xf | 0x40));
                        u += (c == '-') ? c : $scope.uuIdLookUp[v]; rb = i % 4 == 0 ? Math.random() * 0xffffffff | 0 : rb >> 8;
                    }
                    return u;
                };

                $scope.selectTool = function (idx, tool, overrideWarning) {
                    if (!$scope.inUse(tool)) {
                        if ($rootScope.checkSessionStart()) {
                            $scope.currentPages[idx] = {
                                type: tool.name,
                                show: $scope.currentPages[idx].show,
                                ngInclude: tool.ngInclude,
                                fullScreen: $scope.currentPages[idx].fullScreen,
                                id: $scope.uuIdGeneration()
                            };
                        }
                    }
                };

                $scope.currentPages = [
                    { type: 'none', show: true, ngInclude: '', fullScreen: false, toolBar: true, id: $scope.uuIdGeneration() },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: $scope.uuIdGeneration() },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: $scope.uuIdGeneration() },
                    { type: 'none', show: false, ngInclude: '', fullScreen: false, toolBar: true, id: $scope.uuIdGeneration() }
                ];

                // This is when a file is attempted to be imported into a whiteboard from google drive
                $scope.$on("WhiteboardAvailableForImportFromFile", function (event, data) {
                    // First we need to see if there is a whiteboard tab THAT IS SHOWING
                    for (var i = 0; i < $scope.currentPages.length; i++) {
                        if ($scope.currentPages[i].show && $scope.currentPages[i].type == 'Whiteboard') {
                            // There is one, wooo, continue to the whiteboard controller for checks
                            $rootScope.$broadcast("WhiteboardAvailableForImportFromHeader", data);
                            return;
                        }
                    }
                    // There isn't - inform the user and send a response
                    toastr.clear();
                    toastr.error('A whiteboard must be open to import from Google drive into');
                    $rootScope.$broadcast("WhiteboardAvailableForImportResponse", { importAvailable: false });
                });

                // Gets pane ='full', 'half', 'thirds', 'quad'
                $scope.changePaneFile = function (pane) {
                    debugger;
                    if ($rootScope.checkSessionStart()) {
                        ClassroomSessionsService.updateChangePaneListeners(pane);
                    }
                };

                $scope.deselectTool = function (idx, tool, overrideWarning) {
                    if (tool == 'none') {

                        if ($scope.selectedPane == 'quad') {
                            $scope.changeView('thirds', idx);
                        }
                        else if ($scope.selectedPane == 'thirds') {
                            $scope.changeView('half', idx);
                        }
                        else if ($scope.selectedPane == 'half') {
                            $scope.changeView('full', idx);
                        }
                    }
                    else if (tool == 'webcam') {
                        $rootScope.$broadcast('webcamPaneClosed', {});
                    }
                    else {
                        var requiresWarning = false;
                        for (var i = 0; i < $scope.tools.length; i++) {
                            if ($scope.tools[i].name == tool) {
                                if ($scope.tools[i].exitWarning) {
                                    requiresWarning = true;
                                }
                                break;
                            }
                        }

                        if (overrideWarning || !requiresWarning) {
                            $scope.deselectToolLogic(idx);
                        }
                        else {
                            ModalService.showModal({
                                templateUrl: '/app/classroom/panelExitModal.html',
                                controller: 'PanelExitModalController'
                            }).then(function (modal) {
                                modal.close.then(function (result) {
                                    if (result) {
                                        $scope.deselectToolLogic(idx);
                                    }
                                });
                            });
                        }
                    }
                };

                $scope.deselectToolLogic = function (idx) {
                    $scope.currentPages[idx].type = 'none';
                    $scope.currentPages[idx].ngInclude = '';
                    var loader = document.getElementById('loader_' + $scope.currentPages[idx].id);
                    loader.style.display = 'none';
                };

                $scope.inUse = function (tool) {
                    var idx = _.findIndex($scope.currentPages, function (itm, index) { return itm.type == tool.name; });
                    if (idx > -1 && tool.allowMultiple === false) {
                        return true;
                    } else {
                        return false;
                    }
                };

                $scope.init = function () {

                    if (performance.navigation.type == 2) {
                        location.reload(true);
                    }

                    SystemToolsService.query({ classSessionId: $scope.classSessionId }, function (success) {
                        $scope.tools = success;
                    }, function (err) {
                    });
                };

                $scope.$on('forceFullScreen', function (event, data) {
                    $scope.fullScreenForced = data.forceMode;
                    $scope.currentPages[data.index].fullScreen = data.forceMode;
                });

                $scope.$on('callInPane', function (event, data) {
                    $scope.currentPages[data.paneIndex].type = 'none';
                    $scope.currentPages[data.paneIndex].ngInclude = '';
                    $scope.currentPages[data.paneIndex].type = 'webcam';
                });

                $scope.$on('callOutPane', function (event, data) {
                    $scope.currentPages[data.paneIndex].type = 'none';
                });

                /*************** WHITEBOARD START ***************/

                $scope.$on('openTutorCommandWhiteboard', function (event, data) {
                    var paneSet = false;
                    var paneVisible = true;
                    var indexToUse = -1;
                    for (var k = 0; k < $scope.currentPages.length; k++) {
                        if ($scope.currentPages[k].type == 'Whiteboard') {
                            paneSet = true;
                            if (!$scope.currentPages[k].show) {
                                paneVisible = false;
                                indexToUse = k;
                            }
                            break;
                        }
                    }

                    if (paneSet) {
                        if (!paneVisible) {
                            $scope.changeView($scope.paneClassList[$scope.paneClassList.indexOf($scope.selectedPane) + 1], indexToUse, true);
                        }
                        $rootScope.$broadcast('openMainWhiteboard', data);
                    }
                    else {
                        for (var i = 0; i < $scope.currentPages.length; i++) {
                            if ($scope.currentPages[i].type == 'none' || !$scope.currentPages[i].show) {
                                for (var j = 0; j < $scope.tools.length; j++) {
                                    if ($scope.tools[j].name == 'Whiteboard') {
                                        paneSet = true;
                                        if (!$scope.currentPages[i].show) {
                                            indexToUse = i;
                                            paneVisible = false;
                                        }
                                        $scope.currentPages[i].type = 'Whiteboard';
                                        $scope.currentPages[i].ngInclude = $scope.tools[j].ngInclude;
                                        break;
                                    }
                                }
                                break;
                            }
                        }

                        if (paneSet) {
                            if (!paneVisible) {
                                $scope.paneClassList.indexOf($scope.selectedPane);
                                $scope.changeView($scope.paneClassList[$scope.paneClassList.indexOf($scope.selectedPane) + 1], indexToUse, true);
                            }
                            $scope.awaitingWhiteboard = data;
                        }
                        else {
                            toastr.clear();
                            toastr.error('Please close a pane to use this tool');
                        }
                    }
                });

                $scope.$on('whiteboardPaneLoaded', function () {
                    if ($scope.awaitingWhiteboard != null) {
                        $rootScope.$broadcast('openMainWhiteboard', $scope.awaitingWhiteboard);
                        $scope.awaitingWhiteboard = null;
                    }
                });

            /*************** WHITEBOARD END ***************/

            /*************** AWAITED COMMAND START ***************/

                $scope.$on('awaitedCommand', function (event, data) {
                    for (var i = $scope.heldCommands.length - 1; i >= 0; i--) {
                        if ($scope.heldCommands[i].paneId == data.paneId) {
                            $rootScope.$broadcast($scope.heldCommands[i].commandName, $scope.heldCommands[i].data);
                            $scope.heldCommands.splice(i, 1);
                        }
                    }
                });

            /***************  AWAITED COMMAND END ***************/

                /*************** FILE START ***************/

                $scope.$on('openTutorCommandFolder', function (event, data) {
                    var paneSet = false;
                    var paneVisible = true;
                    var indexToUse = -1;

                    for (var i = 0; i < $scope.currentPages.length; i++) {
                        if ($scope.currentPages[i].type == 'none' || !$scope.currentPages[i].show) {
                            for (var j = 0; j < $scope.tools.length; j++) {
                                if ($scope.tools[j].name == 'File') {
                                    paneSet = true;
                                    indexToUse = i;
                                    localStorage.setItem("idx", i);
                                    if (!$scope.currentPages[i].show) {
                                        paneVisible = false;
                                    }
                                    $scope.currentPages[i] = {
                                        type: 'File',
                                        show: $scope.currentPages[i].show,
                                        ngInclude: $scope.tools[j].ngInclude,
                                        fullScreen: $scope.currentPages[i].fullScreen,
                                        id: $scope.uuIdGeneration()
                                    };
                                    if (data.userId != null || data.command == 'openSharedFolder') {
                                        // Hold command here for when file system has started up
                                        $scope.heldCommands.push({ commandName: data.command, paneId: $scope.currentPages[i].id, data: { userId: data.userId, paneId: $scope.currentPages[i].id } });
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    if (paneSet != true) {
                        for (var k = 0; k < $scope.currentPages.length; k++) {
                            if ($scope.currentPages[k].type == 'File') {
                                paneSet = true;
                                indexToUse = k;
                                if (!$scope.currentPages[k].show) {
                                    paneVisible = false;
                                }
                                break;
                            }
                        }
                    }                    

                    if (paneSet) {
                        if (!paneVisible) {
                            $scope.changeView($scope.paneClassList[$scope.paneClassList.indexOf($scope.selectedPane) + 1], indexToUse, true);
                        }
                        $rootScope.$broadcast(data.command, { userId: data.userId, paneId: $scope.currentPages[indexToUse].id });
                    }
                    else {
                        for (var i = 0; i < $scope.currentPages.length; i++) {
                            if ($scope.currentPages[i].type == 'none' || !$scope.currentPages[i].show) {
                                for (var j = 0; j < $scope.tools.length; j++) {
                                    if ($scope.tools[j].name == 'File') {
                                        paneSet = true;
                                        indexToUse = i;
                                        if (!$scope.currentPages[i].show) {
                                            paneVisible = false;
                                        }
                                        $scope.currentPages[i] = {
                                            type: 'File',
                                            show: $scope.currentPages[i].show,
                                            ngInclude: $scope.tools[j].ngInclude,
                                            fullScreen: $scope.currentPages[i].fullScreen,
                                            id: $scope.uuIdGeneration()
                                        };
                                        if (data.userId != null || data.command == 'openSharedFolder') {
                                            // Hold command here for when file system has started up
                                            $scope.heldCommands.push({ commandName: data.command, paneId: $scope.currentPages[i].id, data: { userId: data.userId, paneId: $scope.currentPages[i].id } });
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }

                        if (paneSet) {
                            if (!paneVisible) {
                                $scope.paneClassList.indexOf($scope.selectedPane);
                                $scope.changeView($scope.paneClassList[$scope.paneClassList.indexOf($scope.selectedPane) + 1], indexToUse, true);
                            }
                        }
                        else {
                            toastr.clear();
                            toastr.error('Please close a pane to use this tool');
                        }
                    }
                });

                /*************** FILE END ***************/

                $scope.init();
            }
        ]);
})();