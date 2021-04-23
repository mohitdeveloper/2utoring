import { Component, Input } from '@angular/core';
import { LessonCard } from '../../models/index';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonSignInModal } from '../lesson-sign-in-modal/lesson-sign-in-modal';
import { UtilitiesAlertModal } from '../../components/utilities/utilities-alert-modal/utilities-alert-modal';

@Component({
    selector: 'app-lesson-card',
    templateUrl: './lesson-card.component.html'
})

export class LessonCardComponent {
    constructor(private modalService: NgbModal) { }

    @Input() lesson: LessonCard;
    @Input() course: LessonCard;
    /*@Input() stripeCountry: any = null;*/
    @Input() selected: boolean = null;
    @Input() displayLarge: boolean = false;
    @Input() displayTutor: boolean = true;
    @Input() moreInfoNavOn: boolean = false;
    @Input() canUserBuy: boolean = true;
    @Input() isLoggedIn: boolean = false;
    @Input() isGuardian: boolean = false;
    @Input() isSupportedPayout: boolean;
    @Input() conversionPercent: number=0;
    @Input() conversionFlat: number=0;
    
    
    
   
    lessonDescription(): string {
        if (this.lesson == null)
            return '';
        else if (this.displayLarge)
            return this.lesson.sessionDescriptionBody;
        else if (this.lesson.sessionDescriptionBody.length > 300)
            return this.lesson.sessionDescriptionBody.substring(0, 299) + '...';
        else
            return this.lesson.sessionDescriptionBody;
    }
    selectLesson(event: Event): void {
        event.stopPropagation();
        if (this.lesson.sessionRemainingSpaces > 0) {
            if (this.isLoggedIn) {
                window.location.href = '/' + (this.isGuardian ? 'guardian' : 'student') + '-enroll/' + this.lesson.classSessionId;
            }
            else {
                const modalRef = this.modalService.open(LessonSignInModal, { size: 'lg' });

                //set any variables
                modalRef.componentInstance.classSessionId = this.lesson.classSessionId;
                modalRef.componentInstance.name = this.lesson.sessionName;
                modalRef.componentInstance.subject = this.lesson.subjectName;
                modalRef.componentInstance.subjectCategory = this.lesson.subjectCategoryName;
                modalRef.componentInstance.studyLevel = this.lesson.studyLevelName;

                //handle the response

                modalRef.result.then((result) => {
                }, (reason) => {
                });
            }
        }
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
