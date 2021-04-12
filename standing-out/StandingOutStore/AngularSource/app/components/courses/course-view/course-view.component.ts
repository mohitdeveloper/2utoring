import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LessonCard, TutorCard } from '../../../models/index';
import { ClassSessionsService, CoursesService } from '../../../services/index';

declare var title: any;
declare var courseId: any;
declare var canUserBuy: any;
declare var isLoggedIn: any;
declare var isGuardian: any;

@Component({
    selector: 'app-course-view',
    templateUrl: './course-view.component.html'
})

export class CourseViewComponent implements OnInit {
    constructor(private coursesService: CoursesService, private location: Location) { }

    title: string = title;
    courseId: string = courseId;
    canUserBuy: boolean = canUserBuy;
    isLoggedIn: boolean = isLoggedIn;
    isGuardian: boolean = isGuardian;
    result: { lesson: LessonCard, tutor: TutorCard };

    getLessonAndTutorCard(): void {
        this.coursesService.getCardSet(this.courseId)
            .subscribe(success => {
                $('.loading').hide();
                this.result = success;
            }, error => {
                    console.log(error);
                    $('.loading').hide();
            });
    };

    ngOnInit() { 
        $('.loading').show();
        this.getLessonAndTutorCard();
    };

    back() {
        this.location.back();
    };
}
