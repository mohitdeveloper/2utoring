"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSessionsRegisterComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var utilities_alert_modal_1 = require("../../utilities/utilities-alert-modal/utilities-alert-modal");
var ngx_toastr_1 = require("ngx-toastr");
var session_groups_modal_component_1 = require("../../session-groups/session-groups-modal.component");
var rxjs_1 = require("rxjs");
var dialog_1 = require("@angular/material/dialog");
var ClassSessionsRegisterComponent = /** @class */ (function () {
    function ClassSessionsRegisterComponent(sessionAttendeesService, classSessionsService, modalService, tutorsService, toastrService, sessionGroupsService, classSessionFeaturesService, dataDialog, dialogRef) {
        this.sessionAttendeesService = sessionAttendeesService;
        this.classSessionsService = classSessionsService;
        this.modalService = modalService;
        this.tutorsService = tutorsService;
        this.toastrService = toastrService;
        this.sessionGroupsService = sessionGroupsService;
        this.classSessionFeaturesService = classSessionFeaturesService;
        this.dataDialog = dataDialog;
        this.dialogRef = dialogRef;
        this.classSessionId = '';
        this.tutorCommand = new index_1.TutorCommandGroup();
        this.isCollapsed = false;
        this.sessionAttendeesCount = 0;
        this.selectedUsers = [];
        this.classSessionId = dataDialog.classSessionId ? dataDialog.classSessionId : classSessionId;
        this.goBack = dataDialog.classSessionId ? false : true;
        this.isCompany = dataDialog.that.isCompany;
        this.sessionAttendeesCount = dataDialog.sessionAttendeesCount;
        this.isAdd = dataDialog.isAdd;
        debugger;
        this.lessondetail = dataDialog.lessondetail;
    }
    ClassSessionsRegisterComponent.prototype.closeLessonDialog = function () {
        this.dialogRef.close();
    };
    ClassSessionsRegisterComponent.prototype.getSessionAttendees = function () {
        var _this = this;
        this.selectedUsers = [];
        $('.loading').show();
        this.sessionGroupsService.getTutorCommand(this.classSessionId)
            .subscribe(function (success) {
            _this.tutorCommand = success;
            $('.loading').hide();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    // usage getClassSessionFeaturesByTutorId(xxx).subscribe(features => { // do stuff with features });
    ClassSessionsRegisterComponent.prototype.getClassSessionFeaturesByTutorId = function (tutorId) {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            //console.log("Getting classroom subscription features..");
            _this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(_this.tutor.tutorId)
                .subscribe(function (features) {
                //console.log("Got classroom subscription features:", features);
                _this.classSessionFeatures = features;
                subscriber.next(features);
                if (_this.isAdd) {
                    _this.addGroup();
                }
            }, function (error) { console.log("Could not get classroom subscription features"); });
        });
    };
    ClassSessionsRegisterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getSessionAttendees();
        this.classSessionsService.getById(this.classSessionId)
            .subscribe(function (success) {
            debugger;
            _this.classSession = success;
        }, function (error) {
            console.log(error);
        });
        this.tutorsService.getMy()
            .subscribe(function (success) {
            _this.tutor = success;
            if (_this.tutor != null) {
                _this.getClassSessionFeaturesByTutorId(_this.tutor.tutorId).subscribe();
            }
        }, function (error) {
            console.log(error);
        });
    };
    ;
    ClassSessionsRegisterComponent.prototype.checkLessonValiditityByTime = function () {
        var dt1 = new Date().getTime();
        var dt2 = new Date(this.lessondetail.endDate).getTime();
        if (dt1 > dt2) {
            this.toastrService.error('Action not allowed.');
            return true;
        }
        return false;
    };
    ClassSessionsRegisterComponent.prototype.remove = function (sessionAttendee) {
        var _this = this;
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove student';
        modalRef.componentInstance.message = 'Are you sure you want to remove this student.';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                $('.loading').show();
                _this.sessionAttendeesService.remove(_this.classSessionId, sessionAttendee.sessionAttendeeId)
                    .subscribe(function (success) {
                    _this.getSessionAttendees();
                }, function (error) {
                    console.log(error);
                });
            }
        }, function (reason) {
        });
    };
    ;
    ClassSessionsRegisterComponent.prototype.undoRemove = function (sessionAttendee) {
        var _this = this;
        $('.loading').show();
        this.sessionAttendeesService.undoRemove(this.classSessionId, sessionAttendee.sessionAttendeeId)
            .subscribe(function (success) {
            _this.getSessionAttendees();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    ClassSessionsRegisterComponent.prototype.refund = function (sessionAttendee) {
        var _this = this;
        debugger;
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Refund student';
        modalRef.componentInstance.message = 'Are you sure you want to refund this student.';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Refund';
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                $('.loading').show();
                _this.sessionAttendeesService.refund(_this.classSessionId, sessionAttendee.sessionAttendeeId)
                    .subscribe(function (success) {
                    if (success == true) {
                        _this.getSessionAttendees();
                    }
                    else {
                        _this.toastrService.error('Could not refund. Please contact support');
                        $('.loading').hide();
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }, function (reason) {
        });
    };
    ;
    ClassSessionsRegisterComponent.prototype.canAddGroup = function () {
        var groupCount = 0;
        if (this.tutorCommand.groups)
            groupCount = this.tutorCommand.groups.length;
        //console.log("Current group count:", groupCount);
        var currentGroupsCount = groupCount;
        //console.log("MaxGroups",this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups);
        if (this.classSessionFeatures && currentGroupsCount < this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups)
            return true;
        return false;
    };
    ClassSessionsRegisterComponent.prototype.NotAllowed = function () {
        this.toastrService.error("Your subscription does not allow you to add more groups.", "Oops! Sorry", { timeOut: 5000 });
    };
    ClassSessionsRegisterComponent.prototype.addGroup = function () {
        var _this = this;
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        if (!this.classSession.started && this.sessionAttendeesCount > 1) {
            if (!this.canAddGroup()) {
                this.toastrService.error('Action not allowed.');
                //this.addGroupNotAllowed();
                return;
            }
            var modalRef = this.modalService.open(session_groups_modal_component_1.SessionGroupsModalComponent, {
                size: 'md',
            });
            var group = new index_1.SessionGroupDraggable();
            group.classSessionId = this.classSessionId;
            //set any variables
            modalRef.componentInstance.classSessionId = this.classSessionId;
            modalRef.componentInstance.group = group;
            //handle the response
            modalRef.result.then(function (result) {
                if (result !== undefined && result != null) {
                    _this.tutorCommand.groups.push(result);
                    $('.loading').hide();
                }
            }, function (reason) {
            });
        }
        else {
            this.toastrService.error('Action not allowed.');
            return;
        }
    };
    ;
    ClassSessionsRegisterComponent.prototype.removeFromGroup = function (sessionGroup, sessionAttendee) {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove User From Group';
        modalRef.componentInstance.message = 'Are you sure you want to remove this user from the group?';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                $('.loading').show();
                _this.sessionGroupsService.removeFromGroup(_this.classSessionId, sessionGroup.sessionGroupId, { groupId: sessionGroup.sessionGroupId, userIds: [sessionAttendee.userId] })
                    .subscribe(function (success) {
                    _this.toastrService.success('Group Removed.');
                    //this.getSessionAttendees();
                    var groupIdx = _this.tutorCommand.groups.findIndex(function (o) { return o.sessionGroupId == sessionGroup.sessionGroupId; });
                    _this.tutorCommand.groups[groupIdx].sessionAttendees.splice(_this.tutorCommand.groups[groupIdx].sessionAttendees.findIndex(function (o) { return o.userId == sessionAttendee.userId; }), 1);
                    $('.loading').hide();
                }, function (error) {
                    console.log(error);
                });
            }
        }, function (reason) {
        });
    };
    ClassSessionsRegisterComponent.prototype.removeGroup = function (sessionGroup) {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove Group';
        modalRef.componentInstance.message = 'Are you sure you want to remove this group?';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';
        //handle the response
        modalRef.result.then(function (result) {
            if (result == true) {
                $('.loading').show();
                _this.sessionGroupsService.delete(_this.classSessionId, sessionGroup.sessionGroupId)
                    .subscribe(function (success) {
                    _this.toastrService.success('Group deleted');
                    //this.getSessionAttendees();
                    _this.tutorCommand.groups.splice(_this.tutorCommand.groups.findIndex(function (o) { return o.sessionGroupId == sessionGroup.sessionGroupId; }), 1);
                    $('.loading').hide();
                }, function (error) {
                    console.log(error);
                });
            }
        }, function (reason) {
        });
    };
    ;
    ClassSessionsRegisterComponent.prototype.selectUser = function (userId) {
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        if (this.selectedUsers.findIndex(function (o) { return o == userId; }) == -1) {
            this.selectedUsers.push(userId);
        }
        else {
            this.selectedUsers.splice(this.selectedUsers.findIndex(function (o) { return o == userId; }), 1);
        }
    };
    ;
    ClassSessionsRegisterComponent.prototype.userSelected = function (userId) {
        return this.selectedUsers.findIndex(function (o) { return o == userId; }) > -1;
    };
    ;
    ClassSessionsRegisterComponent.prototype.isTutorRefunded = function (item) {
        if (item.refunded && !item.isRefundStudentInitiated)
            return true;
    };
    ClassSessionsRegisterComponent.prototype.isCancelled = function (item) {
        if (item.refunded && item.isRefundStudentInitiated)
            return true;
    };
    ClassSessionsRegisterComponent.prototype.canRemove = function (item) {
        if (this.isCancelled(item))
            return false;
        return !item.removed;
    };
    ClassSessionsRegisterComponent.prototype.canUndoRemove = function (item) {
        if (this.isCancelled(item))
            return false;
        return item.removed;
    };
    ClassSessionsRegisterComponent.prototype.addSelected = function (sessionGroup) {
        var _this = this;
        if (this.selectedUsers.length > 0) {
            $('.loading').show();
            this.sessionGroupsService.moveToGroup(this.classSessionId, sessionGroup.sessionGroupId, { groupId: sessionGroup.sessionGroupId, userIds: this.selectedUsers })
                .subscribe(function (success) {
                _this.toastrService.success('Added user to group');
                _this.getSessionAttendees();
            }, function (error) {
                console.log(error);
            });
        }
    };
    ;
    ClassSessionsRegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-register',
            templateUrl: './class-sessions-register.component.html',
            styleUrls: ['./class-sessions-register.component.scss']
        }),
        __param(7, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [index_2.SessionAttendeesService, index_2.ClassSessionsService, ng_bootstrap_1.NgbModal,
            index_2.TutorsService, ngx_toastr_1.ToastrService, index_2.SessionGroupsService,
            index_2.ClassSessionFeaturesService, Object, dialog_1.MatDialogRef])
    ], ClassSessionsRegisterComponent);
    return ClassSessionsRegisterComponent;
}());
exports.ClassSessionsRegisterComponent = ClassSessionsRegisterComponent;
//# sourceMappingURL=class-sessions-register.component.js.map