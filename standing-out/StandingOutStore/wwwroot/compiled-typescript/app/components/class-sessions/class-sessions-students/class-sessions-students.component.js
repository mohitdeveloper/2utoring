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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassSessionsStudentsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var services_1 = require("../../../services");
var models_1 = require("../../../models");
var ngx_toastr_1 = require("ngx-toastr");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var dialog_1 = require("@angular/material/dialog");
var ClassSessionsStudentsComponent = /** @class */ (function () {
    function ClassSessionsStudentsComponent(dialogRef, fb, toastr, tutorsService, sessionInvitesService, sessionAttendeesService, modalService) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.toastr = toastr;
        this.tutorsService = tutorsService;
        this.sessionInvitesService = sessionInvitesService;
        this.sessionAttendeesService = sessionAttendeesService;
        this.modalService = modalService;
        this.saveAndClose = new core_1.EventEmitter();
        this.validationMsgs = { 'emailAddress': [{ type: 'email', message: 'Enter a valid email' }] };
        this.classSessionId = '';
        this.loaded = 0;
        this.toLoad = 3;
        this.tutor = new models_1.Tutor();
        this.sessionInvites = []; // selected users
        this.uniqueSessionAttendees = []; // dropdown to select users from
        this.selectedAttendeesTmp = []; //use for filter purpose
        this.searchValue = '';
        this.tmpCheckedInvitesArr = [];
    }
    Object.defineProperty(ClassSessionsStudentsComponent.prototype, "emailFormData", {
        get: function () { return this.emailForm.get('emailAddress'); },
        enumerable: false,
        configurable: true
    });
    ClassSessionsStudentsComponent.prototype.incrementLoad = function () {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };
    ;
    ClassSessionsStudentsComponent.prototype.getInviteeDisplay = function (sessionInvite) {
        return (sessionInvite.userFullName != null && sessionInvite.userFullName != undefined && sessionInvite.userFullName.trim() != '')
            ? sessionInvite.userFullName : sessionInvite.email;
    };
    ;
    //set form array to get email ids
    //userForm: FormGroup;
    //fields: any;
    //patch() {
    //    const control = <FormArray>this.userForm.get('type.options');
    //    this.fields.type.options.forEach(x => {
    //        control.push(this.patchValues(x.label, x.value))
    //    })
    //}
    //patchValues(label, value) {
    //    return this.fb.group({
    //        label: [label],
    //        value: [value]
    //    })
    //}
    ClassSessionsStudentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        var options = [];
        var classSize = localStorage.getItem('clasSize');
        var courseId = localStorage.getItem('courseId');
        for (var i = 0; i < parseInt(classSize); i++) {
            options.push({ label: '' });
        }
        //this.fields = {
        //    isRequired: true,
        //    type: {
        //        options
        //    }
        //};
        this.emailForm = this.fb.group({ emailArray: this.createEmailFormGroup(classSize) });
        //this.userForm = this.fb.group({
        //    type: this.fb.group({
        //        options: this.fb.array([])
        //    })
        //});
        //this.patch(); 
        if (this.selectedTutorId && this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getCompanyTutorData(this.selectedTutorId)
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
                _this.sessionAttendeesService.getUniqueByOwner(_this.tutor.userId, courseId)
                    .subscribe(function (attendeeSuccess) {
                    _this.uniqueSessionAttendees = attendeeSuccess;
                    _this.selectedAttendeesTmp = _this.uniqueSessionAttendees;
                    _this.incrementLoad();
                }, function (error) {
                });
            }, function (error) {
            });
        }
        else if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
                _this.sessionAttendeesService.getUniqueByOwner(_this.tutor.userId, courseId)
                    .subscribe(function (attendeeSuccess) {
                    _this.uniqueSessionAttendees = attendeeSuccess;
                    _this.selectedAttendeesTmp = _this.uniqueSessionAttendees;
                    _this.incrementLoad();
                }, function (error) {
                });
            }, function (error) {
            });
        }
        else {
            this.tutorsService.getMy()
                .subscribe(function (success) {
                _this.tutor = success;
                _this.incrementLoad();
                _this.sessionAttendeesService.getUniqueByOwner(_this.tutor.userId, courseId)
                    .subscribe(function (attendeeSuccess) {
                    _this.uniqueSessionAttendees = attendeeSuccess;
                    _this.selectedAttendeesTmp = _this.uniqueSessionAttendees;
                    _this.incrementLoad();
                }, function (error) {
                });
            }, function (error) {
            });
        }
        this.loadSessionInvites();
    };
    ;
    ClassSessionsStudentsComponent.prototype.createEmailFormGroup = function (classSize) {
        var formArray = this.fb.array([]);
        for (var i = 0; i < classSize; i++) {
            formArray.push(new forms_1.FormGroup({ 'emailAddress': new forms_1.FormControl('', forms_1.Validators.email) }));
        }
        return formArray;
    };
    ClassSessionsStudentsComponent.prototype.GetEmail = function () {
        debugger;
        var fm = this.emailForm.get('emailArray');
    };
    ClassSessionsStudentsComponent.prototype.loadSessionInvites = function () {
        var _this = this;
        this.sessionInvitesService.getByClassSession(this.classSessionId)
            .subscribe(function (success) {
            _this.sessionInvites = success;
            _this.incrementLoad();
        }, function (error) {
        });
    };
    ;
    ClassSessionsStudentsComponent.prototype.addToInvites = function (selectedUserId) {
        if (!selectedUserId) {
            return;
        }
        var alreadyAdded = this.inviteExistsByUserId(selectedUserId);
        //this.tmpCheckedInvitesArr.push(selectedUserId);
        /**********************************************************/
        var tmpChk = this.tmpCheckedInvitesArr.indexOf(selectedUserId) != -1;
        if (tmpChk) {
            this.tmpCheckedInvitesArr.splice(this.tmpCheckedInvitesArr.indexOf(selectedUserId), 1);
            this.sessionInvites.splice(selectedUserId, 1);
        }
        else {
            this.tmpCheckedInvitesArr.push(selectedUserId);
        }
        /**********************************************************/
        if (!alreadyAdded) {
            var attendee = this.findInAttendeesByUserId(selectedUserId);
            this.addInviteeToSessionInvitees(attendee, '');
        }
        ;
    };
    ;
    //addToInvitesByEmails(bulkEmailString: string): void { 
    //    const emailIds = bulkEmailString.split(",").map(x => x.trim()).filter(x => x !== '');
    //    if (!emailIds || emailIds.length === 0) return;
    //    emailIds.forEach(email => {
    //        const alreadyAdded = this.inviteExistsByEmail(email);
    //        const attendee = this.findInAttendeesByEmail(email); // so we can add as attendee if attendee email
    //        if (!alreadyAdded) {
    //            this.addInviteeToSessionInvitees(attendee, email);
    //        };
    //    });
    //};
    //new invitation from create course page 23-11-20
    ClassSessionsStudentsComponent.prototype.addToInvitesByEmailss = function (emailData) {
        var _this = this;
        if (!emailData || emailData.length === 0)
            return;
        emailData.forEach(function (email) {
            if (email.emailAddress != '') {
                var alreadyAdded = _this.inviteExistsByEmail(email.emailAddress);
                var attendee = _this.findInAttendeesByEmail(email.emailAddress); // so we can add as attendee if attendee email
                if (!alreadyAdded) {
                    _this.addInviteeToSessionInvitees(attendee, email.emailAddress);
                }
                ;
            }
        });
        //emailData.forEach(email => {
        //    if (email.label != '') {
        //        const alreadyAdded = this.inviteExistsByEmail(email.label);
        //        const attendee = this.findInAttendeesByEmail(email.label); // so we can add as attendee if attendee email
        //        if (!alreadyAdded) {
        //            this.addInviteeToSessionInvitees(attendee, email.label);
        //        };
        //    }
        //});
    };
    ;
    ClassSessionsStudentsComponent.prototype.addInviteeToSessionInvitees = function (attendee, email) {
        var invite = new models_1.SessionInvite();
        invite.classSessionId = this.classSessionId;
        invite.userId = attendee ? attendee.userId : null;
        invite.email = attendee ? attendee.email : email;
        invite.userFullName = attendee ? attendee.fullName : null;
        invite.inviteSent = false;
        this.sessionInvites.splice(0, 0, invite);
    };
    ;
    ClassSessionsStudentsComponent.prototype.inviteExistsByEmail = function (email) {
        return this.sessionInvites.findIndex(function (o) { return o.email.toLocaleLowerCase() === email.toLocaleLowerCase(); }) >= 0;
    };
    ;
    ClassSessionsStudentsComponent.prototype.inviteExistsByUserId = function (userId) {
        return this.sessionInvites.findIndex(function (o) { return o.userId === userId; }) >= 0;
    };
    ;
    ClassSessionsStudentsComponent.prototype.findInAttendeesByUserId = function (userId) {
        return this.uniqueSessionAttendees.find(function (o) { return o.userId === userId; });
    };
    ;
    ClassSessionsStudentsComponent.prototype.findInAttendeesByEmail = function (email) {
        return this.uniqueSessionAttendees.find(function (o) { return o.email.toLocaleLowerCase() === email.toLocaleLowerCase(); });
    };
    ;
    ClassSessionsStudentsComponent.prototype.submit = function () {
        var _this = this;
        $('.loading').show();
        //this.addToInvitesByEmailss(this.userForm.value.type.options); 
        var emailArray = this.emailForm.get('emailArray');
        if (!emailArray.valid) {
            $('.loading').hide();
            this.toastr.error('Please enter valid email address!');
            return;
        }
        this.addToInvitesByEmailss(emailArray.value);
        var sessionInvitesNew = this.sessionInvites.filter(function (x) { return !x.inviteSent; })
            .map(function (x) { return ({ classSessionId: x.classSessionId, userId: x.userId, email: x.email }); });
        //it will work only for the first time course create not for edit
        if (!localStorage.getItem('origin')) {
            debugger;
            localStorage.setItem('inviteEmailArray', JSON.stringify(sessionInvitesNew));
            this.saveAndClose.emit();
            $('.loading').hide();
            return;
        }
        debugger;
        this.sessionInvitesService.createMultiple(sessionInvitesNew)
            .subscribe(function (success) {
            if (success != '') {
                _this.toastr.success('Invitation sent successfully!.');
            }
            else {
                _this.toastr.warning('No new invitation sent!');
            }
            //this.loadSessionInvites();
            //window.location.href = '/tutor';
            _this.saveAndClose.emit();
            $('.loading').hide();
        }, function (error) { });
    };
    ;
    //popSessionInviteModal(): void {
    //    const modalRef = this.modalService.open(SessionInviteModalComponent, { size: 'lg' });
    //    modalRef.componentInstance.classSessionId = this.classSessionId;
    //    modalRef.result.then((result) => {
    //        if (result && result.length > 3) {
    //            this.addToInvitesByEmails(result); 
    //        }
    //    }, (dismissalReason) => {
    //    });
    //};
    ClassSessionsStudentsComponent.prototype.removeAddedUser = function (sessionInvite) {
        var foundIndex = (sessionInvite.userId && sessionInvite.userId.trim() !== '') ?
            this.sessionInvites.findIndex(function (o) { return o.userId === sessionInvite.userId; }) :
            this.sessionInvites.findIndex(function (o) { return o.email === sessionInvite.email; });
        if (foundIndex >= 0) {
            this.sessionInvites.splice(foundIndex, 1);
            this.tmpCheckedInvitesArr.splice(this.tmpCheckedInvitesArr.indexOf(foundIndex), 1);
        }
    };
    ;
    ClassSessionsStudentsComponent.prototype.ngAfterViewChecked = function () {
        if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.selectedTutorId = this.selectedTutorId;
        }
        else {
            this.classSessionId = classSessionId;
        }
    };
    //removeInvite(sessionInvite: SessionInvite): void {
    //    const foundIndex = this.sessionInvites.findIndex(o => o.sessionInviteId === sessionInvite.sessionInviteId);
    //    if (foundIndex >= 0) {
    //        this.sessionInvites.splice(foundIndex, 1);
    //    }
    //    if (foundIndex >= 0) {
    //        this.modalService.open(UtilitiesDeleteModal, { ariaLabelledBy: 'modal-basic-title' }).result
    //            .then((result) => {
    //                if (result === true) {
    //                    this.sessionInvitesService.delete(sessionInvite.sessionInviteId).subscribe(success => {
    //                        this.sessionInvites.splice(foundIndex, 1);
    //                        this.toastr.success('Invite deletion successful.', 'Success');
    //                    },
    //                        error => {
    //                            this.toastr.error('Unable to Delete.. Please retry', 'Delete Retry');
    //                        });
    //                } else {
    //                    this.toastr.info('Delete has been cancelled.', 'Delete Cancelled');
    //                }
    //            }, (reason) => {
    //                console.log('dismissed - closed no action');
    //            });
    //    }
    //};
    ClassSessionsStudentsComponent.prototype.searchAttendees = function ($event) {
        var getSearchKeyword = $event.target.value;
        getSearchKeyword = getSearchKeyword.toLowerCase();
        this.selectedAttendeesTmp = [];
        if (getSearchKeyword.length >= 2) {
            for (var i in this.uniqueSessionAttendees) {
                var getFirstname = this.uniqueSessionAttendees[i].firstName;
                getFirstname = getFirstname.toLowerCase();
                if (getFirstname.indexOf(getSearchKeyword) != -1) {
                    this.selectedAttendeesTmp.push(this.uniqueSessionAttendees[i]);
                }
            }
        }
        else {
            this.selectedAttendeesTmp = this.uniqueSessionAttendees;
        }
    };
    ClassSessionsStudentsComponent.prototype.closeDialog = function () {
        this.dialogRef.close(true);
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ClassSessionsStudentsComponent.prototype, "saveAndClose", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsStudentsComponent.prototype, "classSessionIdDialog", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], ClassSessionsStudentsComponent.prototype, "selectedTutorId", void 0);
    ClassSessionsStudentsComponent = __decorate([
        core_1.Component({
            selector: 'app-class-sessions-students',
            templateUrl: './class-sessions-students.component.html',
            styleUrls: ['./class-sessions-students.component.css']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, forms_1.FormBuilder, ngx_toastr_1.ToastrService, services_1.TutorsService, services_1.SessionInvitesService, services_1.SessionAttendeesService, ng_bootstrap_1.NgbModal])
    ], ClassSessionsStudentsComponent);
    return ClassSessionsStudentsComponent;
}());
exports.ClassSessionsStudentsComponent = ClassSessionsStudentsComponent;
//# sourceMappingURL=class-sessions-students.component.js.map