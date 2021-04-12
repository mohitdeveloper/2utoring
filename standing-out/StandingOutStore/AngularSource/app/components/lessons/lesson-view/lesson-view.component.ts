import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { LessonCard, TutorCard } from '../../../models/index';
import { ClassSessionsService } from '../../../services/index';

declare var title: any;
declare var classSessionId: any;
declare var canUserBuy: any;
declare var isLoggedIn: any;
declare var isGuardian: any;

@Component({
    selector: 'app-lesson-view',
    templateUrl: './lesson-view.component.html'
})

export class LessonViewComponent implements OnInit {
    constructor(private classSessionsService: ClassSessionsService, private location: Location) { }

    title: string = title;
    classSessionId: string = classSessionId;
    canUserBuy: boolean = canUserBuy;
    isLoggedIn: boolean = isLoggedIn;
    isGuardian: boolean = isGuardian;
    result: { lesson: LessonCard, tutor: TutorCard };

    getLessonAndTutorCard(): void {
        this.classSessionsService.getCardSet(this.classSessionId)
            .subscribe(success => {
                debugger;
                this.result = success;
            }, error => {
                console.log(error);
            });
    };

    ngOnInit() {
        this.getLessonAndTutorCard();
    };

    back() {
        this.location.back();
    };
}
