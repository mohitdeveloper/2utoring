import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SubjectsService, StudyLevelsService } from '../../services';
import { FormBuilder, Validators, FormGroup, EmailValidator } from '@angular/forms';
import { RegexHelper } from '../../helpers';
import { WebsiteContactService } from '../../services/website-contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-website-contact',
    templateUrl: './website.contact.component.html',
    styleUrls: ['./website.contact.component.css']
})

export class WebsiteContactComponent implements OnInit {
    @ViewChild('filterTime') filterTime;
    contactFormSubmitted: boolean;
    contactForm: FormGroup;
    subjectList: any;
    studyLevelList: any;
    weekDays: any = [
        { value: 0, name: 'Sunday' },
        { value: 1, name: 'Monday' },
        { value: 2, name: 'Tuesday' },
        { value: 3, name: 'Wednesday' },
        { value: 4, name: 'Thursday' },
        { value: 5, name: 'Friday' },
        { value: 6, name: 'Saturday' }
    ]
    selectedDays: any = [];



    get contactFormControls() { return this.contactForm.controls; };
    constructor(private toastr: ToastrService, private formBuilder: FormBuilder, private subjectsService: SubjectsService, private studyLevelsService: StudyLevelsService, private websiteCountactService: WebsiteContactService) {

    }
    getSubjects(): void {
        this.subjectsService.getOptions()
            .subscribe(success => {
                this.subjectList = success;
            }, error => {
                console.log(error);
            });
    };

    getStudyLevels(): void {
        this.studyLevelsService.getOptions()
            .subscribe(success => {
                this.studyLevelList = success;
            }, error => {
                console.log(error);
            });
    };

    setupContactForm(): void {
        this.contactForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(100)]],
            lastName: ['', [Validators.required, Validators.maxLength(100)]],
            contactEmail: ['', [Validators.required, Validators.maxLength(250), Validators.email]],
            subjectId: [null, [Validators.required]],
            studyLevelId: [null , [Validators.required]],
            searchFor: [null, [Validators.required]],
            time: ['00:00'],
            days: ['', [Validators.required]],
            description: ['', [Validators.maxLength(2000)]],
        });
    };

    ngOnInit() {
        this.getSubjects();
        this.getStudyLevels();
        this.setupContactForm();
        this.filterTime.nativeElement.value = '00:00';
    };
    submitContactForm(): void {
        console.log(this.contactForm.value);
        this.contactFormSubmitted = true;
        if (this.contactForm.valid) {
            this.websiteCountactService.create({ ...this.contactForm.value })
                .subscribe(success => {
                    if (success) {
                        this.toastr.success('Request send successfully!');
                        this.selectedDays = [];
                        this.contactForm.reset();
                        this.contactFormSubmitted = false;
                        //to set defaut dropdown value 
                        this.contactForm.controls.state.setValue({ searchFor: null });
                        this.contactForm.controls.state.setValue({ subjectId: null });
                        this.contactForm.controls.state.setValue({ studyLevelId: null });
                    }
                }, error => {
                    console.log(error);
                });
        }
       

    };
    getSelectedDays($event) {
        let day = parseInt($event.target.value);
        if ($event.target.checked) {
            this.selectedDays.push(day);
        } else {
            this.selectedDays = this.selectedDays.filter(a => a != day);
        }
        this.contactForm.controls["days"].setValue(this.selectedDays.join());
        //console.log(this.selectedDays);
    }

    getFilterTime() {
        this.contactForm.controls["time"].setValue(this.filterTime.nativeElement.value);
        //console.log(this.filterTime.nativeElement.value);
        
    }
}
