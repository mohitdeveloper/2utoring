import { Component, OnInit } from '@angular/core';
import { CoursesService, TutorsService, UsersService} from '../../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-tutor-courses',
    templateUrl: './tutor-courses.component.html',
    styleUrls: ['./tutor-courses.component.css']
})

export class TutorCoursesComponent implements OnInit {

    lessonTabs: string[] = ['Present & Future', 'Previous'];
    selectedlessonTabs = this.lessonTabs[0];
    maxSizeOfClass = 0;
    constructor(private tutorsService: TutorsService, private toastr: ToastrService, private coursesService: CoursesService, private usersService: UsersService) { }
    alertMessage: any = null;
    ngOnInit() {
        $('.loading').show();
        this.tutorsService.getSubScriptionFeatureByTutor().subscribe(res => {
            $('.loading').hide();
            this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
        }, err => {

        })

        this.getUserAlertMessage();
    }

    createCourse() {
        this.coursesService.clearData();
        window.location.href = "/tutor/courses/create-course";
    }

    //delete courses
    onCourseDelete(courseId) {
        $('.loading').show();
        //soft delete course from database
        this.coursesService.deleteCourse(courseId)
            .subscribe(success => {
                //this.getPaged();
                $('.loading').hide();
                this.toastr.success('Course deleted successfully!');
                location.reload();
            }, error => {
                $('.loading').hide();
            });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }

 markDbsStatusMessageReadMessageRead() {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'DbsApprovedMessageRead',
            'messageStatus': true
        }

        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#dbsStatusMessageApproved').css('display', 'none');
            }, error => {
            });
    }

}
