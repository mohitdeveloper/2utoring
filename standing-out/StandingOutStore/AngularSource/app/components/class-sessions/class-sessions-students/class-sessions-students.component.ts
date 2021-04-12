import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TutorsService, SessionInvitesService, SessionAttendeesService } from '../../../services';
import { Tutor, SessionInvite, SessionAttendee } from '../../../models';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionInviteModalComponent } from '../class-sessions-invite-modal/session-invite-modal';
import { MatDialogRef } from '@angular/material/dialog'; 
// import { UtilitiesDeleteModal } from "../../utilities/utilities-delete-modal/utilities-delete-modal";

declare var classSessionId: any;

@Component({
    selector: 'app-class-sessions-students',
    templateUrl: './class-sessions-students.component.html',
    styleUrls: ['./class-sessions-students.component.css']
})
export class ClassSessionsStudentsComponent implements OnInit {
    @Output() saveAndClose = new EventEmitter();
    @Input() classSessionIdDialog: string;
    @Input() selectedTutorId: string;
    emailForm: FormGroup;
    validationMsgs = { 'emailAddress': [{ type: 'email', message: 'Enter a valid email' }] }
    get emailFormData() { return <FormArray>this.emailForm.get('emailAddress'); }


    classSessionId: string = '';
    loaded: number = 0;
    toLoad: number = 3;
    tutor: Tutor = new Tutor();
    sessionInvites: SessionInvite[] = []; // selected users
    uniqueSessionAttendees: SessionAttendee[] = []; // dropdown to select users from
    selectedUserId: string;
    selectedAttendeesTmp: SessionAttendee[] = []; //use for filter purpose
    searchValue: string = '';

    tmpCheckedInvitesArr = [];


    constructor(public dialogRef: MatDialogRef<ClassSessionsStudentsComponent>, private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private sessionInvitesService: SessionInvitesService, private sessionAttendeesService: SessionAttendeesService, private modalService: NgbModal) { }

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    getInviteeDisplay(sessionInvite: SessionInvite): string {
        return (sessionInvite.userFullName != null && sessionInvite.userFullName != undefined && sessionInvite.userFullName.trim() != '')
            ? sessionInvite.userFullName : sessionInvite.email;
    };

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

    ngOnInit(): void { 
        $('.loading').show();
        let options = [];
        let classSize = localStorage.getItem('clasSize');
        let courseId =  localStorage.getItem('courseId');
        for (let i = 0; i < parseInt(classSize); i++) {
            options.push({ label: '' })
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
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                    this.sessionAttendeesService.getUniqueByOwner(this.tutor.userId, courseId)
                        .subscribe(attendeeSuccess => {
                            this.uniqueSessionAttendees = attendeeSuccess;
                            this.selectedAttendeesTmp = this.uniqueSessionAttendees;
                            this.incrementLoad();
                        }, error => {
                        });
                }, error => {
                });
        } else if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                    this.sessionAttendeesService.getUniqueByOwner(this.tutor.userId, courseId)
                        .subscribe(attendeeSuccess => {
                            this.uniqueSessionAttendees = attendeeSuccess;
                            this.selectedAttendeesTmp = this.uniqueSessionAttendees;
                            this.incrementLoad();
                        }, error => {
                        });
                }, error => {
                });
        } else {
            this.tutorsService.getMy()
                .subscribe(success => {
                    this.tutor = success;
                    this.incrementLoad();
                    this.sessionAttendeesService.getUniqueByOwner(this.tutor.userId, courseId)
                        .subscribe(attendeeSuccess => {
                            this.uniqueSessionAttendees = attendeeSuccess;
                            this.selectedAttendeesTmp = this.uniqueSessionAttendees;
                            this.incrementLoad();
                        }, error => {
                        });
                }, error => {
                });
        }
        this.loadSessionInvites();
    };
    createEmailFormGroup(classSize): FormArray {
        let formArray = this.fb.array([]);
        for (let i = 0; i < classSize; i++) {
            formArray.push(new FormGroup({ 'emailAddress': new FormControl('', Validators.email) }));
        }
        return formArray;
    }
    GetEmail() {
        debugger;
        let fm = <FormArray>this.emailForm.get('emailArray');
    }


    loadSessionInvites(): void {
        this.sessionInvitesService.getByClassSession(this.classSessionId)
            .subscribe(success => {
                this.sessionInvites = success;
                this.incrementLoad();
            }, error => {
            });
    };

    addToInvites(selectedUserId){
        if (!selectedUserId) {
            return;
        }
        const alreadyAdded = this.inviteExistsByUserId(selectedUserId);

        //this.tmpCheckedInvitesArr.push(selectedUserId);
        /**********************************************************/
        var tmpChk = this.tmpCheckedInvitesArr.indexOf(selectedUserId) != -1;
        if (tmpChk) {
            this.tmpCheckedInvitesArr.splice(this.tmpCheckedInvitesArr.indexOf(selectedUserId), 1);
            this.sessionInvites.splice(selectedUserId, 1);
        } else {
            this.tmpCheckedInvitesArr.push(selectedUserId);
        }
        /**********************************************************/


        if (!alreadyAdded) {
            const attendee = this.findInAttendeesByUserId(selectedUserId);
            this.addInviteeToSessionInvitees(attendee, '');            
        };
    };

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
    addToInvitesByEmailss(emailData): void {
        if (!emailData || emailData.length === 0) return;
        emailData.forEach(email => {
            if (email.emailAddress != '') {
                const alreadyAdded = this.inviteExistsByEmail(email.emailAddress);
                const attendee = this.findInAttendeesByEmail(email.emailAddress); // so we can add as attendee if attendee email

                if (!alreadyAdded) {
                    this.addInviteeToSessionInvitees(attendee, email.emailAddress);
                };
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

    addInviteeToSessionInvitees(attendee: SessionAttendee, email: string): void {
        const invite = new SessionInvite();
        invite.classSessionId = this.classSessionId;
        invite.userId = attendee ? attendee.userId : null;
        invite.email = attendee ? attendee.email : email;
        invite.userFullName = attendee ? attendee.fullName : null;
        invite.inviteSent = false;
        this.sessionInvites.splice(0, 0, invite);
    };

    inviteExistsByEmail(email: string): boolean {
        return this.sessionInvites.findIndex(o => o.email.toLocaleLowerCase() === email.toLocaleLowerCase()) >= 0;
    };

    inviteExistsByUserId(userId: string): boolean {
        return this.sessionInvites.findIndex(o => o.userId === userId) >= 0;
    };

    findInAttendeesByUserId(userId: string): SessionAttendee {
        return this.uniqueSessionAttendees.find(o => o.userId === userId);
    };

    findInAttendeesByEmail(email: string): SessionAttendee {
        return this.uniqueSessionAttendees.find(o => o.email.toLocaleLowerCase() === email.toLocaleLowerCase());
    };

    submit(): void { 
        $('.loading').show();

        //this.addToInvitesByEmailss(this.userForm.value.type.options); 
        let emailArray = <FormArray>this.emailForm.get('emailArray');

        if (!emailArray.valid) {
            $('.loading').hide();
            this.toastr.error('Please enter valid email address!');
            return;
        }

        this.addToInvitesByEmailss(emailArray.value);
        
        const sessionInvitesNew = this.sessionInvites.filter(x => !x.inviteSent)
            .map(x => ({ classSessionId: x.classSessionId, userId: x.userId, email: x.email }));

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
            .subscribe(
                success => {
                    if (success != '') {
                        this.toastr.success('Invitation sent successfully!.');
                    } else {
                        this.toastr.warning('No new invitation sent!');
                    }
                    //this.loadSessionInvites();
                    //window.location.href = '/tutor';
                    this.saveAndClose.emit();
                    $('.loading').hide();
                },
                error => {});
    };

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

    removeAddedUser(sessionInvite: SessionInvite): void { 
        const foundIndex = (sessionInvite.userId && sessionInvite.userId.trim() !== '') ?
            this.sessionInvites.findIndex(o => o.userId === sessionInvite.userId) :
            this.sessionInvites.findIndex(o => o.email === sessionInvite.email);

        if (foundIndex >= 0) {
            this.sessionInvites.splice(foundIndex, 1);
            this.tmpCheckedInvitesArr.splice(this.tmpCheckedInvitesArr.indexOf(foundIndex), 1);
        }
    };

    ngAfterViewChecked() {
        if (this.classSessionIdDialog) {
            this.classSessionId = this.classSessionIdDialog;
            this.selectedTutorId = this.selectedTutorId;
        } else {
            this.classSessionId = classSessionId;
        }
    }



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
    searchAttendees($event) {
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
        } else {
            this.selectedAttendeesTmp = this.uniqueSessionAttendees;
        }
    }
    closeDialog() {
        this.dialogRef.close(true);
    }
}
