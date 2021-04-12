import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, SubjectCategory } from '../../../models/index';
import { SubjectCategoriesService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';

declare var title: any;

@Component({
    selector: 'app-subject-categories-index',
    templateUrl: './subject-categories-index.component.html'
})

export class SubjectCategoriesIndexComponent implements OnInit {
    constructor(private subjectCategoriesService: SubjectCategoriesService) { }

    title: string = title;
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
        sortType: 'Name',
        order: 'ASC',
        filter: '',
    };

    results: PagedList<SubjectCategory> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getSubjectCategories();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getSubjectCategories();
    };

    next(): void {
        this.searchModel.page++;
        this.getSubjectCategories();
    };

    previous(): void {
        this.searchModel.page--;
        this.getSubjectCategories();
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

    getSubjectCategories(): void {
        $('.loading').show();

        this.subjectCategoriesService.getPaged(this.searchModel)
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
        this.getSubjectCategories();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
}

