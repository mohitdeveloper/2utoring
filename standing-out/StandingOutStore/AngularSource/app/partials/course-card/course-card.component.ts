import { Component, Input } from '@angular/core';
import { LessonCard } from '../../models/index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonSignInModal } from '../lesson-sign-in-modal/lesson-sign-in-modal';
import { UtilitiesAlertModal } from '../../components/utilities/utilities-alert-modal/utilities-alert-modal';
import { CourseLessonSignInModal } from '../course-lesson-sign-in-modal/course-lesson-sign-in-modal';

@Component({
    selector: 'app-course-card',
    templateUrl: './course-card.component.html'
})

export class CourseCardComponent {
    constructor(private modalService: NgbModal) {}
    
    @Input() lesson;
    @Input() selected: boolean = null;
    @Input() displayLarge: boolean = false;
    @Input() displayTutor: boolean = true;
    @Input() moreInfoNavOn: boolean = false;
    @Input() canUserBuy: boolean = true;
    @Input() isLoggedIn: boolean = false;
    @Input() isGuardian: boolean = false;
    @Input() course: any;
    grandTotal: number= 0; 
    allLessons:LessonCard[];

    ngOnInit() { 
        this.allLessons = this.lesson;
        for (let i = 0; i < this.allLessons.length; i++) {
            this.grandTotal += this.allLessons[i].sessionPrice;
            }
    }

    lessonDescription(lessonObj): string {
        debugger;
        
        if (lessonObj == null)
            return '';
        else if (this.displayLarge)
            return lessonObj.sessionDescriptionBody;
        else if (lessonObj.sessionDescriptionBody.length > 300)
            return lessonObj.sessionDescriptionBody.substring(0, 299) + '...';
        else
            return lessonObj.sessionDescriptionBody;
        
    }
    selectLesson(event: Event): void { 
        event.stopPropagation();
       // if (this.lesson.sessionRemainingSpaces > 0) {
            if (this.isLoggedIn) { 
                window.location.href = '/course-' + (this.isGuardian ? 'guardian' : 'student') + '-enroll/' + this.course.courseId;
            }
            else {
                const modalRef = this.modalService.open(CourseLessonSignInModal, { size: 'lg' });

                //set any variables
                modalRef.componentInstance.classSessionId = this.course.courseId;
                modalRef.componentInstance.name = this.course.name;
                modalRef.componentInstance.subject = this.course.subjectName;
                modalRef.componentInstance.subjectCategory = this.course.subjectCategoryName;
                modalRef.componentInstance.studyLevel = this.course.studyLevelName;

                //handle the response

                modalRef.result.then((result) => {
                }, (reason) => {
                });
            }
        //}
    };
    removeLesson(event: Event): void {
        event.stopPropagation();
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'md' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Cancel Purchase';
        modalRef.componentInstance.message = 'Are you sure you want to cancel your purchase of this lesson?';
        modalRef.componentInstance.noButtonText = 'No, return to purchase';
        modalRef.componentInstance.yesButtonText = 'Yes, back to search';

        //handle the response

        modalRef.result.then((result) => {
            if (result == true) {
                window.location.href = '/find-a-lesson' + (this.lesson.isUnder16 ? '' : '?under=false');
            }
        }, (reason) => {
        });
    };
    moreInfo(): void {
        if (this.moreInfoNavOn) {
            window.location.href = '/lesson/' + this.lesson.classSessionId;
        }
    };
    getSubjectString(): string {
        if (this.lesson.tutorSubjects.length > 1) {
            return this.lesson.tutorSubjects.slice(0, this.lesson.tutorSubjects.length - 1).join(', ') + " & " + this.lesson.tutorSubjects[this.lesson.tutorSubjects.length - 1];
        }
        else if (this.lesson.tutorSubjects.length == 1) {
            return this.lesson.tutorSubjects[0];
        }
        else {
            return '';
        }
    };

}
