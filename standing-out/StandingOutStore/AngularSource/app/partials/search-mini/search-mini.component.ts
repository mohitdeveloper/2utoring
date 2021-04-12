import { Component, OnInit } from '@angular/core';
import { GuidOptionExtended, SearchOption } from '../../models/index';
import { SubjectsService, SubjectCategoriesService, StudyLevelsService } from '../../services/index';
@Component({
    selector: 'app-search-mini',
    templateUrl: './search-mini.component.html'
})

export class SearchMiniComponent implements OnInit {
    constructor(private subjectsService: SubjectsService, private subjectCategoriesService: SubjectCategoriesService,
        private studyLevelsService: StudyLevelsService) { }

    subject: string = null;
    subjectCategory: string = null;
    subjectCategoryUrl: string = null; // Separate id and url here as potential for duplicate categories between groups
    studyLevelUrl: string = null;
    isUnder16: boolean = true;

    subjects: SearchOption[] = [];
    filteredSubjects: SearchOption[] = [];
    subjectCategories: GuidOptionExtended[] = [];
    filteredSubjectCategories: GuidOptionExtended[] = [];
    studyLevels: SearchOption[] = [];

    buildUrl(): string {
        let queryString: string = '';
        let url: string = '';      

        if (this.subject != null) {
            url += `/subject/${encodeURIComponent(this.subject)}`;
        }

        if (this.subjectCategory != null) {
            url += `/learn/${encodeURIComponent(this.subjectCategoryUrl)}`;
        }
         
        if (this.studyLevelUrl != null) {
            url += `/level/${encodeURIComponent(this.studyLevelUrl)}`;
        }

        if (this.isUnder16 != null && this.isUnder16 == false) {
            queryString += (queryString == '' ? '?' : '&') + 'under=' + this.isUnder16;
        }

        return `/find-a-lesson${url}${queryString}`;
    };

    getSubjects(): void {
        this.subjectsService.getOptions()
            .subscribe(success => {
                this.subjects = success;
                this.filteredSubjects = success;
            }, error => {
                console.log(error);
            });
    };

    getSubjectCategories(): void {
        this.subjectCategoriesService.getOptions()
            .subscribe(success => {
                this.subjectCategories = success;
                this.filteredSubjectCategories = success;
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

    search(): void {
        window.location.href = this.buildUrl();
    };

    ngOnInit() {
        this.getSubjects();
        this.getSubjectCategories();
        this.getStudyLevels();
    };

    changeSubjectCategory(): void {
        if (this.subjectCategory == null) {
            this.filteredSubjects = this.subjects;
            this.subjectCategoryUrl = null;
        }
        else {
            for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                if (this.filteredSubjectCategories[i].id == this.subjectCategory) {
                    this.subjectCategoryUrl = this.filteredSubjectCategories[i].url;
                    for (var j = 0; j < this.subjects.length; j++) {
                        if (this.subjects[j].id == this.filteredSubjectCategories[i].parentValue) {
                            this.filteredSubjects = [this.subjects[j]];
                            if (this.subject == null) {
                                this.subject = this.subjects[j].url;
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
        if (this.subject != null) {
            if (this.subjectCategory != null) {
                for (var i = 0; i < this.subjectCategories.length; i++) {
                    if (this.subjectCategories[i].url == this.subjectCategory) {
                        if (this.subjectCategories[i].parentUrl != this.subject) {
                            this.subjectCategory = null;
                        }
                        break;
                    }
                }
            }
            this.filteredSubjectCategories = this.subjectCategoriesToShow();
        }
        else {
            this.subjectCategory = null;
            this.subjectCategoryUrl = null;
            this.filteredSubjectCategories = this.subjectCategories;
            this.filteredSubjects = this.subjects;
        }
    };

    subjectCategoriesToShow(): GuidOptionExtended[] {
        let toShow: GuidOptionExtended[] = [];
        for (var i = 0; i < this.subjectCategories.length; i++) {
            if (this.subjectCategories[i].parentUrl == this.subject) {
                toShow.push(this.subjectCategories[i]);
            }
        }
        return toShow;
    };
}
