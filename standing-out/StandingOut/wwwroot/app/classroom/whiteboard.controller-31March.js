(function () {
    angular.module('standingOut.controllers').controller('WhiteboardController',
        ['$scope', '$timeout', '$rootScope', '$filter', 'ModalService', 'DeleteService', 'SessionGroupsService', 'SessionWhiteBoardsService', 'ClassSessionsService',
            function ($scope, $timeout, $rootScope, $filter, ModalService, DeleteService, SessionGroupsService, SessionWhiteBoardsService, ClassSessionsService) {
                //$scope.accessToken = accessToken;


                $scope.classSessionId = classSessionId;
                $scope.userId = userId;
                $scope.hubUrl = hubUrl;
                $scope.globalWidth = 0;
                $scope.globalHeight = 0;
                $scope.individualTabs = 0;
                $scope.isTutor = isTutor == 'True' ? true : false;
                $scope.loader = null;

                $scope.defaultWidth = 2000;
                $scope.defaultHeight = 2000;

                $scope.whiteboardConnection = new signalR.HubConnectionBuilder()
                    .withUrl($scope.hubUrl + '/hubs/whiteboard', {
                        accessTokenFactory: () => {
                            // Get and return the access token.
                            // This function can return a JavaScript Promise if asynchronous
                            // logic is required to retrieve the access token.
                            return accessToken;
                        }
                    })
                    .build();

                $scope.openRootFolder = function () {
                    $rootScope.$broadcast('openTutorCommandFolder', { userId: null, command: 'openMainFolder' });
                };

                $scope.whiteboardConnection.onclose(function () {
                    $rootScope.$broadcast('signalRDisconnect');
                });

                $scope.savedWhiteBoards = [];
                $scope.tabIndex = 0;
                $scope.zoomSet = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];
                $scope.marginOffset = 0;
                $scope.uuIdLookUp = []; for (var i = 0; i < 256; i++) { $scope.uuIdLookUp[i] = (i < 16 ? '0' : '') + (i).toString(16); }
                $scope.allWhiteboardActive = true;
                $scope.groupWhiteboardActive = true;
                $scope.lastPing = null;
                $scope.pingSpacing = 1000 * 60 * 10;
                $scope.pingBuffer = $scope.pingSpacing + (1000 * 20);

                $scope.init = function (paneId, toolBar) {
                    $scope.paneId = paneId;
                    $scope.loader = document.getElementById('loader_' + paneId);
                    $scope.toolBar = toolBar;
                    var canvasContainer = $('#pane-controls');
                    $scope.showLoader();
                    //SessionWhiteBoardsService.getMyWhiteBoards({ classSessionId: $scope.classSessionId, sizeX: canvasContainer[0].offsetWidth - (56 + $scope.marginOffset), sizeY: canvasContainer[0].offsetHeight - (26 + 39/*38.5*/ + 56 + 56 + $scope.marginOffset) }, function (success) {
                    SessionWhiteBoardsService.getMyWhiteBoards({ classSessionId: $scope.classSessionId, sizeX: $scope.defaultWidth, sizeY: $scope.defaultHeight }, function (success) {
                        $scope.whiteboardTabs = success;
                        $timeout(function () {
                            $(document).ioTabs();
                            $scope.createColourPickers();
                            for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                if ($scope.whiteboardTabs[i] != null) {
                                    $scope.embelishWhiteboardTab(i);
                                }
                            }
                            $rootScope.$broadcast('whiteboardPaneLoaded');
                            $scope.hideLoader();
                        }, 50);

                        $scope.whiteboardConnection.start().then(function () {
                            var sessionWhiteBoardIds = [$scope.classSessionId];
                            for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                sessionWhiteBoardIds.push($scope.whiteboardTabs[i].sessionWhiteBoardId)
                            }
                            $scope.whiteboardConnection.invoke('connect', sessionWhiteBoardIds);
                            $scope.extendPing();
                            $scope.setupPing($scope.pingSpacing);
                        }).catch(function (err) {
                            //failed to connect
                            return console.error(err.toString());
                        });

                    }, function (err) {
                    });

                    ClassSessionsService.get({ id: $scope.classSessionId }, function (success) {
                        $scope.classSession = success;
                    }, function (err) {
                    });
                };

                $scope.showLoader = function () {
                    $scope.loader.style.display = 'block';
                };
                $scope.hideLoader = function () {
                    $scope.loader.style.display = 'none';
                };

                $scope.connectToWhiteBoard = function (sessionWhiteBoardId) {
                    $scope.whiteboardConnection.invoke('connect', [sessionWhiteBoardId]);
                    $scope.extendPing();
                };

                $scope.disconnectFromWhiteBoard = function (sessionWhiteBoardId) {
                    $scope.whiteboardConnection.invoke('disconnect', [sessionWhiteBoardId]);
                    $scope.extendPing();
                };

                $scope.extendPing = function () {
                    $scope.lastPing = new Date();
                };

                $scope.setupPing = function (toTimeout) {
                    $timeout(function () {
                        if ((new Date()).getTime() - $scope.pingBuffer < $scope.lastPing.getTime()) {
                            $scope.whiteboardConnection.invoke('ping');
                            $scope.lastPing = new Date();
                            $scope.setupPing($scope.pingSpacing);
                        }
                        else {
                            $scope.setupPing($scope.pingSpacing - ((new Date()).getTime() - $scope.lastPing.getTime()));
                        }
                    }, toTimeout)
                };

                $scope.whiteboardConnection.on('pingWhiteboard', function () {
                });

                $scope.$on('toggleToolbar', function (event, data) {
                    if ($scope.paneId == data.paneId) {
                        $scope.toolBar = data.toolBar;
                    }
                });

                $scope.$on('groupMoved', function (event, groupId) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            SessionWhiteBoardsService.getGroupWhiteBoard({ classSessionId: $scope.classSessionId, sessionGroupId: groupId }, function (success) {

                                for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                    if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionGroupId != null) {
                                        $scope.disconnectFromWhiteBoard($scope.whiteboardTabs[i].sessionWhiteBoardId);
                                        $scope.whiteboardTabs[i] = success;
                                        $scope.connectToWhiteBoard(success.sessionWhiteBoardId);
                                        $(document).ioTabs();
                                        $scope.createColourPickers();
                                        $scope.embelishWhiteboardTab(i);
                                        return;
                                    }
                                }

                                $scope.newTab(success, false);

                            }, function (err) {
                            });
                        });
                    });
                });

                // This is for when a STUDENT has been removed from a group - DO NOT CONFUSE WITH $on('groupDeleted')
                $scope.$on('groupRemoved', function (event) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionGroupId != null) {
                                    $scope.disconnectFromWhiteBoard($scope.whiteboardTabs[i].sessionWhiteBoardId);
                                    $scope.whiteboardTabs[i] = null;
                                    if ($scope.tabIndex == i) {
                                        $('#qtntab-title-' + 0).click();
                                    }
                                    break;
                                }
                            }
                        });
                    });
                });

                // For when a group is removed from tutor command
                $scope.$on('removeGroup', function (event, data) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            // Find the correct whiteboard
                            for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionGroupId == data) {
                                    // Disconnect from the whiteboard signalR
                                    $scope.disconnectFromWhiteBoard($scope.whiteboardTabs[i].sessionWhiteBoardId);
                                    // Remove the whiteboard
                                    $scope.whiteboardTabs[i] = null;
                                    // If we're looking at this whiteboard -> Move to another for a fresh look
                                    if ($scope.tabIndex == i) {
                                        $('#qtntab-title-' + 0).click();
                                    }
                                    break;
                                }
                            }
                        });
                    });
                });

                /*************** TUTOR SEND START ***************/

                $scope.$on('openMainWhiteboard', function (event, data) {
                    if (data.userId != null) {
                        var found = false;
                        for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                            if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].userId == data.userId) {
                                found = true;
                                $('#qtntab-title-' + i).click();
                                break;
                            }
                        }

                        if (!found) {
                            $scope.showLoader();
                            SessionWhiteBoardsService.getWhiteBoardForCollaboration({ classSessionId: $scope.classSessionId, userId: data.userId }, function (success) {

                                $scope.hideLoader();
                                $scope.newTab(success);
                                toastr.clear();
                                toastr.success('Collaboration started');
                            }, function (err) {
                                $scope.hideLoader();
                                toastr.clear();
                                toastr.error('User does not have any active whiteboards');
                            });
                        }
                    }
                    else if (data.groupId != null) {
                        var foundGroup = false;
                        for (var j = 0; j < $scope.whiteboardTabs.length; j++) {
                            if ($scope.whiteboardTabs[j] != null && $scope.whiteboardTabs[j].sessionGroupId == data.groupId) {
                                foundGroup = true;
                                $('#qtntab-title-' + j).click();
                                break;
                            }
                        }

                        if (!foundGroup) {
                            $scope.showLoader();
                            SessionWhiteBoardsService.getWhiteBoardForCollaboration({ classSessionId: $scope.classSessionId, groupId: data.groupId }, function (success) {

                                $scope.hideLoader();
                                $scope.newTab(success);
                                toastr.clear();
                                toastr.success('Collaboration started');
                            }, function (err) {
                                $scope.hideLoader();
                                toastr.clear();
                                toastr.error('Group does not have a active whiteboard');
                            });
                        }
                    }
                    else {
                        for (var k = 0; k < $scope.whiteboardTabs.length; k++) {
                            if ($scope.whiteboardTabs[k] != null && $scope.whiteboardTabs[k].userId == null && $scope.whiteboardTabs[k].sessionGroupId == null) {
                                $('#qtntab-title-' + k).click();
                                break;
                            }
                        }
                    }
                });

                /*************** TUTOR SEND END ***************/

                $scope.whiteBoardTabName = function (index) {
                    if ($scope.whiteboardTabs[index].userId == null || $scope.whiteboardTabs[index].userId == $scope.userId) {
                        return $scope.whiteboardTabs[index].name;
                    }
                    else if ($scope.whiteboardTabs[index].appendName == null) {
                        return 'Tutor Shared - ' + $scope.whiteboardTabs[index].name;
                    }
                    else {
                        return $scope.whiteboardTabs[index].appendName + ' - ' + $scope.whiteboardTabs[index].name;
                    }
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

                $scope.setTabActive = function (index) {
                    $scope.tabIndex = index;
                    setTimeout(function () {
                        $('#whiteTabName_' + index).focus();
                    }, 100);
                };

                $scope.embelishWhiteboardTab = function (index) {
                    $timeout(function () {
                        var canvas = document.getElementById('canvas_' + index),
                            canvasContainer = document.getElementById('canvasContainer');

                        // Resizes canvas to fill pane
                        canvas.setAttribute('width', $scope.whiteboardTabs[index].sizeX);
                        canvas.setAttribute('height', $scope.whiteboardTabs[index].sizeY);

                        $scope.whiteboardTabs[index].canvas = canvas;
                        $scope.whiteboardTabs[index].ctx = canvas.getContext('2d');
                        $scope.whiteboardTabs[index].ctx.fillStyle = '#FFFFFF';
                        $scope.whiteboardTabs[index].ctx.fillRect(0, 0, canvas.width, canvas.height);
                        $scope.whiteboardTabs[index].currentLine = { type: '', x: 0, y: 0, src: null, cords: [] };
                        $scope.whiteboardTabs[index].redoInProgress = false;
                        $scope.whiteboardTabs[index].color = '#000000';
                        $scope.whiteboardTabs[index].tooltype = 'draw';
                        $scope.whiteboardTabs[index].width = 3;
                        $scope.whiteboardTabs[index].fillOn = false;
                        $scope.whiteboardTabs[index].fillColor = '#FFFFFF';
                        $scope.whiteboardTabs[index].font = 'arial';
                        $scope.whiteboardTabs[index].fontSize = '20';
                        $scope.whiteboardTabs[index].textColor = '#000000';
                        $scope.whiteboardTabs[index].text = '';
                        $scope.whiteboardTabs[index].textOn = false;
                        $scope.whiteboardTabs[index].equation = '';
                        //MathJax.Hub.Queue(function (index) {
                        //    $scope.whiteboardTabs[index].math = MathJax.Hub.getAllJax("mathjax-container-" + index)[0];
                        //});
                        $scope.whiteboardTabs[index].equationOn = false;
                        $scope.whiteboardTabs[index].selectionOn = false;
                        $scope.whiteboardTabs[index].selectionMoveOn = false;
                        $scope.whiteboardTabs[index].shapeSelect = false;
                        $scope.whiteboardTabs[index].shapeSelected = false;
                        $scope.whiteboardTabs[index].shapeSelectIcon = 'rectangle';
                        $scope.whiteboardTabs[index].toolSelected = 'Pencil Size';
                        $scope.whiteboardTabs[index].loadSet = [];
                        $scope.whiteboardTabs[index].tutorCollaborating = false;
                        $scope.whiteboardTabs[index].zoomSelected = false;
                        $scope.whiteboardTabs[index].zoomIndex = 3;
                        $scope.whiteboardTabs[index].toolsBarOpen = false;

                        $scope.whiteboardTabs[index].undoHolder = [];

                        $scope.whiteboardTabs[index].holdOn = false;
                        $scope.whiteboardTabs[index].holdMoveOn = false;
                        $scope.whiteboardTabs[index].imageHold = false;
                        $scope.whiteboardTabs[index].heldImage;
                        $scope.whiteboardTabs[index].holdCords = { start_x: 0, start_y: 0 };
                        if ($scope.whiteboardTabs[index].userId == $scope.userId && $scope.whiteboardTabs[index].name == 'Untitled') {
                            $scope.individualTabs = $scope.individualTabs + 1;
                            $scope.whiteboardTabs[index].name = $scope.whiteboardTabs[index].name + ' - ' + $scope.individualTabs;
                        }

                        var tempCanvas = document.getElementById('canvas_temp_' + index);
                        $scope.whiteboardTabs[index].tempCanvas = tempCanvas;
                        $scope.whiteboardTabs[index].tempCtx = tempCanvas.getContext('2d');

                        // Resizes canvas to fill pane
                        tempCanvas.setAttribute('width', $scope.whiteboardTabs[index].sizeX);
                        tempCanvas.setAttribute('height', $scope.whiteboardTabs[index].sizeY);

                        $scope.whiteboardTabs[index].intermediateStore = [];
                        var intermediateCanvas = document.getElementById('canvas_intermediate_' + index);
                        $scope.whiteboardTabs[index].intermediateCanvas = intermediateCanvas;
                        $scope.whiteboardTabs[index].intermediateCtx = intermediateCanvas.getContext('2d');

                        // Resizes canvas to fill pane
                        intermediateCanvas.setAttribute('width', $scope.whiteboardTabs[index].sizeX);
                        intermediateCanvas.setAttribute('height', $scope.whiteboardTabs[index].sizeY);

                        $scope.drawCanvas(index, 0, $scope.whiteboardTabs[index].canvasData, $scope.whiteboardTabs[index].ctx, true, true);
                    }, 200);
                };

                $scope.numbersOnlyX = function (index) {
                    if ($scope.whiteboardTabs[index].sizeX != undefined && $scope.whiteboardTabs[index].sizeX != null) {
                        $scope.whiteboardTabs[index].sizeX = Math.round($scope.whiteboardTabs[index].sizeX);
                        if ($scope.whiteboardTabs[index].sizeX > 2000) {
                            if ($scope.whiteboardTabs[index].sizeX < 10000 || $scope.whiteboardTabs[index].sizeX > 20000) {
                                $scope.whiteboardTabs[index].sizeX = parseInt($scope.whiteboardTabs[index].sizeX.toString().substring(0, 3));
                            }
                            else {
                                $scope.whiteboardTabs[index].sizeX = parseInt($scope.whiteboardTabs[index].sizeX.toString().substring(0, 4));
                            }
                        }
                    }
                };

                $scope.numbersOnlyY = function (index) {
                    if ($scope.whiteboardTabs[index].sizeY != undefined && $scope.whiteboardTabs[index].sizeY != null) {
                        $scope.whiteboardTabs[index].sizeY = Math.round($scope.whiteboardTabs[index].sizeY);
                        if ($scope.whiteboardTabs[index].sizeY > 2000) {
                            if ($scope.whiteboardTabs[index].sizeY < 10000 || $scope.whiteboardTabs[index].sizeY > 20000) {
                                $scope.whiteboardTabs[index].sizeY = parseInt($scope.whiteboardTabs[index].sizeY.toString().substring(0, 3));
                            }
                            else {
                                $scope.whiteboardTabs[index].sizeY = parseInt($scope.whiteboardTabs[index].sizeY.toString().substring(0, 4));
                            }
                        }
                    }
                };

                $scope.createColourPickers = function () {
                    $(".fill-colour-picker").spectrum({
                        color: "#FFFFFF",
                        preferredFormat: "hex",
                        allowEmpty: true
                    });
                    $(".colour-picker").spectrum({
                        color: '#000000',
                        preferredFormat: "hex",
                        allowEmpty: true
                    });
                    $(".font-colour-picker").spectrum({
                        color: '#000000',
                        preferredFormat: "hex",
                        allowEmpty: true
                    });
                };

                $scope.canWriteFunctionNoMessage = function (index, callbackFunction, ...callbackArgs) {
                    if ($scope.whiteboardTabs[index].writeDisabled) {
                        return;
                    }
                    else if (($scope.whiteboardTabs[index].locked && !$scope.isTutor) || ($rootScope.sessionEnded && $scope.whiteboardTabs[index].userId != $scope.userId)) {
                        return;
                    }
                    else {
                        callbackFunction(...callbackArgs);
                    }
                };

                $scope.canWriteFunction = function (index, callbackFunction, ...callbackArgs) {
                    if ($scope.whiteboardTabs[index].writeDisabled) {
                        $scope.noWritePermissionsMessage();
                    }
                    else if (($scope.whiteboardTabs[index].locked && !$scope.isTutor) || ($rootScope.sessionEnded && $scope.whiteboardTabs[index].userId != $scope.userId)) {
                        $scope.whiteboardLockedMessage();
                    }
                    else {
                        callbackFunction(...callbackArgs);
                    }
                };

                $scope.noWritePermissionsMessage = function () {
                    toastr.clear();
                    toastr.error("You haven't been given write permission for this");
                };

                $scope.whiteboardLockedMessage = function () {
                    if ($rootScope.sessionEnded) {
                        toastr.clear();
                        toastr.error("Shared whiteboards are not available after session end (you can save and open it individually)");
                    }
                    else {
                        toastr.clear();
                        toastr.error("The tutor has locked this whiteboard");
                    }
                };

                $scope.export = function (index) {
                    $scope.triggerCommitFunction(index, function (index) {
                        ModalService.showModal({
                            templateUrl: '/app/classroom/whiteboardExportModal.html',
                            controller: 'WhiteboardExportModalController'
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                if (result != undefined) {
                                    if (result == 'pc') {
                                        $scope.exportToPc(index);
                                    }
                                    else if (result == 'drive') {
                                        $scope.exportToDrive(index);
                                    }
                                }
                            });
                        });
                    }, index);
                };

                $scope.getAsBase64PNGForUpload = function (index) {
                    return $scope.getAsBase64PNG(index).replace('data:image/png;base64,', '');
                };

                $scope.getAsBase64PNG = function (index) {
                    var canvas = document.getElementById('canvas_' + index);
                    return canvas.toDataURL('image/png');
                };

                $scope.exportToPc = function (index) {
                    var image = $scope.getAsBase64PNG(index);
                    var dlLink = document.createElement('a');
                    dlLink.download = $scope.whiteboardTabs[index].name + ' ' + $filter('date')(Date.now(), 'HH-mm-ss dd-MM-yyyy');
                    dlLink.href = image;
                    dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');
                    document.body.appendChild(dlLink);
                    dlLink.click();
                    document.body.removeChild(dlLink);
                };

                $scope.exportToDrive = function (index) {
                    var image = $scope.getAsBase64PNGForUpload(index);

                    SessionWhiteBoardsService.exportToDrive(image, $scope.whiteboardTabs[index].name, $scope.classSessionId, $scope.userId, function (success) {
                        toastr.clear();
                        toastr.success('Your work on this whiteboard has been successfully saved to your Google Drive');
                    }, function (err) {
                        toastr.clear();
                        toastr.error('There was an error saving your whiteboard, please try again');
                    });
                };

                // This is when a file is attempted to be imported into a whiteboard from Google Drive (and main.js checks passed)
                $scope.$on("WhiteboardAvailableForImportFromHeader", function (event, data) {
                    //console.log('data', data);
                    //console.log('$scope.tabIndex', $scope.tabIndex);
                    //console.log('$scope.whiteboardTabs[$scope.tabIndex].writeDisabled', $scope.whiteboardTabs[$scope.tabIndex].writeDisabled);
                    //console.log('$scope.whiteboardTabs[$scope.tabIndex].locked', $scope.whiteboardTabs[$scope.tabIndex].locked);


                    // We need to first make sure this whiteboard is usable
                    if ($scope.whiteboardTabs[$scope.tabIndex].writeDisabled) {

                        $scope.noWritePermissionsMessage();
                        $rootScope.$broadcast("WhiteboardAvailableForImportResponse", { importAvailable: false });
                    }
                    else if (($scope.whiteboardTabs[$scope.tabIndex].locked && !$scope.isTutor) ||
                        ($rootScope.sessionEnded && $scope.whiteboardTabs[$scope.tabIndex].userId != $scope.userId)) {

                        $scope.whiteboardLockedMessage();
                        $rootScope.$broadcast("WhiteboardAvailableForImportResponse", { importAvailable: false });
                    }
                    else {
                        var idx = localStorage.getItem("idx");
                        // All passed - Lets import (The data passed should be - { fileId })
                        $scope.showLoader();
                        SessionWhiteBoardsService.importFromDrive(
                            {
                                classSessionId: $scope.classSessionId,
                                sessionWhiteBoardId: $scope.whiteboardTabs[$scope.tabIndex].sessionWhiteBoardId,
                                fileId: data.fileId,
                                sizeX: $scope.whiteboardTabs[$scope.tabIndex].sizeX,
                                sizeY: $scope.whiteboardTabs[$scope.tabIndex].sizeY
                            }, {},
                            function (success) {

                                // It was successful - Note that signalR will deal with this if the image cannot be moved after import
                                $scope.hideLoader();

                                if ($scope.selectedPane == 'half') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('full');
                                } else if ($scope.selectedPane == 'thirds') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('half');
                                } else if ($scope.selectedPane == 'quad') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('thirds');
                                } else {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('full');
                                }

                                $scope.processImageImported($scope.tabIndex, success);
                                $rootScope.$broadcast("WhiteboardAvailableForImportResponse", { importAvailable: true });
                            }, function (err) {

                                toastr.clear();
                                toastr.error('There was an error importing the file, please try again');
                                $scope.hideLoader();
                                if ($scope.selectedPane == 'half') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('full');
                                } else if ($scope.selectedPane == 'thirds') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('half');
                                } else if ($scope.selectedPane == 'quad') {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('thirds');
                                } else {
                                    $scope.deselectTool(idx, 'File');
                                    $scope.changePaneFile('full');
                                }
                                $rootScope.$broadcast("WhiteboardAvailableForImportResponse", { importAvailable: false });
                            });
                    }
                });

                $scope.import = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) {
                            $scope.showLoader();
                            ModalService.showModal({
                                templateUrl: '/app/classroom/whiteboardImportModal.html',
                                controller: 'WhiteboardImportModalController',
                                inputs: {}
                            }).then(function (modal) {
                                modal.close.then(function (result) {
                                    if (result != undefined) {
                                        SessionWhiteBoardsService.uploadImage(result, $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId,
                                            $scope.whiteboardTabs[index].sizeX, $scope.whiteboardTabs[index].sizeY,
                                            function (success) {
                                                $scope.hideLoader();
                                                $scope.processImageImported(index, success);
                                            }, function (err) {
                                                $scope.hideLoader();
                                                toastr.clear();
                                                toastr.error('There was an error importing the file, please try again');
                                            });
                                    }
                                    else {
                                        $scope.hideLoader();
                                    }
                                });
                            });
                        }, index);
                    }, index);
                };

                $scope.processImageImported = function (index, success) {
                    //console.log('success', success);
                    //console.log('success.directory', success.directory);
                    //console.log('index', index);
                    let dirToUse = undefined;

                    if (success != null && success.directory !== undefined && success.directory != null && success.directory != "") {
                        dirToUse = success.directory;
                    } else if (success != null && success.data !== undefined && success.data != null && success.data != "" &&
                        success.data.directory !== undefined && success.data.directory != null && success.data.directory != "") {

                        dirToUse = success.data.directory;
                    }


                    if (success != null && dirToUse != undefined) {
                        //console.log('dirToUse', dirToUse);


                        $scope.whiteboardTabs[index].imageHold = true;
                        $scope.whiteboardTabs[index].holdOn = true;
                        $scope.whiteboardTabs[index].heldImage = dirToUse;
                        $scope.drawTempImage(index, 0, 0, dirToUse);
                    }
                }

                $scope.addWhiteBoardTab = function () {
                    var canvasContainer = $('#canvasContainer_' + $scope.tabIndex);
                    //var newWhiteboard = { sessionWhiteBoardId: undefined, classSessionId: $scope.classSessionId, sessionGroupId: null, userId: $scope.userId, sizeX: canvasContainer[0].offsetWidth - $scope.marginOffset, sizeY: canvasContainer[0].offsetHeight - $scope.marginOffset, name: 'Untitled' };
                    var newWhiteboard = { sessionWhiteBoardId: undefined, classSessionId: $scope.classSessionId, sessionGroupId: null, userId: $scope.userId, sizeX: $scope.defaultWidth, sizeY: $scope.defaultHeight, name: 'Untitled' };
                    SessionWhiteBoardsService.createIndividualBoard({ classSessionId: $scope.classSessionId }, newWhiteboard, function (success) {
                        $scope.newTab(success);
                    }, function (err) {
                    });
                };

                $scope.collaborateWhiteBoardTab = function () {
                    $scope.showLoader();
                    ModalService.showModal({
                        templateUrl: '/app/classroom/whiteboardCollaborateModal.html',
                        controller: 'WhiteboardCollaborateModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            userId: $scope.userId,
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result != undefined) {
                                var found = false;
                                for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                    if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == result) {
                                        $('#qtntab-title-' + i).click();
                                        found = true;
                                        $scope.hideLoader();
                                        break;
                                    }
                                }
                                if (!found) {
                                    SessionWhiteBoardsService.getWhiteBoardForCollaboration({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: result }, function (success) {
                                        $scope.hideLoader();
                                        $scope.newTab(success);
                                        toastr.clear();
                                        toastr.success('Collaboration started');
                                    }, function (err) {
                                        $scope.hideLoader();
                                        toastr.clear();
                                        toastr.error('There was an error setting up collaboration, please try again');
                                    });
                                }
                            }
                            else {
                                $scope.hideLoader();
                            }
                        });
                    });
                };

                $scope.openWhiteBoardTab = function () {
                    $scope.loadModal(null, function (index, sessionWhiteBoardSave) {
                        if (sessionWhiteBoardSave.isShared) {
                            var found = false;
                            for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                                if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardSave.sessionWhiteBoardId) {
                                    found = true;
                                    $('#qtntab-title-' + i).click();
                                }
                            }
                            if (!found) {
                                SessionWhiteBoardsService.getSharedBoard({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: sessionWhiteBoardSave.sessionWhiteBoardId, userId: $scope.userId }, function (success) {
                                    $scope.newTab(success);
                                }, function (err) {
                                });
                            }
                        }
                        else if (sessionWhiteBoardSave.sessionWhiteBoardSaveId !== undefined && sessionWhiteBoardSave.sessionWhiteBoardSaveId != null && sessionWhiteBoardSave.sessionWhiteBoardSaveId != '') {
                            SessionWhiteBoardsService.openIndividualBoard({ classSessionId: $scope.classSessionId, sessionWhiteBoardSaveId: sessionWhiteBoardSave.sessionWhiteBoardSaveId }, function (success) {
                                $scope.newTab(success);
                            }, function (err) {
                            });
                        }
                        else if (sessionWhiteBoardSave.sessionWhiteBoardId !== undefined && sessionWhiteBoardSave.sessionWhiteBoardId != null && sessionWhiteBoardSave.sessionWhiteBoardId != '') {
                            SessionWhiteBoardsService.openInactiveBoard({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: sessionWhiteBoardSave.sessionWhiteBoardId }, function (success) {
                                $scope.newTab(success);
                            }, function (err) {
                            });
                        }
                    }, 'Import Whiteboard', 'Whiteboard');
                };

                $scope.triggerCommitFunction = function (index, callbackFunction, ...callbackArgs) {
                    $scope.triggerCommit(index);
                    callbackFunction(...callbackArgs);
                };

                $scope.triggerCommit = function (index) {
                    $scope.mouseDown({ offsetX: -100, offsetY: -100 }, index);
                    $scope.mouseUp({ offsetX: -100, offsetY: -100 }, index);
                };

                $scope.changeToolType = function (index, tooltype) {
                    $scope.canWriteFunction(index, function (index, tooltype) {
                        $scope.triggerCommitFunction(index, function (index, tooltype) {

                            let Whiteboard = document.querySelector('.Whiteboard');

                            $scope.whiteboardTabs[index].tooltype = tooltype;
                            $scope.whiteboardTabs[index].shapeSelect = false;
                            $scope.whiteboardTabs[index].shapeSelected = false;
                            Whiteboard.style.cursor = "default";

                            if (tooltype == "draw") {
                                $scope.whiteboardTabs[index].toolSelected = 'Pencil Size';
                            } else if (tooltype == "erase") {
                                $scope.whiteboardTabs[index].toolSelected = 'Eraser Size';;
                            } else if (tooltype == "text" || tooltype == "equation") {
                                Whiteboard.style.cursor = "text";
                            }
                        }, index, tooltype);
                    }, index, tooltype);
                };

                $scope.changeToolTypeShape = function (index, tooltype) {
                    $scope.canWriteFunction(index, function (index, tooltype) {
                        $scope.triggerCommitFunction(index, function (index, tooltype) {
                            let Whiteboard = document.querySelector('.Whiteboard');
                            $scope.whiteboardTabs[index].tooltype = tooltype;
                            $scope.whiteboardTabs[index].shapeSelect = false;
                            $scope.whiteboardTabs[index].shapeSelected = true;
                            $scope.whiteboardTabs[index].shapeSelectIcon = tooltype;

                            if (tooltype == "line" || tooltype == "rectangle" || tooltype == "circle" || tooltype == "ellipse" || tooltype == "triangle" || tooltype == "triangleR" || tooltype == "pentagon" || tooltype == "hexagon" || tooltype == "octagon" || tooltype == "rhombus" || tooltype == "cubiod") {
                                $scope.whiteboardTabs[index].toolSelected = 'Border Width';
                                Whiteboard.style.cursor = "crosshair";
                            }
                        }, index, tooltype);
                    }, index, tooltype);
                };

                $scope.openToolPanel = function (index) {
                    // Allow panel to be closed only when locked
                    var prevValue = $scope.whiteboardTabs[index].shapeSelect;
                    if (prevValue) {
                        $scope.canWriteFunctionNoMessage(index, function (index) {
                            $scope.triggerCommitFunction(index, function (index) { }, index);
                        }, index);
                        $scope.whiteboardTabs[index].shapeSelect = !$scope.whiteboardTabs[index].shapeSelect;
                    }
                    else {
                        $scope.canWriteFunction(index, function (index) {
                            $scope.triggerCommitFunction(index, function (index) {
                                $scope.whiteboardTabs[index].shapeSelect = !$scope.whiteboardTabs[index].shapeSelect;
                            }, index);
                        }, index);
                    }
                };

                $scope.openZoomPanel = function (index) {
                    // Allow zoom even when locked
                    $scope.canWriteFunctionNoMessage(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) { }, index);
                    }, index);
                    $scope.whiteboardTabs[index].zoomSelected = !$scope.whiteboardTabs[index].zoomSelected;
                };

                $scope.showToolPanelDropdown = function (index) {
                    // Allow panel to be closed only when locked
                    var prevValue = $scope.whiteboardTabs[index].toolsBarOpen;
                    if (prevValue) {
                        $scope.canWriteFunctionNoMessage(index, function (index) {
                            $scope.triggerCommitFunction(index, function (index) { }, index);
                        }, index);
                        $scope.whiteboardTabs[index].toolsBarOpen = !$scope.whiteboardTabs[index].toolsBarOpen;
                    }
                    else {
                        $scope.canWriteFunction(index, function (index) {
                            $scope.triggerCommitFunction(index, function (index) {
                                $scope.whiteboardTabs[index].toolsBarOpen = !$scope.whiteboardTabs[index].toolsBarOpen;
                            }, index);
                        }, index);
                    }
                };

                $scope.newTab = function (data, moveToTab = true) {
                    $scope.connectToWhiteBoard(data.sessionWhiteBoardId);
                    $scope.whiteboardTabs.push(data);
                    setTimeout(function () {
                        $(document).ioTabs();
                        $scope.createColourPickers();
                        $scope.embelishWhiteboardTab($scope.whiteboardTabs.length - 1);
                        if (moveToTab) {
                            $('#qtntab-title-' + ($scope.whiteboardTabs.length - 1)).click();
                        }
                    }, 50);
                };

                $scope.loadIntoWhiteBoard = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) {
                            $scope.loadModal(index, $scope.load, 'Import Whiteboard Screenshot', 'Screenshot')
                        }, index);
                    }, index);
                };

                $scope.loadModal = function (index, callbackFunc, title, type) {
                    ModalService.showModal({
                        templateUrl: '/app/classroom/whiteboardLoadModal.html',
                        controller: 'WhiteboardLoadModalController',
                        inputs: {
                            classSessionId: $scope.classSessionId,
                            userId: $scope.userId,
                            showShares: index == null ? true : false, // ie only allow a share to be opened into a new tab so will link up with signalR
                            title: title,
                            type: type
                        }
                    }).then(function (modal) {
                        modal.close.then(function (result) {
                            if (result != undefined) {
                                var dashIndex = result.name.indexOf('-');
                                if (dashIndex != -1 && dashIndex + 2 < result.name.length) {
                                    result.name = result.name.substr(dashIndex + 1);
                                }
                                callbackFunc(index, result);
                            }
                        });
                    });
                };

                $scope.shareModal = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) {
                            ModalService.showModal({
                                templateUrl: '/app/classroom/whiteboardShareModal.html',
                                controller: 'WhiteboardShareModalController',
                                inputs: {
                                    classSessionId: $scope.classSessionId,
                                    sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId,
                                    whiteBoardUserId: $scope.whiteboardTabs[index].userId,
                                    userId: $scope.userId,
                                    showRead: $scope.whiteboardTabs[index].userId != null
                                }
                            }).then(function (modal) {
                                modal.close.then(function (result) {
                                    if (result != undefined) {
                                        $scope.share(index, result.users, result.individual, result.whiteBoardUserId);
                                    }
                                });
                            });
                        }, index);
                    }, index);
                };

                $scope.share = function (index, users, individual, whiteBoardUserId) {
                    $scope.whiteboardConnection.invoke('share', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId, individual, whiteBoardUserId, users);
                };

                $scope.lockBoard = function (index) {
                    $scope.triggerCommitFunction(index, function (index) {
                        $scope.whiteboardConnection.invoke('toggleLock', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId, { locked: !$scope.whiteboardTabs[index].locked });
                    }, index);
                };

                $scope.whiteboardConnection.on('boardLockToggled', function (sessionWhiteBoardId, locked) {
                    for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardId) {
                            if ($scope.whiteboardTabs[i].locked != locked) {
                                if ($scope.isTutor) {
                                    if (locked) {
                                        toastr.clear();
                                        toastr.success('You have locked the "' + $scope.whiteboardTabs[i].name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '" whiteboard for other users');
                                    }
                                    else {
                                        toastr.clear();
                                        toastr.success('You have unlocked the "' + $scope.whiteboardTabs[i].name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '" whiteboard for other users');
                                    }
                                }
                                else {
                                    if (locked) {
                                        toastr.clear();
                                        toastr.info('Your Tutor has locked the "' + $scope.whiteboardTabs[i].name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '" whiteboard');
                                        $scope.triggerCommit(i);
                                    }
                                    else {
                                        toastr.clear();
                                        toastr.info('Your Tutor has unlocked the "' + $scope.whiteboardTabs[i].name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '" whiteboard');
                                    }
                                }
                                $scope.whiteboardTabs[i].locked = locked;
                            }
                            break;
                        }
                    }
                });

                $scope.closeWhiteboard = function (index) {
                    if ($scope.userId == $scope.whiteboardTabs[index].userId) {
                        $scope.whiteboardConnection.invoke('setInactive', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId);
                        //SessionWhiteBoardsService.setInactive({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId }, function (success) {
                        //}, function (err) {
                        //});
                    }
                    if ($scope.isTutor && ($scope.whiteboardTabs[index].userId != $scope.userId || $scope.whiteboardTabs[index].userId == null)) {
                        $scope.tutorStoppedCollaborating($scope.whiteboardTabs[index].sessionWhiteBoardId, $scope.whiteboardTabs[index].name);
                    }
                    $scope.disconnectFromWhiteBoard($scope.whiteboardTabs[index].sessionWhiteBoardId);
                    $scope.whiteboardTabs[index] = null;
                    var newTabAssigned = false;
                    for (var i = index + 1; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != undefined && $scope.whiteboardTabs[i] != null) {
                            $('#qtntab-title-' + i).click();
                            newTabAssigned = true;
                            break;
                        }
                    }
                    if (!newTabAssigned) {
                        for (var j = index - 1; j >= 0; j--) {
                            if ($scope.whiteboardTabs[j] != undefined && $scope.whiteboardTabs[j] != null) {
                                $('#qtntab-title-' + j).click();
                                break;
                            }
                        }
                    }
                };

                $scope.closeTab = function (index) {
                    $scope.triggerCommitFunction(index, function (index) {
                        ModalService.showModal({
                            templateUrl: '/app/classroom/panelExitModal.html',
                            controller: 'PanelExitModalController'
                        }).then(function (modal) {
                            modal.close.then(function (result) {
                                if (result) {
                                    $scope.closeWhiteboard(index);
                                }
                            });
                        });
                    }, index);
                };

                $scope.alterText = function (e, index) {
                    if ($scope.whiteboardTabs[index].textOn) {
                        $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                        var textProps = $scope.drawTempText(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey);
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousex = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + textProps.width;
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousey = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey - textProps.height;
                        $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey, 0);
                    }
                };

                $scope.alterEquation = function (e, index) {
                    if ($scope.whiteboardTabs[index].equationOn) {
                        $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                        var textProps = $scope.drawTempEquation(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey);
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousex = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + textProps.width;
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousey = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey - textProps.height;
                        $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey, 0);
                    }
                };

                $scope.mouseLeave = function (e, index) {
                    $scope.mouseUp(e, index);
                };

                $scope.handleMouseDown = function (e, index) {
                    //Only do this on left click
                    if (e.which == 1) {
                        $scope.canWriteFunction(index, function (e, index) {
                            $scope.mouseDown(e, index);
                        }, e, index);
                    }
                };

                $scope.mouseDown = function (e, index) {
                    $scope.whiteboardTabs[index].last_mousex = $scope.whiteboardTabs[index].mousex = parseInt(e.offsetX / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]);
                    $scope.whiteboardTabs[index].last_mousey = $scope.whiteboardTabs[index].mousey = parseInt(e.offsetY / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]);
                    $scope.whiteboardTabs[index].mousedown = true;
                    if ($scope.whiteboardTabs[index].selectionOn) {
                        if ($scope.whiteboardTabs[index].tooltype == 'selection') {
                            if ($scope.whiteboardTabs[index].currentLine.cords != undefined) {
                                if ($scope.whiteboardTabs[index].currentLine.cords.length > 1) {
                                    var move_x = $scope.whiteboardTabs[index].currentLine.cords[1].mousex - $scope.whiteboardTabs[index].currentLine.cords[1].last_mousex;
                                    var move_y = $scope.whiteboardTabs[index].currentLine.cords[1].mousey - $scope.whiteboardTabs[index].currentLine.cords[1].last_mousey;
                                    if ((($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + move_x >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].mousex + move_x <= $scope.whiteboardTabs[index].last_mousex) ||
                                        ($scope.whiteboardTabs[index].currentLine.cords[0].mousex + move_x >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + move_x <= $scope.whiteboardTabs[index].last_mousex)) &&
                                        (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousey + move_y >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].mousey + move_y <= $scope.whiteboardTabs[index].last_mousey) ||
                                            ($scope.whiteboardTabs[index].currentLine.cords[0].mousey + move_y >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey + move_y <= $scope.whiteboardTabs[index].last_mousey))) {
                                        $scope.whiteboardTabs[index].selectionMoveOn = true;
                                        var change_x = $scope.whiteboardTabs[index].last_mousex - $scope.whiteboardTabs[index].currentLine.cords[1].mousex;
                                        $scope.whiteboardTabs[index].currentLine.cords[1].mousex = $scope.whiteboardTabs[index].currentLine.cords[1].mousex + change_x;
                                        $scope.whiteboardTabs[index].currentLine.cords[1].last_mousex = $scope.whiteboardTabs[index].currentLine.cords[1].last_mousex + change_x;
                                        var change_y = $scope.whiteboardTabs[index].last_mousey - $scope.whiteboardTabs[index].currentLine.cords[1].mousey;
                                        $scope.whiteboardTabs[index].currentLine.cords[1].mousey = $scope.whiteboardTabs[index].currentLine.cords[1].mousey + change_y;
                                        $scope.whiteboardTabs[index].currentLine.cords[1].last_mousey = $scope.whiteboardTabs[index].currentLine.cords[1].last_mousey + change_y;
                                    }
                                }
                                else if ($scope.whiteboardTabs[index].currentLine.cords.length > 0 &&
                                    (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].mousex <= $scope.whiteboardTabs[index].last_mousex) ||
                                        ($scope.whiteboardTabs[index].currentLine.cords[0].mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex <= $scope.whiteboardTabs[index].last_mousex)) &&
                                    (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].mousey <= $scope.whiteboardTabs[index].last_mousey) ||
                                        ($scope.whiteboardTabs[index].currentLine.cords[0].mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey <= $scope.whiteboardTabs[index].last_mousey))) {
                                    $scope.whiteboardTabs[index].selectionMoveOn = true;
                                }
                                else {
                                    $scope.whiteboardTabs[index].selectionOn = false;
                                }
                            }
                        }
                        if (!$scope.whiteboardTabs[index].selectionMoveOn) {
                            if ($scope.whiteboardTabs[index].currentLine.type == 'move' && $scope.whiteboardTabs[index].currentLine.cords != undefined && $scope.whiteboardTabs[index].currentLine.cords.length > 1) {
                                debugger;
                                $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                            }
                            $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                            $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                            $scope.whiteboardTabs[index].selectionOn = false;
                        }
                    }
                    else if ($scope.whiteboardTabs[index].textOn) {

                        // Special case required for this as image can be added by the importer while text/equation tool active
                        if ($scope.whiteboardTabs[index].currentLine.type == "image" && $scope.whiteboardTabs[index].holdOn) {
                            $scope.mouseDown_HoldOn(index);
                            if (!$scope.whiteboardTabs[index].holdOn) {
                                $scope.mouseDown(e, index);
                            }
                        }
                        else {
                            if ($scope.whiteboardTabs[index].text != '') {
                                if ((($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].mousex <= $scope.whiteboardTabs[index].last_mousex) ||
                                    ($scope.whiteboardTabs[index].currentLine.cords[0].mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex <= $scope.whiteboardTabs[index].last_mousex)) &&
                                    (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].mousey <= $scope.whiteboardTabs[index].last_mousey) ||
                                        ($scope.whiteboardTabs[index].currentLine.cords[0].mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey <= $scope.whiteboardTabs[index].last_mousey))) {
                                    $scope.whiteboardTabs[index].holdMoveOn = true;
                                    $scope.whiteboardTabs[index].holdCords.start_x = $scope.whiteboardTabs[index].last_mousex;
                                    $scope.whiteboardTabs[index].holdCords.start_y = $scope.whiteboardTabs[index].last_mousey;
                                }
                                else {
                                    $scope.whiteboardTabs[index].currentLine.text = $scope.whiteboardTabs[index].text;
                                    $scope.whiteboardTabs[index].currentLine.textStyle = $scope.whiteboardTabs[index].fontSize + 'px ' + $scope.whiteboardTabs[index].font;
                                    $scope.whiteboardTabs[index].currentLine.textColor = $scope.whiteboardTabs[index].textColor;
                                    debugger;
                                    $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                                    $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                    $scope.whiteboardTabs[index].text = '';
                                    $scope.whiteboardTabs[index].textOn = false;
                                    $scope.whiteboardTabs[index].holdOn = false;
                                    $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                                }
                            }
                            else {
                                if ($scope.whiteboardTabs[index].tooltype == 'text' || $scope.whiteboardTabs[index].equationOn) {
                                    $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                }
                                $scope.whiteboardTabs[index].textOn = false;
                                $scope.whiteboardTabs[index].holdOn = false;
                                $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                            }
                        }
                    }
                    else if ($scope.whiteboardTabs[index].equationOn) {

                        // Special case required for this as image can be added by the importer while text/equation tool active
                        if ($scope.whiteboardTabs[index].currentLine.type == "image" && $scope.whiteboardTabs[index].holdOn) {
                            $scope.mouseDown_HoldOn(index);
                            if (!$scope.whiteboardTabs[index].holdOn) {
                                $scope.mouseDown(e, index);
                            }
                        }
                        else {
                            if ($scope.whiteboardTabs[index].equation != '') {
                                if ((($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].mousex <= $scope.whiteboardTabs[index].last_mousex) ||
                                    ($scope.whiteboardTabs[index].currentLine.cords[0].mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex <= $scope.whiteboardTabs[index].last_mousex)) &&
                                    (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].mousey <= $scope.whiteboardTabs[index].last_mousey) ||
                                        ($scope.whiteboardTabs[index].currentLine.cords[0].mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey <= $scope.whiteboardTabs[index].last_mousey))) {
                                    $scope.whiteboardTabs[index].holdMoveOn = true;
                                    $scope.whiteboardTabs[index].holdCords.start_x = $scope.whiteboardTabs[index].last_mousex;
                                    $scope.whiteboardTabs[index].holdCords.start_y = $scope.whiteboardTabs[index].last_mousey;
                                }
                                else {
                                    $scope.whiteboardTabs[index].currentLine.text = $scope.whiteboardTabs[index].equation;
                                    $scope.whiteboardTabs[index].currentLine.textStyle = $scope.whiteboardTabs[index].fontSize + 'px ' + $scope.whiteboardTabs[index].font;
                                    $scope.whiteboardTabs[index].currentLine.textColor = $scope.whiteboardTabs[index].textColor;
                                    debugger;
                                    $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                                    $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                    $scope.whiteboardTabs[index].equation = '';
                                    $scope.whiteboardTabs[index].equationOn = false;
                                    $scope.whiteboardTabs[index].holdOn = false;
                                    $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                                }
                            }
                            else {
                                if ($scope.whiteboardTabs[index].tooltype == 'equation' || $scope.whiteboardTabs[index].textOn) {
                                    $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                }
                                $scope.whiteboardTabs[index].equationOn = false;
                                $scope.whiteboardTabs[index].holdOn = false;
                                $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                            }
                        }

                    }
                    else if ($scope.whiteboardTabs[index].holdOn) {
                        $scope.mouseDown_HoldOn(index);
                    }
                };

                $scope.mouseDown_Text = function (index) {
                    if ($scope.whiteboardTabs[index].text != '') {
                        if ((($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].mousex <= $scope.whiteboardTabs[index].last_mousex) ||
                            ($scope.whiteboardTabs[index].currentLine.cords[0].mousex >= $scope.whiteboardTabs[index].last_mousex && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex <= $scope.whiteboardTabs[index].last_mousex)) &&
                            (($scope.whiteboardTabs[index].currentLine.cords[0].last_mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].mousey <= $scope.whiteboardTabs[index].last_mousey) ||
                                ($scope.whiteboardTabs[index].currentLine.cords[0].mousey >= $scope.whiteboardTabs[index].last_mousey && $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey <= $scope.whiteboardTabs[index].last_mousey))) {
                            $scope.whiteboardTabs[index].holdMoveOn = true;
                            $scope.whiteboardTabs[index].holdCords.start_x = $scope.whiteboardTabs[index].last_mousex;
                            $scope.whiteboardTabs[index].holdCords.start_y = $scope.whiteboardTabs[index].last_mousey;
                        }
                        else {
                            $scope.whiteboardTabs[index].currentLine.text = $scope.whiteboardTabs[index].text;
                            $scope.whiteboardTabs[index].currentLine.textStyle = $scope.whiteboardTabs[index].fontSize + 'px ' + $scope.whiteboardTabs[index].font;
                            $scope.whiteboardTabs[index].currentLine.textColor = $scope.whiteboardTabs[index].textColor;
                            debugger;
                            $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                            $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                            $scope.whiteboardTabs[index].text = '';
                            $scope.whiteboardTabs[index].textOn = false;
                            $scope.whiteboardTabs[index].holdOn = false;
                            $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                        }
                    }
                    else {
                        if ($scope.whiteboardTabs[index].tooltype == 'text' || $scope.whiteboardTabs[index].equationOn) {
                            $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                        }
                        $scope.whiteboardTabs[index].textOn = false;
                        $scope.whiteboardTabs[index].holdOn = false;
                        $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                    }
                };

                $scope.mouseDown_HoldOn = function (index) {
                    if ($scope.whiteboardTabs[index].currentLine.cords.length > 0) {
                        if ($scope.whiteboardTabs[index].currentLine.type == 'image') {
                            $scope.mouseDown_HoldOn_Step2(index, 0, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex + $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey + $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey);
                        }
                        else if ($scope.whiteboardTabs[index].currentLine.type != 'circle') {
                            $scope.mouseDown_HoldOn_Step2(index, $scope.whiteboardTabs[index].currentLine.cords[0].width, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey);
                        }
                        else {
                            var recalulatedPoints = $scope.recalculateCircleBox($scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey);
                            $scope.mouseDown_HoldOn_Step2(index, $scope.whiteboardTabs[index].currentLine.cords[0].width, recalulatedPoints.start_x, recalulatedPoints.start_y, recalulatedPoints.x, recalulatedPoints.y);
                        }
                    }
                    else {
                        $scope.whiteboardTabs[index].holdOn = false;
                        debugger;
                        $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                        $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                        $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                    }
                };

                $scope.mouseDown_HoldOn_Step2 = function (index, width, last_mousex, last_mousey, mousex, mousey) {
                    var halfWidth = (width / 2) + 1;
                    if (((last_mousex + halfWidth >= $scope.whiteboardTabs[index].last_mousex && mousex - halfWidth <= $scope.whiteboardTabs[index].last_mousex) ||
                        (mousex + halfWidth >= $scope.whiteboardTabs[index].last_mousex && last_mousex - halfWidth <= $scope.whiteboardTabs[index].last_mousex)) &&
                        ((last_mousey + halfWidth >= $scope.whiteboardTabs[index].last_mousey && mousey - halfWidth <= $scope.whiteboardTabs[index].last_mousey) ||
                            (mousey + halfWidth >= $scope.whiteboardTabs[index].last_mousey && last_mousey - halfWidth <= $scope.whiteboardTabs[index].last_mousey))) {
                        $scope.whiteboardTabs[index].holdMoveOn = true;
                        $scope.whiteboardTabs[index].holdCords.start_x = $scope.whiteboardTabs[index].last_mousex;
                        $scope.whiteboardTabs[index].holdCords.start_y = $scope.whiteboardTabs[index].last_mousey;
                    }
                    else {
                        $scope.whiteboardTabs[index].holdOn = false;
                        $scope.whiteboardTabs[index].imageHold = false;
                        debugger;
                        $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                        $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                        $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                    }
                };

                $scope.handleMouseUp = function (e, index) {
                    // Only do something if left clicked
                    if (e.which == 1) {
                        $scope.mouseUp(e, index);
                    }
                };

                $scope.mouseUp = function (e, index) {
                    if (!$scope.whiteboardTabs[index].writeDisabled && (!$scope.whiteboardTabs[index].locked || $scope.isTutor) && !($rootScope.sessionEnded && $scope.whiteboardTabs[index].userId != $scope.userId) && $scope.whiteboardTabs[index].mousedown) {
                        $scope.whiteboardTabs[index].mousedown = false;
                        if ($scope.whiteboardTabs[index].holdMoveOn) {
                            $scope.whiteboardTabs[index].holdMoveOn = false;
                            if ($scope.whiteboardTabs[index].currentLine.cords != undefined) {
                                // Move info should be pushed into the line
                                var dist_x = $scope.whiteboardTabs[index].mousex - $scope.whiteboardTabs[index].holdCords.start_x;
                                var dist_y = $scope.whiteboardTabs[index].mousey - $scope.whiteboardTabs[index].holdCords.start_y;
                                $scope.whiteboardTabs[index].currentLine.cords[0].mousex = $scope.whiteboardTabs[index].currentLine.cords[0].mousex + dist_x;
                                $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + dist_x;
                                $scope.whiteboardTabs[index].currentLine.cords[0].mousey = $scope.whiteboardTabs[index].currentLine.cords[0].mousey + dist_y;
                                $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey = $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey + dist_y;
                                $scope.whiteboardTabs[index].holdCords = { start_x: 0, start_y: 0 };

                                $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey, $scope.whiteboardTabs[index].currentLine.cords[0].width, $scope.whiteboardTabs[index].currentLine.type);

                            }
                        }
                        else if ($scope.whiteboardTabs[index].tooltype == 'text') {
                            $scope.whiteboardTabs[index].textOn = true;
                            $scope.whiteboardTabs[index].holdOn = true;
                            $scope.whiteboardTabs[index].currentLine = { type: 'text', cords: [] };
                            $scope.whiteboardTabs[index].currentLine.cords.push({ mousex: $scope.whiteboardTabs[index].mousex, mousey: $scope.whiteboardTabs[index].mousey, last_mousex: $scope.whiteboardTabs[index].last_mousex, last_mousey: $scope.whiteboardTabs[index].last_mousey, width: 0 });
                            $('#whiteboardText' + $scope.whiteboardTabs[index].sessionWhiteBoardId).focus();
                            $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey - $scope.whiteboardTabs[index].fontSize, $scope.whiteboardTabs[index].currentLine.cords[0].width, $scope.whiteboardTabs[index].currentLine.type);

                        }
                        else if ($scope.whiteboardTabs[index].tooltype == 'equation') {
                            $scope.whiteboardTabs[index].equationOn = true;
                            $scope.whiteboardTabs[index].holdOn = true;
                            $scope.whiteboardTabs[index].currentLine = { type: 'equation', cords: [] };
                            $scope.whiteboardTabs[index].currentLine.cords.push({ mousex: $scope.whiteboardTabs[index].mousex, mousey: $scope.whiteboardTabs[index].mousey, last_mousex: $scope.whiteboardTabs[index].last_mousex, last_mousey: $scope.whiteboardTabs[index].last_mousey, width: 0 });
                            $('#whiteboardEquation' + $scope.whiteboardTabs[index].sessionWhiteBoardId).focus();
                            $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey - $scope.whiteboardTabs[index].fontSize, $scope.whiteboardTabs[index].currentLine.cords[0].width, $scope.whiteboardTabs[index].currentLine.type);
                        }
                        else if ($scope.whiteboardTabs[index].tooltype == 'fill') {
                            $scope.addCommand(index, { type: 'fill', cords: [{ last_mousex: parseInt(e.offsetX / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]), last_mousey: parseInt(e.offsetY / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]), color: $scope.whiteboardTabs[index].fillColor }] });
                        }
                        else if ($scope.whiteboardTabs[index].currentLine.cords.length > 0) {
                            if ($scope.whiteboardTabs[index].tooltype == 'draw' || $scope.whiteboardTabs[index].tooltype == 'erase') {
                                debugger;
                                $scope.addCommand_WithIntermediate(index, $scope.whiteboardTabs[index].currentLine);
                                $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                                $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                            }
                            else if ($scope.whiteboardTabs[index].tooltype == 'selection') {
                                $scope.whiteboardTabs[index].selectionOn = true;
                                $scope.whiteboardTabs[index].selectionMoveOn = false;
                            }
                            else {
                                if ($scope.whiteboardTabs[index].tooltype == 'line') {
                                    $scope.whiteboardTabs[index].currentLine.cords[0].mousex = $scope.whiteboardTabs[index].last_mousex;
                                    $scope.whiteboardTabs[index].currentLine.cords[0].mousey = $scope.whiteboardTabs[index].last_mousey;
                                }

                                $scope.whiteboardTabs[index].holdOn = true;
                                $scope.whiteboardTabs[index].currentLine.type = $scope.whiteboardTabs[index].tooltype;
                                $scope.drawTempHoldMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].mousex, $scope.whiteboardTabs[index].mousey, $scope.whiteboardTabs[index].currentLine.cords[0].width, $scope.whiteboardTabs[index].currentLine.type);
                            }
                        }
                    }
                };

                $scope.mouseMove = function (e, index) {
                    //ML add if around code 16/06/2020, without this when you close the save modal and the board is locked it triggers the code,



                    //$scope.canWriteFunctionNoMessage(index, function (e, index) {

                    console.log('mouseMove:', $scope.whiteboardTabs[index].tooltype, $scope.whiteboardTabs[index].mousedown);

                    //                    if ($scope.whiteboardTabs[index].writeDisabled == false) {



                    //if (e.which == 1) {

                    $scope.whiteboardTabs[index].mousex = parseInt(e.offsetX / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]);
                    $scope.whiteboardTabs[index].mousey = parseInt(e.offsetY / $scope.zoomSet[$scope.whiteboardTabs[index].zoomIndex]);

                    var clr = $scope.whiteboardTabs[index].color;
                    var width = $scope.whiteboardTabs[index].width;
                    var fillOn = $scope.whiteboardTabs[index].fillOn;
                    var fillColor = $scope.whiteboardTabs[index].fillColor;

                    if ($scope.whiteboardTabs[index].tooltype == 'erase') {
                        clr = 'White';
                    }

                    if (($scope.whiteboardTabs[index].tooltype == 'draw' || $scope.whiteboardTabs[index].tooltype == 'erase') && ($scope.whiteboardTabs[index].last_mousex > 0 && $scope.whiteboardTabs[index].last_mousey > 0) && $scope.whiteboardTabs[index].mousedown && !$scope.whiteboardTabs[index].imageHold) {

                        $scope.whiteboardTabs[index].currentLine.type = 'customline';
                        $scope.whiteboardTabs[index].currentLine.cords.push({ mousex: $scope.whiteboardTabs[index].mousex, mousey: $scope.whiteboardTabs[index].mousey, last_mousex: $scope.whiteboardTabs[index].last_mousex, last_mousey: $scope.whiteboardTabs[index].last_mousey, color: clr, width: width, fillOn: false, fillColor: null });
                        $scope.drawCustomLine($scope.whiteboardTabs[index].tempCtx, $scope.whiteboardTabs[index].mousex, $scope.whiteboardTabs[index].mousey, $scope.whiteboardTabs[index].last_mousex, $scope.whiteboardTabs[index].last_mousey, clr, width);
                    }
                    else if ($scope.whiteboardTabs[index].last_mousex > 0 && $scope.whiteboardTabs[index].last_mousey > 0 && $scope.whiteboardTabs[index].mousedown) {

                        if ($scope.whiteboardTabs[index].tooltype == 'selection') {
                            if ($scope.whiteboardTabs[index].selectionMoveOn) {
                                $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                $scope.whiteboardTabs[index].currentLine.type = 'move';
                                if ($scope.whiteboardTabs[index].currentLine.cords.length > 1) {
                                    $scope.whiteboardTabs[index].currentLine.cords[1].mousex = $scope.whiteboardTabs[index].mousex;
                                    $scope.whiteboardTabs[index].currentLine.cords[1].mousey = $scope.whiteboardTabs[index].mousey;
                                }
                                else {
                                    $scope.whiteboardTabs[index].currentLine.cords.push({ mousex: $scope.whiteboardTabs[index].mousex, mousey: $scope.whiteboardTabs[index].mousey, last_mousex: $scope.whiteboardTabs[index].mousex, last_mousey: $scope.whiteboardTabs[index].mousey, color: clr, width: width });
                                }
                                $scope.drawTempMove(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].currentLine.cords[0].mousex, $scope.whiteboardTabs[index].currentLine.cords[0].mousey, $scope.whiteboardTabs[index].currentLine.cords[1].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[1].last_mousey, $scope.whiteboardTabs[index].mousex, $scope.whiteboardTabs[index].mousey);
                            }
                            else {
                                $scope.commonShapeMouseMoveSetup(index, clr, width);
                                $scope.drawTempSelection(index, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].mousex, $scope.whiteboardTabs[index].mousey);
                            }
                        }
                        else {
                            if ($scope.whiteboardTabs[index].holdMoveOn) {
                                // Held shape is being moved
                                var dist_x = $scope.whiteboardTabs[index].mousex - $scope.whiteboardTabs[index].holdCords.start_x;
                                var dist_y = $scope.whiteboardTabs[index].mousey - $scope.whiteboardTabs[index].holdCords.start_y;
                                if ($scope.whiteboardTabs[index].imageHold) {
                                    $scope.basicShapeMouseMoveSetup(index, 'image');
                                    $scope.whiteboardTabs[index].tempCtx.putImageData($scope.whiteboardTabs[index].heldImage, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + dist_x, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey + dist_y);
                                }
                                else {
                                    $scope.basicShapeMouseMoveSetup(index, $scope.whiteboardTabs[index].tooltype);
                                    $scope.commonShapeMouseMoveDraw(index, $scope.whiteboardTabs[index].tooltype, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex + dist_x, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey + dist_y, $scope.whiteboardTabs[index].currentLine.cords[0].mousex + dist_x, $scope.whiteboardTabs[index].currentLine.cords[0].mousey + dist_y, clr, width, fillOn, fillColor);
                                }
                            }
                            else if (!$scope.whiteboardTabs[index].textOn && !$scope.whiteboardTabs[index].equationOn) {
                                // Temp shape still being drawn
                                $scope.commonShapeMouseMoveSetup(index, clr, width);
                                $scope.commonShapeMouseMoveDraw(index, $scope.whiteboardTabs[index].tooltype, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousex, $scope.whiteboardTabs[index].currentLine.cords[0].last_mousey, $scope.whiteboardTabs[index].mousex, $scope.whiteboardTabs[index].mousey, clr, width, fillOn, fillColor);
                            }
                        }
                    }

                    $scope.whiteboardTabs[index].last_mousex = $scope.whiteboardTabs[index].mousex;
                    $scope.whiteboardTabs[index].last_mousey = $scope.whiteboardTabs[index].mousey;

                    //}

                    // }, e, index);
                };

                $scope.basicShapeMouseMoveSetup = function (index, toolType) {
                    $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                    $scope.whiteboardTabs[index].currentLine.type = toolType;
                    $scope.whiteboardTabs[index].currentLine.fillOn = $scope.whiteboardTabs[index].fillOn;
                    $scope.whiteboardTabs[index].currentLine.fillColor = $scope.whiteboardTabs[index].fillColor;
                };

                $scope.commonShapeMouseMoveSetup = function (index, clr, width) {
                    $scope.basicShapeMouseMoveSetup(index);
                    if ($scope.whiteboardTabs[index].currentLine.cords.length > 0) {
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousex = $scope.whiteboardTabs[index].mousex;
                        $scope.whiteboardTabs[index].currentLine.cords[0].mousey = $scope.whiteboardTabs[index].mousey;
                    }
                    else {
                        $scope.whiteboardTabs[index].currentLine.cords.push({ mousex: $scope.whiteboardTabs[index].mousex, mousey: $scope.whiteboardTabs[index].mousey, last_mousex: $scope.whiteboardTabs[index].mousex, last_mousey: $scope.whiteboardTabs[index].mousey, color: clr, width: width });
                    }
                };

                $scope.commonShapeMouseMoveDraw = function (index, toolType, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor) {
                    if (toolType == 'line') {
                        $scope.drawTempLine(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn);
                    }
                    else if (toolType == 'rectangle') {
                        $scope.drawTempRectangle(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'circle') {
                        $scope.drawTempCircle(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'ellipse') {
                        $scope.drawTempEllipse(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'triangle') {
                        $scope.drawTempTriangle(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'triangleR') {
                        $scope.drawTempTriangleR(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'pentagon') {
                        $scope.drawTempPentagon(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'hexagon') {
                        $scope.drawTempHexagon(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'octagon') {
                        $scope.drawTempOctagon(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'rhombus') {
                        $scope.drawTempRhombus(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'cuboid') {
                        $scope.drawTempCuboid(index, last_mousex, last_mousey, mousex, mousey, clr, width, fillOn, fillColor);
                    }
                    else if (toolType == 'text') {
                        $scope.drawTempText(index, last_mousex, last_mousey);
                    }
                };

                $scope.drawCanvas = function (index, startFrom, canvasData, ctx, noLoad, committed) {
                    for (var i = startFrom; i < canvasData.length; i++) {
                        if (canvasData[i].type == 'customline') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i]);
                            }
                            for (var a = 0; a < canvasData[i].cords.length; a++) {
                                $scope.drawCustomLine(ctx, canvasData[i].cords[a].last_mousex, canvasData[i].cords[a].last_mousey, canvasData[i].cords[a].mousex, canvasData[i].cords[a].mousey, canvasData[i].cords[a].color, canvasData[i].cords[a].width);
                            }
                        }
                        else if (canvasData[i].type == 'line') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i]);
                            }
                            $scope.drawLine(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width);
                        }
                        else if (canvasData[i].type == 'rectangle') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i]);
                            }
                            $scope.drawRectangle(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'circle') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo_Circle(index, canvasData[i]);
                            }
                            $scope.drawCircle(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'ellipse') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i]);
                            }
                            $scope.drawEllipse(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'triangle') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawTriangle(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'triangleR') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawTriangleR(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'pentagon') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawPentagon(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'hexagon') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawHexagon(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'octagon') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i]);
                            }
                            $scope.drawOctagon(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'rhombus') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawRhombus(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'cuboid') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 5);
                            }
                            $scope.drawCuboid(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[0].color, canvasData[i].cords[0].width, canvasData[i].fillOn, canvasData[i].fillColor);
                        }
                        else if (canvasData[i].type == 'clear') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo_Clear(index, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                            }
                            $scope.drawClear(ctx, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                        }
                        else if (canvasData[i].type == 'move') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo_Move(index, canvasData[i]);
                            }
                            $scope.drawMove(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey, canvasData[i].cords[1].last_mousex, canvasData[i].cords[1].last_mousey, canvasData[i].cords[1].mousex, canvasData[i].cords[1].mousey);
                        }
                        else if (canvasData[i].type == 'text') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo(index, canvasData[i], 1, true);
                            }
                            $scope.drawText(ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].text, canvasData[i].textColor, canvasData[i].textStyle);
                        }
                        else if (canvasData[i].type == 'equation') {
                            // REPLICATE FOR FILL DONE IN DRAW FILL AS MUST BE DONE PRIOR TO APPLY TO CANVAS BUT AFTER IMAGE CONVERSION
                            var textStyles = canvasData[i].textStyle.split(' ');
                            $scope.drawEquation(index, ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].text, canvasData[i].textColor, textStyles[0], textStyles[1], i, canvasData, noLoad, committed && (!noLoad || i + 10 >= canvasData.length));
                            break;
                        }
                        else if (canvasData[i].type == 'image') {
                            // REPLICATE FOR UNDO IN DRAW IMAGE AS MUST BE DONE ON LOAD
                            $scope.drawImage(index, ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].src, i, canvasData, noLoad, committed && (!noLoad || i + 10 >= canvasData.length));
                            break;
                        }
                        else if (canvasData[i].type == 'load') {
                            // THIS IS AN IMAGE PUT IN WITHOUT UNDO BEING SET
                            $scope.drawImage(index, ctx, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].src, i, canvasData, noLoad, false);
                            $scope.whiteboardTabs[index].undoHolder = [];
                            $scope.whiteboardTabs[index].undoStore = [];
                            break;
                        }
                        else if (canvasData[i].type == 'fill') {
                            // REPLICATE FOR FILL DONE IN DRAW FILL AS MUST BE DONE PRIOR TO APPLY TO CANVAS BUT AFTER CALCULATIONS
                            $scope.drawFill(index, ctx, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].color, committed && (!noLoad || i + 10 >= canvasData.length));
                        }
                        else if (canvasData[i].type == 'resize') {
                            if (committed && (!noLoad || i + 10 >= canvasData.length)) {
                                $scope.replicateForUndo_Resize(index, canvasData[i]);
                            }
                            $scope.resize(index, canvasData[i].cords[0].last_mousex, canvasData[i].cords[0].last_mousey, canvasData[i].cords[0].mousex, canvasData[i].cords[0].mousey);
                        }
                        else {
                            alert('element not found');
                        }
                    }
                };

                $scope.checkEnterResize = function (event, index) {
                    if (event.keyCode == 13) {
                        $scope.alterSize(index);
                    }
                };

                $scope.replicateForUndo = function (index, canvasData, extraBorder = 1, isText = false) {
                    if (canvasData.cords.length > 0) {
                        var minX = canvasData.cords[0].mousex == null ? canvasData.cords[0].last_mousex : canvasData.cords[0].mousex;
                        var maxX = minX;
                        var minY = canvasData.cords[0].mousey == null ? canvasData.cords[0].last_mousey : canvasData.cords[0].mousey;
                        var maxY = minY;

                        canvasData.cords.forEach(function (cord) {
                            if (cord.mousex < minX) {
                                minX = cord.mousex;
                            }
                            else if (cord.mousex > maxX) {
                                maxX = cord.mousex;
                            }
                            if (cord.last_mousex < minX) {
                                minX = cord.last_mousex;
                            }
                            else if (cord.last_mousex > maxX) {
                                maxX = cord.last_mousex;
                            }
                            if (cord.mousey < minY) {
                                minY = cord.mousey;
                            }
                            else if (cord.mousey > maxY) {
                                maxY = cord.mousey;
                            }
                            if (cord.last_mousey < minY) {
                                minY = cord.last_mousey;
                            }
                            else if (cord.last_mousey > maxY) {
                                maxY = cord.last_mousey;
                            }
                        });

                        if (isText == true) {
                            maxY = maxY + 5; // cb text needs more room for the tails of letters
                        }

                        $scope.shiftAndPushUndoHolder(index, {
                            imgData: $scope.whiteboardTabs[index].ctx.getImageData(minX - (extraBorder * canvasData.cords[0].width), minY - (extraBorder * canvasData.cords[0].width),
                                (maxX - minX) + (extraBorder * 2 * canvasData.cords[0].width), (maxY - minY) + (extraBorder * 2 * canvasData.cords[0].width)), x: minX - (extraBorder * canvasData.cords[0].width), y: minY - (extraBorder * canvasData.cords[0].width),
                            type: 'minMax'
                        });
                    }
                };

                $scope.replicateForUndo_Circle = function (index, canvasData) {
                    var diffX = canvasData.cords[0].mousex - canvasData.cords[0].last_mousex;
                    var diffY = canvasData.cords[0].mousey - canvasData.cords[0].last_mousey;
                    if (Math.abs(diffX) > Math.abs(diffY)) {
                        if (diffY > 0) {
                            diffY = Math.abs(diffX);
                        }
                        else {
                            diffY = -1 * Math.abs(diffX);
                        }
                    }
                    else {
                        if (diffX > 0) {
                            diffX = Math.abs(diffY);
                        }
                        else {
                            diffX = -1 * Math.abs(diffY);
                        }
                    }

                    $scope.shiftAndPushUndoHolder(index, {
                        imgData: $scope.whiteboardTabs[index].ctx.getImageData((diffX > 0 ? canvasData.cords[0].last_mousex : (canvasData.cords[0].last_mousex + diffX)) - canvasData.cords[0].width,
                            (diffY > 0 ? canvasData.cords[0].last_mousey : (canvasData.cords[0].last_mousey + diffY)) - canvasData.cords[0].width,
                            Math.abs(diffX) + (2 * canvasData.cords[0].width), Math.abs(diffY) + (2 * canvasData.cords[0].width)),
                        x: (diffX > 0 ? canvasData.cords[0].last_mousex : (canvasData.cords[0].last_mousex + diffX)) - canvasData.cords[0].width,
                        y: (diffY > 0 ? canvasData.cords[0].last_mousey : (canvasData.cords[0].last_mousey + diffY)) - canvasData.cords[0].width,
                        type: 'minMax'
                    });
                };

                $scope.replicateForUndo_Resize = function (index, canvasData) {
                    var dataX = null;
                    if (canvasData.cords[0].last_mousex > canvasData.cords[0].mousex) {
                        dataX = $scope.whiteboardTabs[index].ctx.getImageData(canvasData.cords[0].mousex - 3, -3, 6 + canvasData.cords[0].last_mousex - canvasData.cords[0].mousex, 6 + canvasData.cords[0].last_mousey);
                    }

                    var dataY = null;
                    if (canvasData.cords[0].last_mousey > canvasData.cords[0].mousey) {
                        dataY = $scope.whiteboardTabs[index].ctx.getImageData(-3, canvasData.cords[0].mousey - 3, 6 + canvasData.cords[0].last_mousex, 6 + canvasData.cords[0].last_mousey - canvasData.cords[0].mousey);
                    }

                    $scope.shiftAndPushUndoHolder(index, { dataX: dataX, prevX: canvasData.cords[0].last_mousex, nextX: canvasData.cords[0].mousex, dataY: dataY, prevY: canvasData.cords[0].last_mousey, nextY: canvasData.cords[0].mousey, type: 'resize' });
                };

                $scope.replicateForUndo_Clear = function (index, sizeX, sizeY) {
                    $scope.shiftAndPushUndoHolder(index, { imgData: $scope.whiteboardTabs[index].ctx.getImageData(0, 0, sizeX, sizeY), x: 0, y: 0, type: 'minMax' });
                };

                $scope.replicateForUndo_Load = function (index) {
                    $scope.whiteboardTabs[index].undoHolder = [];
                };

                $scope.replicateForUndo_Move = function (index, canvasData) {
                    var shiftX = canvasData.cords[1].mousex - canvasData.cords[1].last_mousex;
                    var shiftY = canvasData.cords[1].mousey - canvasData.cords[1].last_mousey;
                    $scope.shiftAndPushUndoHolder(index, {
                        imgData1: $scope.whiteboardTabs[index].ctx.getImageData(canvasData.cords[0].last_mousex - 3, canvasData.cords[0].last_mousey - 3
                            , 6 + canvasData.cords[0].mousex - canvasData.cords[0].last_mousex, 6 + canvasData.cords[0].mousey - canvasData.cords[0].last_mousey),
                        x1: canvasData.cords[0].last_mousex - 3,
                        y1: canvasData.cords[0].last_mousey - 3,
                        imgData2: $scope.whiteboardTabs[index].ctx.getImageData(canvasData.cords[0].last_mousex + shiftX - 3, canvasData.cords[0].last_mousey + shiftY - 3
                            , 6 + canvasData.cords[0].mousex - canvasData.cords[0].last_mousex, 6 + canvasData.cords[0].mousey - canvasData.cords[0].last_mousey),
                        x2: canvasData.cords[0].last_mousex + shiftX - 3,
                        y2: canvasData.cords[0].last_mousey + shiftY - 3,
                        type: 'move'
                    });
                };

                $scope.replicateForUndo_Image = function (index, canvasData, imageWidth, imageHeight) {
                    $scope.shiftAndPushUndoHolder(index, {
                        imgData: $scope.whiteboardTabs[index].ctx.getImageData(canvasData.cords[0].last_mousex, canvasData.cords[0].last_mousey, imageWidth, imageHeight),
                        x: canvasData.cords[0].last_mousex,
                        y: canvasData.cords[0].last_mousey,
                        type: 'minMax'
                    });
                };

                $scope.replicateForUndo_Equation = function (index, last_mousex, last_mousey, imageWidth, imageHeight) {
                    $scope.shiftAndPushUndoHolder(index, {
                        imgData: $scope.whiteboardTabs[index].ctx.getImageData(last_mousex, last_mousey - imageHeight, imageWidth, imageHeight),
                        x: last_mousex,
                        y: last_mousey - imageHeight,
                        type: 'minMax'
                    });
                };

                $scope.replicateForUndo_Fill = function (index, minX, minY, maxX, maxY) {
                    $scope.shiftAndPushUndoHolder(index, {
                        imgData: $scope.whiteboardTabs[index].ctx.getImageData(minX - 3, minY - 3, maxX + 6, maxY + 6),
                        x: minX - 3,
                        y: minY - 3,
                        type: 'minMax'
                    });
                };

                $scope.shiftAndPushUndoHolder = function (index, data) {
                    if ($scope.whiteboardTabs[index].undoHolder.length >= 10) {
                        $scope.whiteboardTabs[index].undoHolder.shift();
                    }
                    $scope.whiteboardTabs[index].undoHolder.push(data);
                };

                $scope.applyUndo = function (index) {
                    if ($scope.whiteboardTabs[index].undoHolder.length > 0) {
                        var toApply = $scope.whiteboardTabs[index].undoHolder.pop();
                        if (toApply.type == 'minMax') {
                            console.log('here', toApply);                            
                            $scope.whiteboardTabs[index].ctx.putImageData(toApply.imgData, toApply.x, toApply.y);
                        }
                        else if (toApply.type == 'resize') {
                            $scope.resize(index, toApply.nextX, toApply.nextY, toApply.prevX, toApply.prevY);
                            if (toApply.dataX != null) {
                                $scope.whiteboardTabs[index].ctx.putImageData(toApply.dataX, toApply.nextX - 3, -3);
                            }
                            if (toApply.dataY != null) {
                                $scope.whiteboardTabs[index].ctx.putImageData(toApply.dataY, -3, toApply.nextY - 3);
                            }
                        }
                        else if (toApply.type == 'move') {
                            $scope.whiteboardTabs[index].ctx.putImageData(toApply.imgData2, toApply.x2, toApply.y2);
                            $scope.whiteboardTabs[index].ctx.putImageData(toApply.imgData1, toApply.x1, toApply.y1);
                        }
                        else if (toApply.type == 'image') {
                            if ($scope.whiteboardTabs[index].canvas.width > toApply.prevX || $scope.whiteboardTabs[index].canvas.height > toApply.prevY) {
                                $scope.resize(index, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height, toApply.prevX, toApply.prevY);
                            }
                            $scope.whiteboardTabs[index].ctx.putImageData(toApply.imgData, toApply.x, toApply.y);
                        }
                    }
                };

                /***** RECIEVER FUNCTIONS START *****/

                $scope.removeIntermediate = function (index, intermediateId) {
                    if (intermediateId != undefined && intermediateId != null) {
                        for (var i = 0; i < $scope.whiteboardTabs[index].intermediateStore.length; i++) {
                            if ($scope.whiteboardTabs[index].intermediateStore[i].intermediateId == intermediateId) {
                                $scope.whiteboardTabs[index].intermediateStore.splice(i, 1);
                                $scope.whiteboardTabs[index].intermediateCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                                $scope.drawCanvas(index, 0, $scope.whiteboardTabs[index].intermediateStore, $scope.whiteboardTabs[index].intermediateCtx, false, false);
                                break;
                            }
                        }
                    }
                };

                $scope.whiteboardConnection.on('draw', function (sessionWhiteBoardId, history) {
                    for (var a = 0; a < $scope.whiteboardTabs.length; a++) {
                        if ($scope.whiteboardTabs[a] != null && $scope.whiteboardTabs[a].sessionWhiteBoardId == sessionWhiteBoardId) {
                            if ($scope.whiteboardTabs[a].undoStore.length > 0) {
                                $scope.whiteboardTabs[a].undoStore = [];
                            }
                            $scope.whiteboardTabs[a].canvasData.push(history.canvasData);
                            $scope.drawCanvas(a, $scope.whiteboardTabs[a].canvasData.length - 1, $scope.whiteboardTabs[a].canvasData, $scope.whiteboardTabs[a].ctx, false, true);
                            $scope.removeIntermediate(a, history.intermediateId);
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('undo', function (sessionWhiteBoardId, sessionWhiteBoardHistoryId) {
                    for (var a = 0; a < $scope.whiteboardTabs.length; a++) {
                        if ($scope.whiteboardTabs[a] != null && $scope.whiteboardTabs[a].sessionWhiteBoardId == sessionWhiteBoardId) {
                            for (var i = $scope.whiteboardTabs[a].canvasData.length - 1; i >= 0; i--) {
                                if ($scope.whiteboardTabs[a].canvasData[i].sessionWhiteBoardHistoryId == sessionWhiteBoardHistoryId) {
                                    $scope.whiteboardTabs[a].undoStore.push(sessionWhiteBoardHistoryId);
                                    $scope.whiteboardTabs[a].canvasData.splice(i, 1);
                                    $scope.applyUndo(a);
                                    break;
                                }
                            }
                        }
                    }
                });

                $scope.whiteboardConnection.on('redo', function (sessionWhiteBoardId, sessionWhiteBoardHistoryId, history) {
                    for (var a = 0; a < $scope.whiteboardTabs.length; a++) {
                        if ($scope.whiteboardTabs[a] != null && $scope.whiteboardTabs[a].sessionWhiteBoardId == sessionWhiteBoardId) {
                            for (var i = $scope.whiteboardTabs[a].undoStore.length - 1; i >= 0; i--) {
                                if (sessionWhiteBoardHistoryId == $scope.whiteboardTabs[a].undoStore[i]) {
                                    $scope.whiteboardTabs[a].undoStore.splice(i, 1);
                                    $scope.whiteboardTabs[a].canvasData.push(history.canvasData);
                                    $scope.drawCanvas(a, $scope.whiteboardTabs[a].canvasData.length - 1, $scope.whiteboardTabs[a].canvasData, $scope.whiteboardTabs[a].ctx, false, true);
                                    break;
                                }
                            }
                            if ($scope.whiteboardTabs[a].redoInProgress) {
                                $scope.whiteboardTabs[a].redoInProgress = false;
                            }
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('clear', function (sessionWhiteBoardId, result) {
                    for (var a = 0; a < $scope.whiteboardTabs.length; a++) {
                        if ($scope.whiteboardTabs[a] != null && $scope.whiteboardTabs[a].sessionWhiteBoardId == sessionWhiteBoardId) {
                            $scope.replicateForUndo_Clear(a, $scope.whiteboardTabs[a].canvas.width, $scope.whiteboardTabs[a].canvas.height);
                            $scope.drawClear($scope.whiteboardTabs[a].ctx, $scope.whiteboardTabs[a].canvas.width, $scope.whiteboardTabs[a].canvas.height);
                            $scope.whiteboardTabs[a].canvasData.push(result.canvasData);
                        }
                    }
                });

                $scope.whiteboardConnection.on('share', function (sessionWhiteBoardId, shares) {
                    for (var i = 0; i < shares.length; i++) {
                        if ($scope.userId == shares[i].userId) {
                            if (!shares[i].read) {
                                // Remove board
                                for (var j = 0; j < $scope.whiteboardTabs.length; j++) {
                                    if ($scope.whiteboardTabs[j] != null && $scope.whiteboardTabs[j].sessionWhiteBoardId == sessionWhiteBoardId) {
                                        $scope.closeWhiteboard(j);
                                        break;
                                    }
                                }
                                toastr.clear();
                                toastr.info('A whiteboard stopped being shared');
                            }
                            else if (!shares[i].previousRead && shares[i].read) {
                                // Add board
                                SessionWhiteBoardsService.getSharedBoard({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: sessionWhiteBoardId, userId: $scope.userId }, function (success) {
                                    // reciever handles this
                                    $scope.newTab(success);
                                    toastr.clear();
                                    toastr.info('A whiteboard was shared with you');
                                }, function (err) {
                                });
                            }
                            else if (shares[i].previousWrite != shares[i].write) {
                                // remove write permissions
                                for (var k = 0; k < $scope.whiteboardTabs.length; k++) {
                                    if ($scope.whiteboardTabs[k] != null && $scope.whiteboardTabs[k].sessionWhiteBoardId == sessionWhiteBoardId) {
                                        $scope.whiteboardTabs[k].writeDisabled = !shares[i].write;
                                        break;
                                    }
                                }
                                toastr.clear();
                                toastr.info('A whiteboard write permission was updated');
                            }
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('closed', function (sessionWhiteBoardId) {
                    for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardId) {
                            if ($('#qtntab-title-' + i).hasClass('active')) {
                                $('#qtntab-title-0').click();
                            }
                            $scope.disconnectFromWhiteBoard($scope.whiteboardTabs[i].sessionWhiteBoardId);
                            $scope.whiteboardTabs[i] = null;
                            toastr.clear();
                            toastr.info('A whiteboard stopped being shared');
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('named', function (sessionWhiteBoardId, name, showToastr) {
                    for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardId) {
                            if ($scope.whiteboardTabs[i].name != name) {

                                if (showToastr == true) {
                                    toastr.clear();
                                    toastr.info('\'' + $scope.whiteboardTabs[i].name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '\' was renamed to \'' + name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '\'');
                                }

                                $scope.whiteboardTabs[i].name = name;
                            }
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('collaborate', function (sessionWhiteBoardId, name) {
                    for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardId) {
                            $scope.whiteboardTabs[i].tutorCollaborating = true;
                            toastr.clear();
                            toastr.info('The tutor is now viewing \'' + name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '\'');
                            break;
                        }
                    }
                });

                $scope.whiteboardConnection.on('stopCollaborate', function (sessionWhiteBoardId, name) {
                    for (var i = 0; i < $scope.whiteboardTabs.length; i++) {
                        if ($scope.whiteboardTabs[i] != null && $scope.whiteboardTabs[i].sessionWhiteBoardId == sessionWhiteBoardId) {
                            $scope.whiteboardTabs[i].tutorCollaborating = false;
                            toastr.clear();
                            toastr.info('The tutor has stopped viewing \'' + name.replace(/<\/script>/g, "").replace(/<script>/g, "") + '\'');
                            break;
                        }
                    }
                });

                /***** RECIEVER FUNCTIONS END *****/

                /***** SENDER FUNCTIONS START *****/

                $scope.addCommand_WithIntermediate = function (index, command) {
                    debugger;
                    $scope.canWriteFunction(index, function (index, command) {
                        debugger;
                        command.intermediateId = $scope.uuIdGeneration();
                        var data = { sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId, historyType: command.type, jsonData: JSON.stringify(command), intermediateId: command.intermediateId };
                        debugger;
                        // To avoid race condition
                        if (command.type == "equation") {
                            command.type = "text";
                        }

                        $scope.whiteboardTabs[index].intermediateStore.push(command);
                        $scope.drawCanvas(index, $scope.whiteboardTabs[index].intermediateStore.length - 1, $scope.whiteboardTabs[index].intermediateStore, $scope.whiteboardTabs[index].intermediateCtx, false, false);

                        $scope.whiteboardConnection.invoke('addCommand', $scope.classSessionId, data);
                    }, index, command);
                };

                $scope.addCommand = function (index, command) {
                    $scope.canWriteFunction(index, function (index, command) {
                        var data = { sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId, historyType: command.type, jsonData: JSON.stringify(command) };
                        $scope.whiteboardConnection.invoke('addCommand', $scope.classSessionId, data);
                    }, index, command);
                };

                $scope.undo = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        if ($scope.whiteboardTabs[index].holdOn || $scope.whiteboardTabs[index].selectionOn) {
                            $scope.whiteboardTabs[index].equationOn = false;
                            $scope.whiteboardTabs[index].textOn = false;
                            $scope.whiteboardTabs[index].holdOn = false;
                            $scope.whiteboardTabs[index].selectionOn = false;
                            $scope.whiteboardTabs[index].currentLine = { type: 'customline', cords: [] };
                            $scope.whiteboardTabs[index].tempCtx.clearRect(0, 0, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                        }
                        else if ($scope.whiteboardTabs[index].canvasData[$scope.whiteboardTabs[index].canvasData.length - 1] != undefined &&
                            $scope.whiteboardTabs[index].canvasData[$scope.whiteboardTabs[index].canvasData.length - 1].type != 'load') {
                            $scope.whiteboardConnection.invoke('undo', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId,
                                $scope.whiteboardTabs[index].canvasData[$scope.whiteboardTabs[index].canvasData.length - 1].sessionWhiteBoardHistoryId);
                        }
                    }, index);
                };

                $scope.redo = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        if ($scope.whiteboardTabs[index].undoStore.length > 0 && !$scope.whiteboardTabs[index].redoInProgress) {
                            $scope.whiteboardTabs[index].redoInProgress = true;
                            $scope.whiteboardConnection.invoke('redo', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId,
                                $scope.whiteboardTabs[index].undoStore[$scope.whiteboardTabs[index].undoStore.length - 1]);
                        }
                    }, index);
                };

                $scope.clear = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) {
                            $scope.whiteboardConnection.invoke('clear', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId);
                        }, index);
                    }, index);
                };

                $scope.duplicate = function (index) {
                    $scope.triggerCommitFunction(index, function (index) {
                        $scope.performSave(index, true, 'Untitled', true);
                    }, index);
                };

                $scope.save = function (index, autoSave) {
                    $scope.triggerCommitFunction(index, function (index, autoSave) {
                        if (autoSave) {
                            if ($scope.whiteboardTabs[index].canvasData.length > 0 && $scope.whiteboardTabs[index].canvasData[$scope.whiteboardTabs[index].canvasData.length - 1].type != 'load') {
                                $scope.performSave(index, autoSave, $scope.whiteboardTabs[index].name);
                            }
                        }
                        else {
                            if ($scope.whiteboardTabs[index].canvasData.length > 0) {
                                ModalService.showModal({
                                    templateUrl: '/app/classroom/whiteboardSaveModal.html',
                                    controller: 'WhiteboardSaveModalController',
                                    inputs: {
                                        classSessionId: $scope.classSessionId,
                                        name: $scope.whiteboardTabs[index].name
                                    }
                                }).then(function (modal) {
                                    modal.close.then(function (result) {
                                        $scope.whiteboardTabs[index].mousedown = false;

                                        if (result != undefined) {
                                            $scope.performSave(index, autoSave, result);
                                        }
                                    });
                                });
                            }
                            else {
                                toastr.clear();
                                toastr.info("There was nothing to save");
                            }
                        }
                    }, index, autoSave);
                };

                $scope.getAsBase64PNGForUpload = function (index) {
                    return $scope.getAsBase64PNG(index).replace('data:image/png;base64,', '');
                };

                $scope.exportToDrive = function (index) {
                    var image = $scope.getAsBase64PNGForUpload(index);

                    SessionWhiteBoardsService.exportToDrive(image, $scope.whiteboardTabs[index].name, $scope.classSessionId, $scope.userId, function (success) {
                        toastr.clear();
                        toastr.success('Your work on this whiteboard has been successfully saved to your Google Drive');
                    }, function (err) {
                        toastr.clear();
                        toastr.error('There was an error saving your whiteboard, please try again');
                    });
                };


                $scope.performSave = function (index, autoSave, name, autoOpen) {
                    var image = $scope.getAsBase64PNGForUpload(index);

                    SessionWhiteBoardsService.save(image, name, $scope.whiteboardTabs[index].sizeX, $scope.whiteboardTabs[index].sizeY, $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId, function (success) {
                        if (autoSave) {
                            if (autoOpen) {
                                SessionWhiteBoardsService.openIndividualBoard({ classSessionId: $scope.classSessionId, sessionWhiteBoardSaveId: success }, function (success) {
                                    $scope.newTab(success);
                                }, function (err) {
                                });
                            }
                            else {
                                toastr.clear();
                                toastr.success("Your work on this whiteboard has been auto-saved");
                            }
                        } else {
                            toastr.clear();
                            toastr.success("Your work on this whiteboard has been successfully saved");
                        }
                    }, function (err) {
                        toastr.clear();
                        toastr.error('There was a problem saving your white, please try again');
                    });
                };

                $scope.load = function (index, sessionWhiteBoardSave) {
                    $scope.canWriteFunction(index, function (index, sessionWhiteBoardSave) {
                        $scope.whiteboardConnection.invoke('addLoadCommand', $scope.classSessionId, $scope.whiteboardTabs[index].sessionWhiteBoardId,
                            {
                                sessionWhiteBoardSaveId: sessionWhiteBoardSave.sessionWhiteBoardSaveId,
                                sizeX: $scope.whiteboardTabs[index].sizeX,
                                sizeY: $scope.whiteboardTabs[index].sizeY
                            });
                    }, index, sessionWhiteBoardSave);
                };

                $scope.tutorStoppedCollaborating = function (sessionWhiteBoardId, name) {
                    $scope.whiteboardConnection.invoke('tutorStoppedCollaborating', sessionWhiteBoardId, { name: name });
                };

                $scope.alterSize = function (index) {
                    $scope.canWriteFunction(index, function (index) {
                        $scope.triggerCommitFunction(index, function (index) {
                            var canvas = document.getElementById('canvas_' + index);
                            var prevHeight = canvas.height;
                            var prevWidth = canvas.width;
                            if ($scope.whiteboardTabs[index].sizeX != canvas.width || $scope.whiteboardTabs[index].sizeY != canvas.height) {
                                if ($scope.whiteboardTabs[index].sizeX <= 0) {
                                    $scope.whiteboardTabs[index].sizeX = 2000;
                                }
                                if ($scope.whiteboardTabs[index].sizeY <= 0) {
                                    $scope.whiteboardTabs[index].sizeY = 2000;
                                }
                                var data = {
                                    sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId,
                                    userId: $scope.userId,
                                    jsonData: JSON.stringify({
                                        type: 'resize',
                                        cords: [{
                                            last_mousex: prevWidth,
                                            last_mousey: prevHeight,
                                            mousex: $scope.whiteboardTabs[index].sizeX,
                                            mousey: $scope.whiteboardTabs[index].sizeY
                                        }]
                                    })
                                };
                                $scope.whiteboardConnection.invoke('alterSize', $scope.classSessionId, $scope.whiteboardTabs[index].sizeX, $scope.whiteboardTabs[index].sizeY, data);
                            }
                        }, index);
                    }, index);
                };

                /***** SENDER FUNCTIONS END *****/

                /***** DRAW FUNCTIONS START *****/
                $scope.drawCustomLine = function (ctx, prev_x, prev_y, x, y, clr, width) {
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(prev_x, prev_y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.closePath();
                };

                $scope.drawLine = function (ctx, start_x, start_y, x, y, clr, width) {
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(x, y);
                    ctx.closePath();
                    ctx.stroke();
                };

                $scope.drawRectangle = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.rect(start_x, start_y, x - start_x, y - start_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawMove = function (ctx, start_x, start_y, x, y, m_start_x, m_start_y, m_x, m_y) {
                    var imgData = ctx.getImageData(start_x, start_y, x - start_x, y - start_y);

                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, '#FFFFFF', 1);
                    ctx.rect(start_x, start_y, x - start_x, y - start_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, true, '#FFFFFF');

                    ctx.putImageData(imgData, x - start_x < 0 ? (start_x + (m_x - m_start_x) + (x - start_x)) : (start_x + (m_x - m_start_x)), y - start_y < 0 ? (start_y + (m_y - m_start_y) + (y - start_y)) : (start_y + (m_y - m_start_y)));
                };

                $scope.drawCircle = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var center_x = 0;
                    var center_y = 0;
                    var radius = 0;
                    var diff_x = x - start_x;
                    var diff_y = y - start_y;
                    if (Math.abs(diff_x) > Math.abs(diff_y)) {
                        diff_x = Math.abs(diff_x);
                        center_x = (x + start_x) / 2;
                        center_y = start_y + ((diff_y > 0 ? diff_x : -1 * diff_x) / 2);
                        radius = diff_x / 2;
                    }
                    else {
                        diff_y = Math.abs(diff_y);
                        center_y = (y + start_y) / 2;
                        center_x = start_x + ((diff_x > 0 ? diff_y : -1 * diff_y) / 2);
                        radius = diff_y / 2;
                    }
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawEllipse = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_y = (start_y + y) / 2;
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, mid_y);
                    ctx.bezierCurveTo(start_x, y, x, y, x, mid_y);
                    ctx.bezierCurveTo(x, start_y, start_x, start_y, start_x, mid_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawTriangle = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(x, start_y);
                    ctx.lineTo((x + start_x) / 2, y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawTriangleR = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(x, start_y);
                    ctx.lineTo(x, y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawPentagon = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_x = (start_x + x) / 2;
                    var part_x = ((x - start_x) / 2) * (1 / (1 + 1.902113));
                    var part_y = ((y - start_y) * 0.618034) / (1 + 0.618034);
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(mid_x, start_y);
                    ctx.lineTo(x, start_y + part_y);
                    ctx.lineTo(x - part_x, y);
                    ctx.lineTo(start_x + part_x, y);
                    ctx.lineTo(start_x, start_y + part_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawHexagon = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_y = (start_y + y) / 2;
                    var part_x = (0.707107 * (x - start_x)) / (1 + (2 * 0.707107));
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x + part_x, start_y);
                    ctx.lineTo(x - part_x, start_y);
                    ctx.lineTo(x, mid_y);
                    ctx.lineTo(x - part_x, y);
                    ctx.lineTo(start_x + part_x, y);
                    ctx.lineTo(start_x, mid_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawOctagon = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var part_x = (0.707107 * (x - start_x)) / (1 + (2 * 0.707107));
                    var part_y = (0.707107 * (y - start_y)) / (1 + (2 * 0.707107));
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x + part_x, start_y);
                    ctx.lineTo(x - part_x, start_y);
                    ctx.lineTo(x, start_y + part_y);
                    ctx.lineTo(x, y - part_y);
                    ctx.lineTo(x - part_x, y);
                    ctx.lineTo(start_x + part_x, y);
                    ctx.lineTo(start_x, y - part_y);
                    ctx.lineTo(start_x, start_y + part_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawRhombus = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_x = (start_x + x) / 2;
                    var mid_y = (start_y + y) / 2;
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(mid_x, start_y);
                    ctx.lineTo(x, mid_y);
                    ctx.lineTo(mid_x, y);
                    ctx.lineTo(start_x, mid_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawCuboid = function (ctx, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var part_x = (5 * (x - start_x)) / (2 * (1 + 2.5));
                    var part_y = (5 * (y - start_y)) / (2 * (1 + 2.5));
                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(start_x + part_x, start_y);
                    ctx.lineTo(start_x + part_x, start_y + part_y);
                    ctx.lineTo(start_x, start_y + part_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);

                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x + part_x, start_y);
                    ctx.lineTo(x, y - part_y);
                    ctx.lineTo(x, y);
                    ctx.lineTo(start_x + part_x, start_y + part_y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);

                    ctx.beginPath();
                    $scope.assignBasicDrawParams(ctx, clr, width);
                    ctx.moveTo(start_x, start_y + part_y);
                    ctx.lineTo(start_x + part_x, start_y + part_y);
                    ctx.lineTo(x, y);
                    ctx.lineTo(x - part_x, y);
                    ctx.closePath();
                    ctx.stroke();
                    $scope.assignFillDrawParams(ctx, fillOn, fillColor);
                };

                $scope.drawClear = function (ctx, width, height) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                };

                $scope.drawLoad = function (index, ctx, sessionWhiteBoardId, createdAt, sizeX, sizeY) {
                    $scope.drawClear(ctx, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height);
                    $scope.resize(index, $scope.whiteboardTabs[index].canvas.width, $scope.whiteboardTabs[index].canvas.height, sizeX, sizeY);
                    $scope.whiteboardTabs[index].canvasData = [$scope.whiteboardTabs[index].canvasData[$scope.whiteboardTabs[index].canvasData.length - 1]];
                    $scope.whiteboardTabs[index].undoStore = [];
                    SessionWhiteBoardsService.getLoadData({ classSessionId: $scope.classSessionId }, { sessionWhiteBoardId: sessionWhiteBoardId, createdAt: createdAt }, function (success) {
                        $scope.whiteboardTabs[index].loadSet = success;
                        $scope.drawCanvas(index, 0, $scope.whiteboardTabs[index].loadSet, $scope.whiteboardTabs[index].ctx, undefined, true);
                    }, function (err) {
                    });
                };

                $scope.drawText = function (ctx, start_x, start_y, text, textColor, textStyle) {
                    ctx.font = textStyle;
                    ctx.textBassline = 'Bottom';
                    ctx.textAlign = 'left';
                    ctx.fillStyle = textColor;
                    ctx.fillText(text, start_x, start_y);
                };

                $scope.drawEquation = function (index, ctx, start_x, start_y, text, color, fontSize, font, i, canvasData, noLoad, populateUndo) {
                    $scope.applyMathJax(index, text, color, fontSize, font, function (svg, width, height) {
                        base_image = new Image();
                        base_image.src = svg;
                        if (populateUndo) {
                            $scope.replicateForUndo_Equation(index, start_x, start_y, width, height);
                        }
                        base_image.onload = function () {
                            ctx.drawImage(base_image, start_x, start_y - base_image.height);
                            $scope.drawCanvas(index, ++i, canvasData, ctx, noLoad, true);
                        };
                    });
                };

                $scope.drawImage = function (index, ctx, start_x, start_y, src, i, canvasData, noLoad, populateUndo) {
                    var image = new Image();
                    image.src = '../../../api/classroom/' + $scope.classSessionId + '/SessionWhiteBoards/getImage/' + $scope.whiteboardTabs[index].sessionWhiteBoardId + '/' + src;
                    image.onload = function () {
                        if (populateUndo) {
                            $scope.replicateForUndo_Image(index, canvasData[i], image.width, image.height);
                        }
                        ctx.drawImage(image, start_x, start_y);
                        $scope.drawCanvas(index, ++i, canvasData, ctx, noLoad, true);
                    };
                };

                $scope.drawFill = function (index, ctx, width, height, start_x, start_y, clr, populateUndo) {

                    var minX = start_x;
                    var minY = start_y;
                    var maxX = start_x;
                    var maxY = start_y;

                    // Gets properties of canvas
                    var maxWidth = width * 4;
                    var imgData = ctx.getImageData(0, 0, width, height);
                    var start = (start_x + (start_y * width)) * 4;
                    var fillPoint_R_Bottom = imgData.data[start] - 10;
                    var fillPoint_G_Bottom = imgData.data[start + 1] - 10;
                    var fillPoint_B_Bottom = imgData.data[start + 2] - 10;
                    var fillPoint_A_Bottom = imgData.data[start + 3] - 10;

                    var fillPoint_R_Top = imgData.data[start] + 10;
                    var fillPoint_G_Top = imgData.data[start + 1] + 10;
                    var fillPoint_B_Top = imgData.data[start + 2] + 10;
                    var fillPoint_A_Top = imgData.data[start + 3] + 10;

                    var investigateArray = Array(imgData.data.length / 4);
                    investigateArray = Array.apply(false);
                    investigateArray[start] = true;
                    var stackArray = [start];
                    var currentStackIndex = 0;
                    var xyPoints = [];
                    do {
                        var frontOfQueue = stackArray[currentStackIndex];
                        var invPoint = 0;
                        for (var i = frontOfQueue - 4; i <= frontOfQueue + 4; i = i + 8) {
                            invPoint = i / 4;
                            if (!investigateArray[invPoint] && Math.floor(i / maxWidth) == Math.floor(frontOfQueue / maxWidth)) {
                                if (imgData.data[i] >= fillPoint_R_Bottom && imgData.data[i] <= fillPoint_R_Top &&
                                    imgData.data[i + 1] >= fillPoint_G_Bottom && imgData.data[i + 1] <= fillPoint_G_Top &&
                                    imgData.data[i + 2] >= fillPoint_B_Bottom && imgData.data[i + 2] <= fillPoint_B_Top &&
                                    imgData.data[i + 3] >= fillPoint_A_Bottom && imgData.data[i + 3] <= fillPoint_A_Top) {
                                    stackArray.push(i);
                                }
                                investigateArray[invPoint] = true;
                            }
                        }
                        for (var j = frontOfQueue - maxWidth; j <= frontOfQueue + maxWidth; j = j + (2 * maxWidth)) {
                            invPoint = j / 4;
                            if (!investigateArray[invPoint] && frontOfQueue >= 0 && frontOfQueue < imgData.data.length) {
                                if (imgData.data[j] >= fillPoint_R_Bottom && imgData.data[j] <= fillPoint_R_Top &&
                                    imgData.data[j + 1] >= fillPoint_G_Bottom && imgData.data[j + 1] <= fillPoint_G_Top &&
                                    imgData.data[j + 2] >= fillPoint_B_Bottom && imgData.data[j + 2] <= fillPoint_B_Top &&
                                    imgData.data[j + 3] >= fillPoint_A_Bottom && imgData.data[j + 3] <= fillPoint_A_Top) {
                                    stackArray.push(j);
                                }
                                investigateArray[invPoint] = true;
                            }
                        }
                        xyPoints.push({ x: (frontOfQueue / 4) % width, y: Math.floor(frontOfQueue / maxWidth) });
                        currentStackIndex++;
                    } while (currentStackIndex < stackArray.length);

                    if (populateUndo) {
                        xyPoints.forEach(function (value) {
                            if (value.x < minX) {
                                minX = value.x;
                            }
                            else if (value.x > maxX) {
                                maxX = value.x;
                            }
                            if (value.y < minY) {
                                minY = value.y;
                            }
                            else if (value.y > maxY) {
                                maxY = value.y;
                            }
                        });

                        $scope.replicateForUndo_Fill(index, minX, minY, maxX, maxY);
                    }

                    $scope.assignBasicDrawParams(ctx, clr, 1);
                    //ctx.lineJoin = 'miter';
                    //ctx.lineCap = 'butt';
                    xyPoints.forEach(function (value) {
                        ctx.beginPath();
                        ctx.moveTo(value.x, value.y);
                        ctx.lineTo(value.x + 1, value.y + 1);
                        ctx.stroke();
                        ctx.closePath();
                    });
                };

                $scope.resize = function (index, start_x, start_y, x, y) {
                    $scope.whiteboardTabs[index].sizeX = x;
                    $scope.whiteboardTabs[index].sizeY = y;
                    var canvas = document.getElementById('canvas_' + index);
                    var imageData = $scope.whiteboardTabs[index].ctx.getImageData(0, 0, start_x, start_y);
                    canvas.setAttribute('width', x);
                    canvas.setAttribute('height', y);
                    $scope.whiteboardTabs[index].ctx.putImageData(imageData, 0, 0);
                    if (start_y < y) {
                        $scope.drawRectangle($scope.whiteboardTabs[index].ctx, 0, start_y, x, y, '#FFFFFF', 0, true, '#FFFFFF');
                    }
                    if (start_x < x) {
                        $scope.drawRectangle($scope.whiteboardTabs[index].ctx, start_x, 0, x, y, '#FFFFFF', 0, true, '#FFFFFF');
                    }

                    var tempCanvas = document.getElementById('canvas_temp_' + index);
                    var imageDataTemp = $scope.whiteboardTabs[index].tempCtx.getImageData(0, 0, start_x, start_y);
                    tempCanvas.setAttribute('width', x);
                    tempCanvas.setAttribute('height', y);
                    $scope.whiteboardTabs[index].tempCtx.putImageData(imageDataTemp, 0, 0);

                    var intermediateCanvas = document.getElementById('canvas_intermediate_' + index);
                    var imageDataIntermediate = $scope.whiteboardTabs[index].intermediateCtx.getImageData(0, 0, start_x, start_y);
                    intermediateCanvas.setAttribute('width', x);
                    intermediateCanvas.setAttribute('height', y);
                    $scope.whiteboardTabs[index].intermediateCtx.putImageData(imageDataIntermediate, 0, 0);
                };

                ///***** DRAW FUNCTIONS END *****/

                /***** TEMP DRAW FUNCTIONS START *****/

                $scope.drawTempLine = function (index, start_x, start_y, x, y, clr, width) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                };

                $scope.drawTempRectangle = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.rect(start_x, start_y, x - start_x, y - start_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempHoldMove = function (index, start_x, start_y, x, y, width, type) {
                    if (type == "circle") {
                        var recalulatedPoints = $scope.recalculateCircleBox(start_x, start_y, x, y);
                        $scope.drawTempHoldMove_Step2(index, recalulatedPoints.start_x, recalulatedPoints.start_y, recalulatedPoints.x, recalulatedPoints.y, width);
                    }
                    else {
                        $scope.drawTempHoldMove_Step2(index, start_x, start_y, x, y, width);
                    }
                };

                $scope.recalculateCircleBox = function (start_x, start_y, x, y) {
                    var diff_x = x - start_x;
                    var diff_y = y - start_y;
                    if (Math.abs(diff_x) > Math.abs(diff_y)) {
                        if (diff_y > 0) {
                            y = start_y + Math.abs(diff_x);
                        }
                        else {
                            y = start_y - Math.abs(diff_x);
                        }
                    }
                    else {
                        if (diff_x > 0) {
                            x = start_x + Math.abs(diff_y);
                        }
                        else {
                            x = start_x - Math.abs(diff_y);
                        }
                    }
                    return { start_x: start_x, start_y: start_y, x: x, y: y };
                };

                $scope.drawTempHoldMove_Step2 = function (index, start_x, start_y, x, y, width) {
                    width = (width / 2) + 1;
                    if (start_x < x) {
                        start_x = start_x - width;
                        x = x + width;
                    }
                    else {
                        start_x = start_x + width;
                        x = x - width;
                    }
                    if (start_y < y) {
                        start_y = start_y - width;
                        y = y + width;
                    }
                    else {
                        start_y = start_y + width;
                        y = y - width;
                    }
                    $scope.drawTempSelection(index, start_x, start_y, x, y);
                };

                $scope.drawTempSelection = function (index, start_x, start_y, x, y) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, '#000000', 1);
                    $scope.whiteboardTabs[index].tempCtx.setLineDash([5, 5]);
                    $scope.whiteboardTabs[index].tempCtx.rect(start_x, start_y, x - start_x, y - start_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                };

                $scope.drawTempMove = function (index, start_x, start_y, x, y, m_start_x, m_start_y, m_x, m_y) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, '#FFFFFF', 1);
                    $scope.whiteboardTabs[index].tempCtx.rect(start_x, start_y, x - start_x, y - start_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, true, '#FFFFFF');

                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, '#000000', 1);
                    $scope.whiteboardTabs[index].tempCtx.setLineDash([5, 5]);
                    $scope.whiteboardTabs[index].tempCtx.rect(start_x + (m_x - m_start_x), start_y + (m_y - m_start_y), x - start_x, y - start_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();

                    var imgData = $scope.whiteboardTabs[index].ctx.getImageData(start_x, start_y, x - start_x, y - start_y);
                    $scope.whiteboardTabs[index].tempCtx.putImageData(imgData, x - start_x < 0 ? (start_x + (m_x - m_start_x) + (x - start_x)) : (start_x + (m_x - m_start_x)), y - start_y < 0 ? (start_y + (m_y - m_start_y) + (y - start_y)) : (start_y + (m_y - m_start_y)));
                };

                $scope.drawTempCircle = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var center_x = 0;
                    var center_y = 0;
                    var radius = 0;
                    var diff_x = x - start_x;
                    var diff_y = y - start_y;
                    if (Math.abs(diff_x) > Math.abs(diff_y)) {
                        diff_x = Math.abs(diff_x);
                        center_x = (x + start_x) / 2;
                        center_y = start_y + ((diff_y > 0 ? diff_x : -1 * diff_x) / 2);
                        radius = diff_x / 2;
                    }
                    else {
                        diff_y = Math.abs(diff_y);
                        center_y = (y + start_y) / 2;
                        center_x = start_x + ((diff_x > 0 ? diff_y : -1 * diff_y) / 2);
                        radius = diff_y / 2;
                    }
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempEllipse = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_y = (start_y + y) / 2;
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.bezierCurveTo(start_x, y, x, y, x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.bezierCurveTo(x, start_y, start_x, start_y, start_x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempTriangle = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo((x + start_x) / 2, y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempTriangleR = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempPentagon = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_x = (start_x + x) / 2;
                    var part_x = ((x - start_x) / 2) * (1 / (1 + 1.902113));
                    var part_y = ((y - start_y) * 0.618034) / (1 + 0.618034);
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(mid_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempHexagon = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_y = (start_y + y) / 2;
                    var part_x = (0.707107 * (x - start_x)) / (1 + (2 * 0.707107));
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x + part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempOctagon = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var part_x = (0.707107 * (x - start_x)) / (1 + (2 * 0.707107));
                    var part_y = (0.707107 * (y - start_y)) / (1 + (2 * 0.707107));
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x + part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y - part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, y - part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempRhombus = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var mid_x = (start_x + x) / 2;
                    var mid_y = (start_y + y) / 2;
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(mid_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(mid_x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, mid_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempCuboid = function (index, start_x, start_y, x, y, clr, width, fillOn, fillColor) {
                    var part_x = (5 * (x - start_x)) / (2 * (1 + 2.5));
                    var part_y = (5 * (y - start_y)) / (2 * (1 + 2.5));
                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);

                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x + part_x, start_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y - part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);

                    $scope.whiteboardTabs[index].tempCtx.beginPath();
                    $scope.assignBasicTempDrawParams(index, clr, width);
                    $scope.whiteboardTabs[index].tempCtx.moveTo(start_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(start_x + part_x, start_y + part_y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x, y);
                    $scope.whiteboardTabs[index].tempCtx.lineTo(x - part_x, y);
                    $scope.whiteboardTabs[index].tempCtx.closePath();
                    $scope.whiteboardTabs[index].tempCtx.stroke();
                    $scope.assignFillDrawParams($scope.whiteboardTabs[index].tempCtx, fillOn, fillColor);
                };

                $scope.drawTempText = function (index, start_x, start_y) {
                    $scope.whiteboardTabs[index].tempCtx.font = $scope.whiteboardTabs[index].fontSize + 'px ' + $scope.whiteboardTabs[index].font;
                    $scope.whiteboardTabs[index].tempCtx.textBassline = 'Bottom';
                    $scope.whiteboardTabs[index].tempCtx.textAlign = 'left';
                    $scope.whiteboardTabs[index].tempCtx.fillStyle = $scope.whiteboardTabs[index].textColor;
                    var textProps = {
                        width: Math.ceil($scope.whiteboardTabs[index].tempCtx.measureText($scope.whiteboardTabs[index].text).width), height: $scope.whiteboardTabs[index].fontSize
                    };
                    $scope.whiteboardTabs[index].tempCtx.fillText($scope.whiteboardTabs[index].text, start_x, start_y);
                    return textProps;
                };

                $scope.drawTempEquation = function (index, start_x, start_y) {

                    $scope.whiteboardTabs[index].tempCtx.font = $scope.whiteboardTabs[index].fontSize + 'px ' + $scope.whiteboardTabs[index].font;
                    $scope.whiteboardTabs[index].tempCtx.textBassline = 'Bottom';
                    $scope.whiteboardTabs[index].tempCtx.textAlign = 'left';
                    $scope.whiteboardTabs[index].tempCtx.fillStyle = $scope.whiteboardTabs[index].textColor;
                    var textProps = {
                        width: Math.ceil($scope.whiteboardTabs[index].tempCtx.measureText($scope.whiteboardTabs[index].equation).width), height: 20 //$scope.whiteboardTabs[index].fontSize
                    };
                    $scope.whiteboardTabs[index].tempCtx.fillText($scope.whiteboardTabs[index].equation, start_x, start_y);
                    return textProps;
                };

                $scope.drawTempImage = function (index, start_x, start_y, src) {
                    var image = new Image();
                    image.src = '../../../api/classroom/' + $scope.classSessionId + '/SessionWhiteBoards/getImage/' + $scope.whiteboardTabs[index].sessionWhiteBoardId + '/' + src;
                    image.onload = function () {
                        $scope.whiteboardTabs[index].tempCtx.drawImage(image, start_x, start_y);
                        $scope.whiteboardTabs[index].currentLine = { type: 'image', src: src, cords: [{ width: 0, last_mousex: 0, last_mousey: 0, mousex: image.width, mousey: image.height }] };
                        $scope.whiteboardTabs[index].heldImage = $scope.whiteboardTabs[index].tempCtx.getImageData(0, 0, image.width, image.height);
                        $scope.drawTempHoldMove(index, start_x, start_y, image.width, image.height, 0, 'image');
                    };
                };

                ///***** TEMP DRAW FUNCTIONS END *****/

                /***** COMMON DRAW FUNCTIONS START *****/

                $scope.assignFillDrawParams = function (ctx, fillOn, fillColor) {
                    if (fillColor != '' && fillColor != 'transparent') {
                        ctx.fillStyle = fillColor;
                        ctx.fill();
                    }
                };

                $scope.assignBasicDrawParams = function (ctx, clr, width) {
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = clr;
                    ctx.lineWidth = width;
                    //ctx.lineJoin = ctx.lineCap = 'round';
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'miter';
                };

                $scope.assignBasicTempDrawParams = function (index, clr, width) {
                    $scope.whiteboardTabs[index].tempCtx.globalCompositeOperation = 'source-over';
                    $scope.whiteboardTabs[index].tempCtx.setLineDash([]);
                    $scope.whiteboardTabs[index].tempCtx.strokeStyle = clr;
                    $scope.whiteboardTabs[index].tempCtx.lineWidth = width;
                    //$scope.whiteboardTabs[index].tempCtx.lineJoin = $scope.whiteboardTabs[index].tempCtx.lineCap = 'round';
                    $scope.whiteboardTabs[index].tempCtx.lineCap = 'round';
                    $scope.whiteboardTabs[index].tempCtx.lineJoin = 'miter';
                };

                $scope.applyMathJax = function (index, text, color, fontSize, font, callback) {
                    // Create a script element with the LaTeX code
                    var div = document.getElementById('mathjax-container-' + index);
                    div.style.fontSize = fontSize;
                    div.style.fontFamily = font;
                    var se = document.createElement("script");
                    se.setAttribute("type", "math/tex");
                    se.innerHTML = '\\definecolor{eqcol}{RGB}{' + parseInt(color[1] + color[2], 16) + ',' + parseInt(color[3] + color[4], 16) + ',' + parseInt(color[5] + color[6], 16) + '} ' +
                        '\\color{eqcol}    ' +
                        text;
                    div.appendChild(se);
                    MathJax.Hub.Process(se, function () {
                        var frame = document.getElementById(se.id + "-Frame");
                        if (!frame) {
                            setTimeout(display, 500);
                            return;
                        }

                        // Load the SVG
                        var svg = frame.getElementsByTagName("svg")[0];
                        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                        svg.setAttribute("version", "1.1");
                        var height = svg.parentNode.offsetHeight;
                        var width = svg.parentNode.offsetWidth;
                        svg.setAttribute("height", height);
                        svg.setAttribute("width", width);
                        svg.removeAttribute("style");

                        // Embed the global MathJAX elements to it
                        var mathJaxGlobal = document.getElementById("MathJax_SVG_glyphs");
                        svg.appendChild(mathJaxGlobal.cloneNode(true));

                        // Create a data URL
                        var svgSource = '<?xml version="1.0" encoding="UTF-8"?>' + "\n" + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + "\n" + svg.outerHTML;
                        var retval = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgSource)));


                        // Remove the temporary elements
                        div.removeChild(se);

                        // Invoke the user callback
                        callback(retval, width, height);
                    });
                };

                /***** COMMON DRAW FUNCTIONS END *****/

                $scope.nameChanged = function (index) {
                    SessionWhiteBoardsService.changeName({ classSessionId: $scope.classSessionId, sessionWhiteBoardId: $scope.whiteboardTabs[index].sessionWhiteBoardId }, { name: $scope.whiteboardTabs[index].name }, function (success) {
                    }, function (err) {
                    });
                };
            }
        ]);
})();