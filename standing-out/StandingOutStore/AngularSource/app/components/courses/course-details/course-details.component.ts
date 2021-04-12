import { Component, OnInit } from '@angular/core';
import { CoursesService, ClassSessionFeaturesService, TutorsService, UsersService, subjectImages } from '../../../services/index';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutCourseDetailsDialogComponent } from '../checkout-course-details-dialog/checkout-course-details-dialog.component';

declare var isAuthenticated: any;

@Component({
    selector: 'app-course-details',
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
    courseId: string;
    courseData: any = [];
    currentURL: any;
    userType: any;
    alertMessage: any = null;
    subjectsImages = subjectImages;
    constructor(public dialog: MatDialog, private tutorsService: TutorsService, private coursesService: CoursesService, private toastr: ToastrService, private classSessionFeaturesService: ClassSessionFeaturesService, private usersService: UsersService) { }
    isAuthenticated = isAuthenticated;

    ngOnInit() {
        $('.loading').show();
        this.getUserAlertMessage();
        var n = window.location.pathname.split('/');
        if (n[1] == 'Invitation-course-detail') {
            localStorage.setItem('coid', n[2]); 
        }
        //this.courseId = 'bf24eee9-090d-485f-fbfd-08d8a99449e3';
        if (!localStorage.getItem('coid')) {
            window.location.href = '/';
            return false;
        }
        
        this.courseId = localStorage.getItem('coid'); 
        this.coursesService.getCourseDataById(this.courseId)
            .subscribe(success => {
                this.courseData = success;
                $('.loading').hide();
            }, error => {
            });

        //get user type
        //this.coursesService.getUserType()
        //    .subscribe(success => {
        //        this.userType = success;
        //        $('.loading').hide();
        //    }, error => {
        //    });

    }

    checkOutEvent(availablePlaces) {
        if (availablePlaces == 0) {
            this.toastr.warning('No place available to book this courseData!');
            return false;
        }
        if (this.isAuthenticated == 'True') {
            window.location.href = '/course-sign-in/' + this.courseId + '/Others';
        } else {
            const dialogRef = this.dialog.open(CheckoutCourseDetailsDialogComponent, {
                maxWidth: '80vw',
                //width: '100%',
                maxHeight: '80%',
                panelClass: ["myClass"],
                autoFocus: false,
                data: {
                    'courseId': this.courseId
                }
            });
        }
    }
    redirectMe(typ, id) {
        if (typ == 'myCourse') {
            localStorage.setItem('tutorId', id)
            window.location.href = "/my-course";
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id)
            window.location.href = "/course-details";
        }
        if (typ == 'viewTutor') {
            window.location.href = "/tutor/" + id;
        }
    }

    backToSearch() {
        let tid = localStorage.getItem('tid');
        if (tid) {
            window.location.href = '/tutor/' + tid;
        } else {
            window.history.back();
        }
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }

    handleDesableBookTutor() {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.alertMessage.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        } else {
            this.toastr.warning("Action not allowed.");
            //alert("CompanyTutor, Tutor, Company");
        }
    }
}
  

