import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PagedList, UserProfile, LessonSearch, LessonCard, GuidOption, GuidOptionExtended, SearchOption } from '../../models/index';
import { ClassSessionsService, SubjectsService, SubjectCategoriesService, StudyLevelsService } from '../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';

declare var title: any;
declare var subject: any;
declare var subjectCategory: any;
declare var studyLevelUrl: any;
declare var isUnder16: any;
declare var search: any;
declare var page: any;
declare var canUserBuy: any;
declare var isLoggedIn: any;
declare var isGuardian: any;

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit {
    constructor(private subjectsService: SubjectsService, private subjectCategoriesService: SubjectCategoriesService,
        private studyLevelsService: StudyLevelsService, private classSessionsService: ClassSessionsService,
        private location: Location) {
    
    }

    toLoadFilters: number = 2;
    loadedFilters: number = 0;

    title: string = title;
    canUserBuy: boolean = canUserBuy;
    isLoggedIn: boolean = isLoggedIn;
    isGuardian: boolean = isGuardian;

    subjectCategoryId: string = null;
    searchModel: LessonSearch = {
        take: 8,
        page: page,
        totalPages: 1,

        subject: subject == '' ? null : subject,
        subjectCategory: subjectCategory == '' ? null : subjectCategory,
        studyLevelUrl: studyLevelUrl == '' ? null : studyLevelUrl,
        isUnder16: isUnder16,
        search: search
    };

    subjects: SearchOption[] = [];
    filteredSubjects: SearchOption[] = [];
    subjectCategories: GuidOptionExtended[] = [];
    filteredSubjectCategories: GuidOptionExtended[] = [];
    studyLevels: SearchOption[] = [];
    results: PagedList<LessonCard> = { paged: null, data: null };
    searchModelSubmitted: boolean = false;
    lastIsUnder16: boolean = this.searchModel.isUnder16;

    resetUrl(): void {
        let queryString: string = '';
        let url: string = '';      

        if (this.searchModel.subject != null) {
            url += `/subject/${encodeURIComponent(this.searchModel.subject)}`;
        }

        if (this.searchModel.subjectCategory != null) {
            url += `/learn/${encodeURIComponent(this.searchModel.subjectCategory)}`;
        }
         
        if (this.searchModel.studyLevelUrl != null) {
            url += `/level/${encodeURIComponent(this.searchModel.studyLevelUrl)}`;
        }

        if (this.searchModel.isUnder16 != null && this.searchModel.isUnder16 == false) {
            queryString += (queryString == '' ? '?' : '&') + 'under=' + this.searchModel.isUnder16;
        }
        if (this.searchModel.search != null && this.searchModel.search != '') {
            queryString += (queryString == '' ? '?' : '&') + 'search=' + encodeURIComponent(this.searchModel.search);
        }
        if (this.searchModel.page > 1) {
            queryString += (queryString == '' ? '?' : '&') + 'page=' + this.searchModel.page;
        }
        this.location.go(`find-a-lesson${url}`, queryString);
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.resetUrl();
        this.getLessons();
    };

    next(): void {
        this.searchModel.page++;
        this.resetUrl();
        this.getLessons();
    };

    previous(): void {
        this.searchModel.page--;
        this.resetUrl();
        this.getLessons();
    };

    getLessons(): void {
        $('.loading').show();
        this.classSessionsService.getPagedCards(this.searchModel)
            .subscribe(success => {
                this.lastIsUnder16 = this.searchModel.isUnder16;
                this.results = success;
                this.searchModelSubmitted = true;
                // These could not match is someone was to go away for a period, come back and refresh/use link, and that page no longer exist
                if (this.results.paged.page != this.searchModel.page) {
                    this.searchModel.page = this.results.paged.page;
                    this.resetUrl();
                }
                $('.loading').hide();
            }, error => {
                console.log(error);
            });
    };

    // To ensure proper filtering
    incrementLoadFilters(): void {
        this.loadedFilters++;
        if (this.toLoadFilters <= this.loadedFilters) {
            if (this.searchModel.subject != null) {
                // SUBJECT SELECTED ONLY
                this.filteredSubjects = this.subjects;
                this.changeSubject();

                if (this.searchModel.subjectCategory != null) {
                    // BOTH SELECTED
                    for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                        if (this.searchModel.subjectCategory == this.filteredSubjectCategories[i].url) {
                            this.subjectCategoryId = this.filteredSubjectCategories[i].id;
                            this.changeSubjectCategory();
                            break;
                        }
                    }
                }
            }
            else {
                if (this.searchModel.subjectCategory != null) {
                    // CATEGORY SELECTED ONLY
                    // If gets here someone played with the url so will make best guess
                    this.filteredSubjects = this.subjects;
                    this.filteredSubjectCategories = this.subjectCategories;
                    for (var i = 0; i < this.subjectCategories.length; i++) {
                        if (this.searchModel.subjectCategory == this.subjectCategories[i].url) {
                            this.subjectCategoryId = this.subjectCategories[i].id;
                            this.changeSubjectCategory();
                            break;
                        }
                    }
                }
                else {
                    // NEITHER SELECTED
                    this.filteredSubjects = this.subjects;
                    this.filteredSubjectCategories = this.subjectCategories;
                }
            }
        }
    };

    getSubjects(): void {
        this.subjectsService.getOptions()
            .subscribe(success => {
                this.subjects = success;
                this.incrementLoadFilters();
            }, error => {
                console.log(error);
            });
    };

    getSubjectCategories(): void {
        this.subjectCategoriesService.getOptions()
            .subscribe(success => {
                this.subjectCategories = success;
                this.incrementLoadFilters();
            }, error => {
                console.log(error);
            });
    };

    getStudyLevels(): void {
        this.studyLevelsService.getOptions()
            .subscribe(success => {
                this.studyLevels = success;
            }, error => {
                console.log(error);
            });
    };

    ngOnInit() {
        this.getLessons();
        this.getSubjects();
        this.getSubjectCategories();
        this.getStudyLevels();
    };

    changeSubjectCategory(): void {
        if (this.subjectCategoryId == null) {
            this.filteredSubjects = this.subjects;
            this.searchModel.subjectCategory  = null;
        }
        else {
            for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                if (this.filteredSubjectCategories[i].id == this.subjectCategoryId) {
                    this.searchModel.subjectCategory = this.filteredSubjectCategories[i].url;
                    for (var j = 0; j < this.subjects.length; j++) {
                        if (this.subjects[j].id == this.filteredSubjectCategories[i].parentValue) {
                            this.filteredSubjects = [this.subjects[j]];
                            if (this.searchModel.subject == null) {
                                this.searchModel.subject = this.subjects[j].url;
                                this.filteredSubjectCategories = this.subjectCategoriesToShow();
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    };

    changeSubject(): void {
        if (this.searchModel.subject != null) {
            if (this.searchModel.subjectCategory != null) {
                for (var i = 0; i < this.subjectCategories.length; i++) {
                    if (this.subjectCategories[i].url == this.searchModel.subjectCategory) {
                        if (this.subjectCategories[i].parentUrl != this.searchModel.subject) {
                            this.searchModel.subjectCategory = null;
                        }
                        break;
                    }
                }
            }
            this.filteredSubjectCategories = this.subjectCategoriesToShow();
        }
        else {
            this.subjectCategoryId = null;
            this.searchModel.subjectCategory = null;
            this.filteredSubjectCategories = this.subjectCategories;
            this.filteredSubjects = this.subjects;
        }
    };

    subjectCategoriesToShow(): GuidOptionExtended[] {
        let toShow: GuidOptionExtended[] = [];
        for (var i = 0; i < this.subjectCategories.length; i++) {
            if (this.subjectCategories[i].parentUrl == this.searchModel.subject) {
                toShow.push(this.subjectCategories[i]);
            }
        }
        return toShow;
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
}
