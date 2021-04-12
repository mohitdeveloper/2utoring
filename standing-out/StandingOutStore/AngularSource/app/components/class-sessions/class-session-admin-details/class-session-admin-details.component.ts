import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ClassSessionsService, TutorsService, EnumsService, SubjectsService, SubjectCategoriesService, StudyLevelsService, SettingsService } from '../../../services';
import { ClassSession, EnumOption, GuidOption, Tutor, SearchOption } from '../../../models';

import { ToastrService } from 'ngx-toastr';
import { ClassSessionVideoRoomGroup } from '../../../models/class-session-video-room-group.model';

declare var title: any;
declare var classSessionId: any;
declare var classSessionOwnerId: any;

@Component({
    selector: 'app-class-session-admin-details',
    templateUrl: './class-session-admin-details.component.html',
    styleUrls: ['./class-session-admin-details.component.css']
})
export class ClassSessionAdminDetailsComponent implements OnInit {
    constructor(
        private classSessionsService: ClassSessionsService,
        private toastr: ToastrService
        ) { }

    title: string = title;
    classSessionId: string = classSessionId;
    classSession: ClassSession = new ClassSession();
    classSessionOwnerId: string = classSessionOwnerId;
    loaded: number = 0;
    toLoad: number = 1;
    groups: ClassSessionVideoRoomGroup[] = [];

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit(): void {
        $('.loading').show();
        debugger;
        this.classSessionsService.getRooms(this.classSessionId).subscribe(success => {
            this.groups = success;
            this.incrementLoad();
        }, err => {
        })
        this.getClassSession();
    }

    getClassSession(): void {
        this.classSessionsService.getById(this.classSessionId).subscribe(success => {
            this.classSession = success;
            console.log("Under16:", this.classSession.isUnder16);
            // this.classSession.isUnder16
        }, err => {});
    }
    
    viewRecording(classSessionVideoRoomId): void {
        if (this.classSession.isUnder16 == false) {
            this.toastr.error("Sorry, no recordings stored for Over 18 sessions");
        }
        else window.location.href = "/admin/classsessions/generatecomposition/" + classSessionVideoRoomId;
    }
}
