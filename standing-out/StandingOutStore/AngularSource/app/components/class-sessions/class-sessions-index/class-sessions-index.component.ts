import { Component, OnInit, Input } from '@angular/core';
import { TableSearch, PagedList, ClassSession, ClassSessionFeatures, Tutor } from '../../../models/index';
import { ClassSessionsService, ClassSessionFeaturesService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-class-sessions-index',
    templateUrl: './class-sessions-index.component.html',
    styleUrls: ['./class-sessions-index.component.css']
})
export class ClassSessionsIndexComponent implements OnInit {

    @Input() filter: string;
    url: string = window.location.hostname;

    constructor(private classSessionsService: ClassSessionsService, private toastr: ToastrService, private classSessionFeaturesService: ClassSessionFeaturesService) { }

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

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getClassSessions();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getClassSessions();
    };

    next(): void {
        this.searchModel.page++;
        this.getClassSessions();
    };

    previous(): void {
        this.searchModel.page--;
        this.getClassSessions();
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
                .subscribe(features => {}, error => {});
        }
    }

    getClassSessions(): void {
        $('.loading').show();
        this.classSessionsService.getPaged(this.searchModel)
            .subscribe(success => {
                this.results = success;
                this.loadTutorSubscriptionFeatures(success.data);
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

        this.getClassSessions();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    getLink(item: ClassSession): void {
        const el = document.createElement('textarea');
        el.value = this.url + '/lesson/' + item.classSessionId;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.toastr.success('The link for this lesson has been copied to your clipboard');
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
}

