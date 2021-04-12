import { Component, ViewEncapsulation } from '@angular/core';
import { SubjectsService, StudyLevelsService, MainSearchService } from '../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 

declare var isAuthenticated: any;
@Component({
    selector: 'app-main-search',
    templateUrl: './main-search.component.html',
    //styleUrls: ['../../../../wwwroot/lib/assets/css/global.css'],
    encapsulation: ViewEncapsulation.None
})
export class MainSearchComponent {
    
    constructor(
        private mainSearchService: MainSearchService,
        private fb: FormBuilder,
    ) { debugger; }
    setSearchType: string = 'Tutor';
    subjects: {};
    studyLevels: {};
    mainSearchForm: FormGroup;
    mainSearchFormFormSubmitted: boolean = false;
    get mainSearchFormControls() { return this.mainSearchForm.controls };
    isAuthenticated: boolean = isAuthenticated;

    tutorFilter = {
        "searchType": "Tutor",
        "subjectId": "",
        "studyLevelId": "",
        "isUnder18": false
    }


    ngOnInit() {
        if (localStorage.getItem('searchType')) {
            this.setSearchType = localStorage.getItem('searchType');  
            this.tutorFilter.searchType = localStorage.getItem('searchType');          
        }
        this.getSubjects();
        //this.getStudyLevels();

        this.mainSearchForm = this.fb.group({
            isUnder18: [''],
            searchType: [this.setSearchType],
            subjectId: [''],
            levelId: [''],
            sortType: ['Cheapest']
        });

    }

    getSubjects(): void {
        this.mainSearchService.getAllTutorSubject()
            .subscribe(success => {
                this.subjects = success;
            }, error => {
                console.log(error);
            });
    };
 

    getStudyLevels(id): void {
        this.mainSearchService.getAllSubjectLevelBySubjectId(id)
            .subscribe(success => {
                this.studyLevels = success;
            }, error => {
                console.log(error);
            });
    };

    setAgeRange($event) {
        if ($event.target.checked) {
            this.mainSearchForm.controls["isUnder18"].setValue(true);
        } else {
            this.mainSearchForm.controls["isUnder18"].setValue(false);
        }
    }

    getRecords() {
        //we have to set localstorage and redirect to tutor search or course search page as per the selection
        this.mainSearchFormFormSubmitted = true;
        if (this.mainSearchForm.valid) {
            let obj = { ...this.mainSearchForm.getRawValue() };
            if (this.tutorFilter.searchType == 'Course') {
                localStorage.setItem('isUnder18', obj.isUnder18);
            } else {
                delete obj.isUnder18;
            }
            
            if (obj.levelId) {
                localStorage.setItem('studyLevelId', obj.levelId);
            }
            if (obj.subjectId) {
                localStorage.setItem('subjectId', obj.subjectId);
            }
            localStorage.setItem('searchType', obj.searchType);
            localStorage.setItem('sortType', obj.sortType);
            
            window.location.href = '/tutor-course-search';
        }
    }


    onSubjectChange($event) {
        if ($event) {
            let id = $event.target.options[$event.target.options.selectedIndex].value;
            if (id) {
                this.getStudyLevels(id);
                this.mainSearchForm.controls["subjectId"].setValue(id);
            }
        }
    }
    onLevelChange($event) {
        if ($event) {
            let id = $event.target.options[$event.target.options.selectedIndex].value;
            if (id) {
                //this.getStudyLevels(id);
                this.mainSearchForm.controls["levelId"].setValue(id);
            }
        }
    }

    setSerachTypes($event) {
        this.tutorFilter.searchType = $event.target.value;
        localStorage.setItem('searchType', this.tutorFilter.searchType);
    }

}

