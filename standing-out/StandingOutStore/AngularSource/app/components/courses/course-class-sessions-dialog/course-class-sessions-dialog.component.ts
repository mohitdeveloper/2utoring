import { Component, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { TableSearch, PagedList, ClassSession, ClassSessionFeatures, Tutor, TutorCommandGroup, SessionGroupDraggable } from '../../../models/index';
import { CoursesService, ClassSessionFeaturesService, TutorsService, ClassSessionsService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonDialogData } from '../LessonDialogData';
import { ClassSessionsRegisterComponent } from '../..';
import { CourseUploadDialogComponent } from '../course-upload-dialog/course-upload-dialog.component';
import { SessionGroupsModalComponent } from '../../session-groups/session-groups-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { elementClosest } from '@fullcalendar/angular';


@Component({
    selector: 'app-course-class-sessions-dialog',
    templateUrl: './course-class-sessions-dialog.component.html',
    styleUrls: ['./course-class-sessions-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CourseClassSessionsDialogComponent {
    
    classSessions: {};
    tutorId: any;
    isCompany: boolean;
    tutorCommand: TutorCommandGroup = new TutorCommandGroup();
    classSessionFeatures: ClassSessionFeatures = new ClassSessionFeatures();
    comingFrom: string;
    userLocalLogin: boolean = false;
    userHasGoogleAccountLinked: boolean = false;
    
    constructor(private tutorsService: TutorsService, private classSessionFeaturesService: ClassSessionFeaturesService, public dialog: MatDialog, private modalService: NgbModal, public dialogRef: MatDialogRef<CourseClassSessionsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: LessonDialogData, private toastr: ToastrService, private classSessionService: ClassSessionsService) { }
    closeLessonDialog(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.comingFrom = this.data.comingFrom ? this.data.comingFrom : 'upcoming'
        this.classSessions = this.data.course.classSessions;
        this.tutorId = this.data.tutorId ? this.data.tutorId : ''
        this.isCompany = this.data.isCompany ? this.data.isCompany : false
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(this.tutorId)
            .subscribe(features => { this.classSessionFeatures = features; });
        debugger;
        this.tutorsService.getById(this.tutorId)
            .subscribe(success => {
                this.userLocalLogin = success.localLogin;
                this.userHasGoogleAccountLinked = success.hasGoogleAccountLinked;

            }, error => {
            });

    }
    openClassSessionDetail(items) {
        debugger;
        //if (!items.started && items.sessionAttendeesCount > 0) {
            if (items.sessionAttendeesCount > 0) {
            const dialogRef = this.dialog.open(ClassSessionsRegisterComponent, {
                width: '60vw',
                panelClass: 'myClass',
                autoFocus: false,
                data: { classSessionId: items.classSessionId, sessionAttendeesCount: items.sessionAttendeesCount, lessondetail: items, isAdd: false, that: this }
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    }

    openClassSessionAndAddGroup(items) {
        if (!items.started && items.sessionAttendeesCount > 1) {
            const dialogRef = this.dialog.open(ClassSessionsRegisterComponent, {
                width: '60vw',
                panelClass: 'myClass',
                autoFocus: false,
                data: { classSessionId: items.classSessionId, sessionAttendeesCount: items.sessionAttendeesCount, lessondetail: items, isAdd:true, that: this }
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    }


    getFileUploadWindow(items, classSessionId, index) {
            if (!items.started || (items.started && items.ended)) {
                let dialogRef = this.dialog.open(CourseUploadDialogComponent, {
                    maxWidth: '80vw',
                    maxHeight: '85%',
                    //height: '90%',
                    panelClass: 'myClass',
                    autoFocus: false,
                    data: {
                        classSessionId: classSessionId,
                        selectedTutorId: this.tutorId
                    }
                });
                
            }
            else {
                this.toastr.error('Action not allowed.');
                return;
            }
    }
    allowStartLesson(dt) {
        let today = new Date().getTime();
        let startDate = new Date(dt).getTime();
        let diffMs = (today - startDate); // milliseconds between now & startDate
        let diffMins = Math.round(diffMs / 60000); // minutes
        if (diffMins > 15)
            return true;
        return false;
    }
    viewLesson(items,index) {
        debugger;
        $('.loading').show();
        let current = new Date().getTime();
        let endDate = new Date(items.endDate).getTime();
        if ((current > endDate || this.allowStartLesson(items.startDate)) && !items.complete) {
            this.classSessionService.cancelLesson(items.classSessionId)
                .subscribe(success => {
                    if (success == "Completed") {
                        items.complete = true;
                        items.ended = true;
                        this.allowViewLesson(items);
                    } else if (success == "Cancelled") {
                        items.cancel = true;
                        this.toastr.warning('Sorry! Lesson Timeout');
                        $('.loading').hide();
                        return false;
                    } else {
                        items.complete = true;
                        items.ended = true;
                        this.allowViewLesson(items);
                    }

                }, error => { console.log(error) });
        }
        else {
            this.allowViewLesson(items);
        }

        //if (this.comingFrom == 'old' || this.comingFrom == 'upcoming') {
        //    this.toastr.error('Action not allowed.');
        //    return;
        //}

        //if (this.comingFrom == 'old' || this.comingFrom == 'upcoming') {
        //    this.toastr.error('Action not allowed.');
        //    return;
        //}
        //if ((this.allowStartLesson(items.startDate) || items.cancel) && !items.complete) {
        //    debugger;
        //    items.cancel = true;
        //    this.toastr.warning('Sorry! Lesson Timeout');
        //    return;
        //}

       
    }
    allowViewLesson(items) {
        debugger;
        $('.loading').hide();
        if (items.started && items.ended) {
            if (!this.isCompany) {
                if (items.sessionAttendeesCount > 0) {
                    if (items.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == false) {
                        window.location.href = "/Account/LinkAccount?returnUrl=" + environment.classroomUrl + '/c/' + items.classSessionId;
                    } else if (items.requiresGoogleAccount == true && this.userLocalLogin == true && this.userHasGoogleAccountLinked == true) {
                        window.location.href = "/Account/LoginAccount?returnUrl=" + environment.classroomUrl + '/c/' + items.classSessionId;
                    } else {
                        window.open(environment.classroomUrl + '/c/' + items.classSessionId, '_blank');
                    }
                } else {
                    this.toastr.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
                }
            }
            else {
                this.toastr.error('Action not allowed.');
                return;
            }
        }
        else {
            this.toastr.error('Action not allowed.');
            return;
        }
    }

    canAddGroup(): boolean {
        var groupCount = 0;
        if (this.tutorCommand.groups)
            groupCount = this.tutorCommand.groups.length;

        var currentGroupsCount = groupCount;
        console.log("MaxGroups",this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups);
        if (this.classSessionFeatures && currentGroupsCount < this.classSessionFeatures.tutorDashboard_Lesson_MaxGroups)
            return true;

        return false;
    }
    addGroup(items): void {
        if (!items.started && items.sessionAttendeesCount > 1) {
            if (!this.canAddGroup()) {
                this.toastr.error('Action not allowed.');
                return;
            }

            const modalRef = this.modalService.open(SessionGroupsModalComponent, { size: 'lg' });
            let group: SessionGroupDraggable = new SessionGroupDraggable();
            group.classSessionId = items.classSessionId;

            //set any variables
            modalRef.componentInstance.classSessionId = items.classSessionId;
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
            this.toastr.error('Action not allowed.');
            return;
        }
    };

}

