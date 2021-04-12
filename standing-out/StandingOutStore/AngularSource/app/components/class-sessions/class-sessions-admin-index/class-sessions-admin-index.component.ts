import { Component, OnInit, Input } from '@angular/core';
import { TableSearch, PagedList, ClassSession } from '../../../models/index';
import { ClassSessionsService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-class-sessions-admin-index',
    templateUrl: './class-sessions-admin-index.component.html',
    styleUrls: ['./class-sessions-admin-index.component.css']
})
export class ClassSessionsAdminIndexComponent implements OnInit {

    @Input() filter: string;
    url: string = window.location.hostname;
    title: string;
    constructor(private classSessionsService: ClassSessionsService, private toastr: ToastrService) { }

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

    getClassSessions(): void {
        $('.loading').show();
        this.classSessionsService.getPaged(this.searchModel)
            .subscribe(success => {
                this.results = success;
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

    enterLesson(lesson: ClassSession) {
        window.open(environment.classroomUrl + '/c/' + lesson.classSessionId, '_blank');
    };
}

