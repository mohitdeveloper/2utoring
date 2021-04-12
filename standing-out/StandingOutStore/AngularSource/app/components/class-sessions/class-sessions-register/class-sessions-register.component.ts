import { Component, OnInit, Inject } from '@angular/core';
import { TableSearch, PagedList, SessionAttendee, ClassSession, Tutor, TutorCommandGroup, SessionGroupDraggable, ClassSessionFeatures } from '../../../models/index';
import { SessionAttendeesService, ClassSessionsService, TutorsService, SessionGroupsService, ClassSessionFeaturesService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesAlertModal } from '../../utilities/utilities-alert-modal/utilities-alert-modal';
import { ToastrService } from 'ngx-toastr';
import { SessionGroupsModalComponent } from '../../session-groups/session-groups-modal.component';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


declare var classSessionId: any;

@Component({
    selector: 'app-class-sessions-register',
    templateUrl: './class-sessions-register.component.html',
    styleUrls: ['./class-sessions-register.component.scss']
})
export class ClassSessionsRegisterComponent implements OnInit {
    isCompany: boolean;
    constructor(private sessionAttendeesService: SessionAttendeesService, private classSessionsService: ClassSessionsService, private modalService: NgbModal,
        private tutorsService: TutorsService, private toastrService: ToastrService, private sessionGroupsService: SessionGroupsService,
        private classSessionFeaturesService: ClassSessionFeaturesService, @Inject(MAT_DIALOG_DATA) public dataDialog: any, public dialogRef: MatDialogRef<ClassSessionsRegisterComponent>) {
      
        this.classSessionId = dataDialog.classSessionId ? dataDialog.classSessionId : classSessionId;
        this.goBack = dataDialog.classSessionId ? false : true;
        this.isCompany = dataDialog.that.isCompany;
        this.sessionAttendeesCount = dataDialog.sessionAttendeesCount;
        this.isAdd = dataDialog.isAdd;
        debugger;
        this.lessondetail = dataDialog.lessondetail;

    }

    classSessionId: string = '';
    classSession: ClassSession;
    tutor: Tutor;
    tutorCommand: TutorCommandGroup = new TutorCommandGroup();
    isCollapsed: boolean = false;
    goBack: boolean;
    sessionAttendeesCount: number = 0;
    isAdd: boolean;
    lessondetail: any;
    selectedUsers: string[] = [];

    classSessionFeatures: ClassSessionFeatures;
    closeLessonDialog(): void {
        this.dialogRef.close();
    }

    getSessionAttendees(): void {
        this.selectedUsers = [];
        $('.loading').show();
        this.sessionGroupsService.getTutorCommand(this.classSessionId)
            .subscribe(success => {
                this.tutorCommand = success;
                $('.loading').hide();
            }, error => {
                console.log(error);
            });
    };

    // usage getClassSessionFeaturesByTutorId(xxx).subscribe(features => { // do stuff with features });
    getClassSessionFeaturesByTutorId(tutorId: string): Observable<ClassSessionFeatures> {
        return new Observable(subscriber => {
            //console.log("Getting classroom subscription features..");
            this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(this.tutor.tutorId)
                .subscribe(features => {
                    //console.log("Got classroom subscription features:", features);
                    this.classSessionFeatures = features;
                    subscriber.next(features);
                    if (this.isAdd) {
                        this.addGroup();
                    }
                },
                    error => { console.log("Could not get classroom subscription features") });
        });
    }

    ngOnInit() {
        this.getSessionAttendees();

        this.classSessionsService.getById(this.classSessionId)
            .subscribe(success => {
                debugger;
                this.classSession = success;
              
            }, error => {
                console.log(error);
            });
        this.tutorsService.getMy()
            .subscribe(success => {
                this.tutor = success;
                if (this.tutor != null) {
                    this.getClassSessionFeaturesByTutorId(this.tutor.tutorId).subscribe();
                }
                
            }, error => {
                console.log(error);
            });
       
    };
    checkLessonValiditityByTime() {
        let dt1 = new Date().getTime();
        let dt2 = new Date(this.lessondetail.endDate).getTime();
        if (dt1 > dt2) {
            this.toastrService.error('Action not allowed.');
            return true;
        }
        return false;
    }
    remove(sessionAttendee: SessionAttendee): void {
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove student';
        modalRef.componentInstance.message = 'Are you sure you want to remove this student.';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                $('.loading').show();
                this.sessionAttendeesService.remove(this.classSessionId, sessionAttendee.sessionAttendeeId)
                    .subscribe(success => {
                        this.getSessionAttendees();
                    }, error => {
                        console.log(error);
                    });
            }
        }, (reason) => {
        });
    };

    undoRemove(sessionAttendee: SessionAttendee): void {
        $('.loading').show();
        this.sessionAttendeesService.undoRemove(this.classSessionId, sessionAttendee.sessionAttendeeId)
            .subscribe(success => {
                this.getSessionAttendees();
            }, error => {
                console.log(error);
            });
    };

    refund(sessionAttendee: SessionAttendee): void {
        debugger;
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Refund student';
        modalRef.componentInstance.message = 'Are you sure you want to refund this student.';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Refund';

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                $('.loading').show();
                this.sessionAttendeesService.refund(this.classSessionId, sessionAttendee.sessionAttendeeId)
                    .subscribe(success => {
                        if (success == true) {
                            this.getSessionAttendees();
                        } else {
                            this.toastrService.error('Could not refund. Please contact support');
                            $('.loading').hide();
                        }
                    }, error => {
                        console.log(error);
                    });
            }
        }, (reason) => {
        });
    };

    canAddGroup(): boolean {
        var groupCount = 0;
        if (this.tutorCommand.groups)
            groupCount = this.tutorCommand.groups.length;
        //console.log("Current group count:", groupCount);

        var currentGroupsCount = groupCount;
        //console.log("MaxGroups",this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups);
        if (this.classSessionFeatures && currentGroupsCount<this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups)
            return true;

        return false;
    }

    NotAllowed(): void {
        this.toastrService.error("Your subscription does not allow you to add more groups.",
            "Oops! Sorry",
            { timeOut: 5000 });
    }

    addGroup(): void {
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        if (!this.classSession.started && this.sessionAttendeesCount > 1) {
            if (!this.canAddGroup()) {
                this.toastrService.error('Action not allowed.');
                //this.addGroupNotAllowed();
                return;
            }

            const modalRef = this.modalService.open(SessionGroupsModalComponent, {
                size: 'md',
            });

            let group: SessionGroupDraggable = new SessionGroupDraggable();
            group.classSessionId = this.classSessionId;

            //set any variables
            modalRef.componentInstance.classSessionId = this.classSessionId;
            modalRef.componentInstance.group = group;

            //handle the response

            modalRef.result.then((result) => {
                if (result !== undefined && result != null) {
                    this.tutorCommand.groups.push(result);
                    $('.loading').hide();
                }
            }, (reason) => {
            });
        }
        else {
            this.toastrService.error('Action not allowed.');
            return;
        }
    };

    removeFromGroup(sessionGroup: SessionGroupDraggable, sessionAttendee: SessionAttendee): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove User From Group';
        modalRef.componentInstance.message = 'Are you sure you want to remove this user from the group?';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                $('.loading').show();
                this.sessionGroupsService.removeFromGroup(this.classSessionId, sessionGroup.sessionGroupId, { groupId: sessionGroup.sessionGroupId, userIds: [sessionAttendee.userId] })
                    .subscribe(success => {
                        this.toastrService.success('Group Removed.');
                        //this.getSessionAttendees();

                        let groupIdx = this.tutorCommand.groups.findIndex(o => o.sessionGroupId == sessionGroup.sessionGroupId);
                        this.tutorCommand.groups[groupIdx].sessionAttendees.splice(this.tutorCommand.groups[groupIdx].sessionAttendees.findIndex(o => o.userId == sessionAttendee.userId), 1);
                        $('.loading').hide();
                    }, error => {
                        console.log(error);
                    });
            }
        }, (reason) => {
        });
    }

    removeGroup(sessionGroup: SessionGroupDraggable): void {

        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Remove Group';
        modalRef.componentInstance.message = 'Are you sure you want to remove this group?';
        modalRef.componentInstance.noButtonText = 'Cancel';
        modalRef.componentInstance.yesButtonText = 'Remove';

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                $('.loading').show();
                this.sessionGroupsService.delete(this.classSessionId, sessionGroup.sessionGroupId)
                    .subscribe(success => {
                        this.toastrService.success('Group deleted');

                        //this.getSessionAttendees();
                        this.tutorCommand.groups.splice(this.tutorCommand.groups.findIndex(o => o.sessionGroupId == sessionGroup.sessionGroupId), 1);
                        $('.loading').hide();
                    }, error => {
                        console.log(error);
                    });
            }
        }, (reason) => {
        });
    };

    selectUser(userId: string): void {
        if (this.classSession.started) {
            this.toastrService.error('Action not allowed.');
            return;
        }
        if (this.checkLessonValiditityByTime()) {
            return;
        }
        if (this.selectedUsers.findIndex(o => o == userId) == -1) {
            this.selectedUsers.push(userId);
        } else {
            this.selectedUsers.splice(this.selectedUsers.findIndex(o => o == userId), 1);
        }
    };

    userSelected(userId: string): boolean {
        return this.selectedUsers.findIndex(o => o == userId) > -1;
    };

    isTutorRefunded(item: SessionAttendee) {
        if (item.refunded && !item.isRefundStudentInitiated) return true;
    }

    isCancelled(item: SessionAttendee) {
        if (item.refunded && item.isRefundStudentInitiated) return true;
    }

    canRemove(item: SessionAttendee) {
        if (this.isCancelled(item)) return false;
        return !item.removed;
    }

    canUndoRemove(item: SessionAttendee) {
        if (this.isCancelled(item)) return false;
        return item.removed;
    }

    addSelected(sessionGroup: SessionGroupDraggable): void {
        if (this.selectedUsers.length > 0) {
            $('.loading').show();
            this.sessionGroupsService.moveToGroup(this.classSessionId, sessionGroup.sessionGroupId, { groupId: sessionGroup.sessionGroupId, userIds: this.selectedUsers })
                .subscribe(success => {
                    this.toastrService.success('Added user to group');
                    this.getSessionAttendees();
                }, error => {
                    console.log(error);
                });
        }
    };

   

}