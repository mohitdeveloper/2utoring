import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SafeguardingLessonOption } from '../../../models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClassSessionsService, SafeguardingReportsService } from '../../../services/index';
import { TickModal } from '../../../partials/tick-modal/tick-modal';

@Component({
    selector: 'app-safeguarding-create',
    templateUrl: './safeguarding-create.component.html'
})

export class SafeguardingCreateComponent implements OnInit {
    constructor(private formBuilder: FormBuilder, private classSessionsService: ClassSessionsService,
        private safeguardingReportsService: SafeguardingReportsService, private modalService: NgbModal) { }

    lessons: SafeguardingLessonOption[] = [];
    reportForm: FormGroup;
    get reportFormControls() { return this.reportForm.controls; };
    reportFormSubmitted: boolean = false;

    send(): void {
        this.reportFormSubmitted = true;
        if (this.reportForm.valid) {
            this.safeguardingReportsService.create(this.reportForm.value)
                .subscribe(success => {
                    let navTo = '/my/timetable';
                    const modalRef = this.modalService.open(TickModal, { size: 'md' });

                    modalRef.componentInstance.title = 'We\'ve recieved your report';
                    modalRef.componentInstance.navTo = navTo;
                    modalRef.componentInstance.button = 'Back to timetable';

                    //handle the response
                    modalRef.result.then((result) => {
                    }, (reason) => {
                            window.location.href = navTo;
                    });
                }, error => {
                        console.log(error);
                });
        }
    };

    close(): void {
        window.location.href = '/my/timetable';
    };

    getLessons(): void {
        this.classSessionsService.getSafeguardingOptions()
            .subscribe(success => {
                this.lessons = success;
                this.setupReportForm();
            }, error => {
                console.log(error);
            });
    };

    setupReportForm(): void {
        if (this.lessons.length > 0) {
            this.reportForm = this.formBuilder.group({
                classSessionId: [null, [Validators.required]],
                title: [null, [Validators.required]],
                description: ['', [Validators.required, Validators.maxLength(2000)]]
            });
        }
        else {
            this.reportForm = this.formBuilder.group({
                classSessionId: [null, []],
                title: [null, [Validators.required]],
                description: ['', [Validators.required, Validators.maxLength(2000)]]
            });
        }
    };

    ngOnInit(): void {
        this.getLessons();
    };
}
