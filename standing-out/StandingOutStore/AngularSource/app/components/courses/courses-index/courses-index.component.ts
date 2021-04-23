import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableSearch, PagedList, ClassSession, ClassSessionFeatures, Tutor } from '../../../models/index';
import { CoursesService, ClassSessionFeaturesService, TutorsService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CourseClassSessionsDialogComponent } from '../course-class-sessions-dialog/course-class-sessions-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InviteStudentDialogComponent } from '../invite-student-dialog/invite-student-dialog.component';

declare var alertMessage: any;
declare var stripeCountry: any;
@Component({
    selector: 'app-courses-index',
    templateUrl: './courses-index.component.html',
    styleUrls: ['./courses-index.component.css']
})
export class CoursesIndexComponent implements OnInit {

    @Input() filter: string;
    @Output() onCourseEdit = new EventEmitter();
    @Output() onCourseDelete = new EventEmitter();
    @Input() actionTaken: boolean;
    @Input() isCompany: boolean;
    @Input() maxClassSize: string;
    stripeCountry: any = stripeCountry;
    url: string = window.location.hostname;
    alertMessage: any = alertMessage;
    courseId: string;

    constructor(public dialog: MatDialog, private tutorsService: TutorsService, private coursesService: CoursesService, private toastr: ToastrService, private classSessionFeaturesService: ClassSessionFeaturesService) { }

    takeValues: any[] = [
        { take: 10, name: 'Show 10' },
        { take: 25, name: 'Show 25' },
        { take: 50, name: 'Show 50' },
        { take: 100, name: 'Show 100' }
    ];

    searchModel: TableSearch = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'StartDate',
        order: 'DESC',
        filter: '',
    };

    results: PagedList<ClassSession> = { paged: null, data: null };
    classSessionFeatures: ClassSessionFeatures = new ClassSessionFeatures();
    canViewCompletedLessons: boolean = false;
    classSessionId: string;
    canActionTaken: boolean = true;
    maxSizeOfClass: number;

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getCourses();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getCourses();
    };

    next(): void {
        this.searchModel.page++;
        this.getCourses();
    };

    previous(): void {
        this.searchModel.page--;
        this.getCourses();
    };

    alterOrder(type: string): void {
        this.searchModel.sortType = type;

        if (this.searchModel.order == 'DESC') {
            this.searchModel.order = 'ASC';
        } else {
            this.searchModel.order = 'DESC';
        }

        this.reloadData();
    }

    loadTutorSubscriptionFeatures(data: ClassSession[]) {
        if (data && data.length > 0) {
            this.classSessionId = data[0].classSessionId;
            this.getSubscriptionFeaturesByClassSessionId
                .subscribe(features => { }, error => { });
        }
    }

    getCourses(): void {
        $('.loading').show();
        this.coursesService.getPaged(this.searchModel)
            .subscribe(success => {
                this.results = success;
                //this.loadTutorSubscriptionFeatures(success.data);
                //this.loadTutorSubscriptionFeatures(success.data[0].classSessions);
                if (environment.indexPageAnchoringEnabled == true) {
                    if (environment.smoothScroll == false) {
                        //quick and snappy
                        window.scroll(0, 0);
                    } else {
                        window.scroll({
                            top: 0,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                }
                $('.loading').hide();
            }, error => {
                console.log(error);
            });
    };

    ngOnInit() {
        this.searchModel.order = this.filter == 'upcoming' ? 'ASC' : 'DESC';
        this.searchModel.filter = this.filter;
        this.canActionTaken = this.actionTaken;
        this.getCourses();
        //this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
        //    this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
        //    //this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
        //    //this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount
        //}, err => {

        //})


    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    getLink(item): void {
        if (this.filter == 'previous') {
            this.toastr.error('Booking links are not available for past lessons.');
            return;
        }
        debugger;
        let allowAccess;
        if (item.companyId != null && item.companyStripeConnectAccountId != null) {
            allowAccess = true;
        } else if (item.stripeConnectAccountId) {
            allowAccess = true;
        } else {
            allowAccess = false;
        }

        if ((item.started || item.published) && allowAccess) {
            const el = document.createElement('textarea');
            el.value = window.location.origin + '/Invitation-course-detail/' + item.courseId;
            //el.value = this.url + '/course/' + courseId;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.toastr.success('The link for this course has been copied to your clipboard');
        }
        else {
            this.toastr.error('Booking links are only available once you have setup your payouts in the settings area.');
        }
    };

    // usage getClassSessionFeaturesByTutorId.subscribe(features => { // do stuff with features });
    getSubscriptionFeaturesByClassSessionId: Observable<ClassSessionFeatures> = new Observable(subscriber => {
        console.log("Getting classroom subscription features..");
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByClassSessionId(this.classSessionId)
            .subscribe(features => {
                //console.log("Got classroom subscription features:", features);
                this.classSessionFeatures = features;
                subscriber.next(features);
            }, error => { console.log("Could not get classroom subscription features") });
    });

     



    enterLesson(lesson: ClassSession) {
        if (!this.canViewLesson(lesson)) {
            this.toastr.error('Oops! Sorry, your subscription does not allow you to view completed lessons.');
            return;
        }

        if (lesson.sessionAttendeesCount > 0) {
            window.open(environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
        }
        else {
            this.toastr.error('Oops! Sorry, as no students have signed up to this lesson so you cannot access the classroom. Please try again after a student has signed up for the lesson.');
        }
    };

    canViewLesson(lesson: ClassSession): boolean {
        if (!this.classSessionFeatures) return false;
        if (!lesson.complete && !lesson.ended) return true;

        const decision = (lesson.ownerId &&
            this.classSessionFeatures &&
            this.classSessionFeatures.tutorDashboard_View_CompletedLesson);
        return decision;
    }

    //show class sessions
    showClassSession(item, typeOfSearch) {
        const dialogRef = this.dialog.open(CourseClassSessionsDialogComponent, {
            maxWidth: '80vw',
            //width: '100%',
            maxHeight: '75%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {
                course: item,
                tutorId: item.tutorId,
                isCompany: this.isCompany,
                classSessionFeatures: this.classSessionFeatures,
                comingFrom: typeOfSearch
            }
        });


    }

    //get invite sutdents
    getInviteStudentsWindow(item) {

        debugger;
        if (this.filter == 'previous') {
            this.toastr.error('Students cannot be invited to past lessons.');
            return;
        }
        //localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
        localStorage.setItem('clasSize', this.maxClassSize);
        localStorage.setItem('origin', this.maxClassSize);
        //if(item.dbsApprovalStatus != 'Pending' || !item.isUnder18)
        //{
       
        let allowAccess;
        if (item.companyId != null && item.companyStripeConnectAccountId != null && item.companyIDVerificationtStatus == "Approved") {
            allowAccess = true;
        } else if (item.stripeConnectAccountId && item.tutorIDVerificationtStatus == "Approved") {
            allowAccess = true;
        } else {
            allowAccess = false;
        }


        if (!item.cancelled && !item.completed && item.courseAttendeesCount != item.maxClassSize && allowAccess) {
            //const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
            //    maxWidth: '80vw',
            //    height: '90%',
            //    panelClass: 'my-dialog',
            //    data: {
            //        classSessionId: item.classSessions[0].classSessionId,
            //        selectedTutorId: item.tutorId
            //    }
            //});

            const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '90%',
                width: '55%',
                panelClass: ['myClass'],
                autoFocus:false,
                data: {
                    classSessionId: item.classSessions[0].classSessionId,
                    selectedTutorId: item.tutorId
                }
            });
            dialogRef.afterClosed().subscribe(() => {
                localStorage.removeItem('clasSize');
            });
        }
        else {
            this.toastr.error('You can not send invitations for full, completed or cancelled lessons.');
        }
        //}
        //else {
        //    this.toastr.error('Action not allowed.');
        //}
    }

    editCourse(item, isCompany) {
        if (this.filter == 'previous') {
            this.toastr.error('Previous lessons cannot be edited.');
            return;
        }
        if (item.courseAttendeesCount == 0 && item.published) {
            //window.location.href = "/tutor/courses/edit-course?courseId=" + item.courseId;
            //this.onCourseEdit.emit(item.courseId);
            this.coursesService.setData(item.courseId);
            if (isCompany) {
                window.location.href = "/admin/courses/manage-course";
            }
            else {
                window.location.href = "/tutor/courses/create-course";
            }
        }
        else {
            this.toastr.error('Lesson start time has passed.');
        }


        //if (item.courseAttendeesCount > 0 ) {
        //    this.toastr.warning('Course having participants now! You can not edit.');
        //    return false;
        //}

    }


    //delete courses
    deleteCourse(item) {
        debugger;
        if (this.filter == 'previous') {
            this.toastr.error('Previous courses cannot be deleted.');
            return;
        }
        if (item.courseAttendeesCount == 0 || item.cancelled) {
            this.onCourseDelete.emit(item.courseId);
        }
        else {
            this.toastr.error('Purchased courses cannot be deleted.');
        }


        //if (attendiesCount > 0) {
        //    this.toastr.warning('Course having participants now! You can not delete.');
        //    return false;
        //}

    }

}

