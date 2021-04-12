import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TutorsService, TutorQualificationsService, TutorSubjectsService, SubjectsService, SubjectCategoriesService, StudyLevelsService, TutorCertificatesService } from '../../../services';
import { Tutor, TutorQualification, TutorSubject, SearchOption, TutorCertificate } from '../../../models';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { ServiceHelper } from '../../../helpers';
import { ToastrService } from 'ngx-toastr';
import * as $ from "jquery";
import { CalenderComponent } from '../../calender/calender.component';
import { CropperComponent } from 'angular-cropperjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-tutor-profile-edit',
    templateUrl: './tutor-profile-edit.component.html',
    styleUrls: ['./tutor-profile-edit.component.css']
})
export class TutorProfileEditComponent implements OnInit {

    serviceHelper: ServiceHelper = new ServiceHelper();

    @Input() tutorId: string;
    @Input() showEditButton: boolean;
    loaded: number = 0;
    toLoad: number = 5;
    tutor: Tutor;
    tutorQualifications: TutorQualification[] = [];
    tutorSubjects: TutorSubject[] = [];
    bookedSlot: any;

    public profileThreeUploader: FileUploader = new FileUploader({ url: this.serviceHelper.baseApi + '/api/tutors/profileUpload', method: 'POST' });
    public profileThreeDropZoneOver: boolean = false;
    profileThreeUploaderShow: boolean = true;

    profileForm: FormGroup;
    profileFormSubmitted: boolean = false;
    get profileFormControls() { return this.profileForm.controls };

    qualificationForm: FormGroup;
    qualificationFormSubmitted: boolean = false;
    get qualificationFormControls() { return this.qualificationForm.controls };

    public qualificationFormUploader: FileUploader = new FileUploader({ url: this.serviceHelper.baseApi + '/api/tutorCertificates/upload', method: 'POST' });
    public qualificationFormDropZoneOver: boolean = false;
    qualificationFormUploaderShow: boolean = true;
    tutorCertificates: TutorCertificate[] = [];

    subjectForm: FormGroup;
    subjectFormSubmitted: boolean = false;
    get subjectFormControls() { return this.subjectForm.controls };
    get tutorSubjectStudyLevelsFormArrayControls() { return this.subjectForm.get('tutorSubjectStudyLevels') as FormArray; }
    subjects: SearchOption[] = [];
    subjectCategorys: SearchOption[] = [];
    registerdEvents: any;
    @ViewChild('calendarRef') calendarRef: CalenderComponent;
    @ViewChild('angularCropper') public angularCropper: CropperComponent;
    profileThreeUploaderPreviewUrl: any = '';
    config = {
        aspectRatio: 16 / 16,
        dragMode: 'move',
        background: true,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
        viewMode: 1,
        checkImageOrigin: true,
        cropmove: this.cropMoved.bind(this),
        ready: this.cropMoved.bind(this),
        checkCrossOrigin: true
    };
    constructor(private fb: FormBuilder, private toastr: ToastrService, private tutorsService: TutorsService, private tutorQualificationsService: TutorQualificationsService, private tutorCertificatesService: TutorCertificatesService, private tutorSubjectsService: TutorSubjectsService, private subjectsService: SubjectsService, private subjectCategoriesService: SubjectCategoriesService, private studyLevelsService: StudyLevelsService, private sanitizer: DomSanitizer) { }

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit(): void {
        console.log(this.tutorId);
        $('.loading').show();
        this.tutorsService.getAvailability(this.tutorId).subscribe(respt=>{
            this.registerdEvents = respt;              
            },error=> {
    
        });

        this.tutorsService.getById(this.tutorId)
            .subscribe(success => {
                this.tutor = success;
                this.profileForm = this.fb.group({
                    tutorId: [success.tutorId],
                    userFirstName: [success.userFirstName],
                    header: [success.header, [Validators.required, Validators.maxLength(250)]],
                    subHeader: [success.subHeader, [Validators.maxLength(2000)]],
                    biography: [success.biography, [Validators.maxLength(2000)]],
                    profileTeachingExperiance: [success.profileTeachingExperiance, [Validators.maxLength(2000)]],
                    profileHowITeach: [success.profileHowITeach, [Validators.maxLength(2000)]],
                });
                this.incrementLoad();
            }, error => {
            });
        this.resetQualificationForm();
        this.resetSubjectForm();
        this.subjectsService.getOptions()
            .subscribe(success => {
                this.subjects = success;
                this.incrementLoad();
            }, error => {
                this.subjects = [];
            });
        this.subjectCategoriesService.getOptions()
            .subscribe(success => {
                this.subjectCategorys = success;
                this.incrementLoad();
            }, error => {
                this.subjectCategorys = [];
            });

        this.tutorsService.getBookedSlot(this.tutorId)
            .subscribe(success => {
                this.bookedSlot = success;
                debugger;

            }, error => {
            });
        this.tutorCertificatesService.getByTutor(this.tutorId)
            .subscribe(success => {
                this.tutorCertificates = success;
                $('.loading').hide();
            }, error => {
            });
    }

    public fileOverProfileThreeUploader(e: any): void {
        this.profileThreeDropZoneOver = e;
    }

    public profileThreeUploaderFileDropped(e: any): void {
        /*if (this.profileThreeUploader.queue.length > 1) {
            this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
        }*/
        let index = this.profileThreeUploader.queue.length - 1;
        this.profileThreeUploaderPreviewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(this.profileThreeUploader.queue[index]._file)));
    }

    uploadProfileImage() {
        if (this.profileThreeUploader.queue.length > 0) {
            $('.loading').show();
            this.profileThreeUploader.uploadAll();
            this.profileThreeUploaderShow = false;
            this.profileThreeUploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.profileThreeUploader.clearQueue();
                    this.profileThreeUploaderShow = true;
                    this.tutorsService.getById(this.tutorId)
                        .subscribe(success => {
                            this.tutor = success;
                            $('.loading').hide();
                        }, error => {
                        });
                } else {
                    $('.loading').hide();
                    this.profileThreeUploader.clearQueue();
                    this.profileThreeUploaderShow = true;
                    this.toastr.error('We were unable to upload your profile picture');
                }
            }
        }
    }

    submitProfileForm() {
        debugger;
        this.profileFormSubmitted = true;
        if (this.profileForm.valid) {
            $('.loading').show();
            this.tutorsService.saveProfile(this.profileForm.getRawValue())
                .subscribe(success => {
                    $('.loading').hide();
                    this.uploadProfileImage();
                    window.location.href = "/Tutor/Profile/View";
                }, error => {
                });
            

            //let obj = this.calendarRef.addedEvents;
            //if (this.calendarRef.deletedEvents.length > 0) {
            //    Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
            //}

            //this.tutorsService.saveAvailability(obj).subscribe(success => {
            //    $('.loading').hide();
            //}, error => {
            //        $('.loading').hide();
            //});
        }
    };

    resetQualificationForm() {
        this.tutorQualificationsService.getByTutor(this.tutorId)
            .subscribe(success => {
                this.tutorQualifications = success;
                this.qualificationFormSubmitted = false;
                this.qualificationForm = this.fb.group({
                    tutorId: [this.tutorId],
                    name: ['', [Validators.required, Validators.maxLength(250)]],
                });
                this.incrementLoad();
            }, error => {
            });
    };

    submitQualificationForm() {
        this.qualificationFormSubmitted = true;
        if (this.qualificationForm.valid) {
            $('.loading').show();
            this.tutorQualificationsService.create(this.qualificationForm.getRawValue())
                .subscribe(success => {
                    this.resetQualificationForm();
                }, error => {
                });
        }
    };

    deleteTutorQualification(tutorQualification: TutorQualification) {
        $('.loading').show();
        this.tutorQualificationsService.delete(tutorQualification.tutorQualificationId)
            .subscribe(success => {
                this.tutorQualificationsService.getByTutor(this.tutorId)
                    .subscribe(success => {
                        this.tutorQualifications = success;
                        $('.loading').hide();
                    }, error => {
                    });
            }, error => {
            });
    };

    public fileOverQualificationFormUploader(e: any): void {
        this.qualificationFormDropZoneOver = e;
    }

    public qualificationFormUploaderFileDropped(e: any): void {
        console.log(this.qualificationFormUploader.queue);
        if (this.qualificationFormUploader.queue.length > 0) {
            $('.loading').show();
            this.qualificationFormUploader.uploadAll();
            this.qualificationFormUploaderShow = false;
            this.qualificationFormUploader.onSuccessItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
                if (status == 200) {
                    this.qualificationFormUploader.clearQueue();
                    this.qualificationFormUploaderShow = true;
                    this.tutorCertificatesService.getByTutor(this.tutorId)
                        .subscribe(success => {
                            this.tutorCertificates = success;
                            $('.loading').hide();
                        }, error => {
                        });
                } else {
                    $('.loading').hide();
                    this.qualificationFormUploader.clearQueue();
                    this.qualificationFormUploaderShow = true;
                    this.toastr.error('We were unable to upload your document');
                }
            }
        }
    }

    deleteTutorCertificate(tutorCertificate: TutorCertificate) {
        $('.loading').show();
        this.tutorCertificatesService.delete(tutorCertificate.tutorCertificateId)
            .subscribe(success => {
                this.tutorCertificatesService.getByTutor(this.tutorId)
                    .subscribe(success => {
                        this.tutorCertificates = success;
                        $('.loading').hide();
                    }, error => {
                    });
            }, error => {
            });
    };

    resetSubjectForm() {
        this.tutorSubjectsService.getByTutor(this.tutorId)
            .subscribe(success => {
                this.tutorSubjects = success;
                this.subjectFormSubmitted = false;
                this.subjectForm = this.fb.group({
                    tutorId: [this.tutorId],
                    subjectId: [null, [Validators.required]],
                    subjectCategoryId: [null, []],
                    tutorSubjectStudyLevels: this.fb.array([])
                });
                this.studyLevelsService.getOptions()
                    .subscribe(studyLevelsSuccess => {
                        for (var i = 0; i < studyLevelsSuccess.length; i++) {
                            const tutorSubjectStudyLevel = this.fb.group({
                                studyLevelId: [studyLevelsSuccess[i].id, []],
                                name: [studyLevelsSuccess[i].name, []],
                                checked: [false, []],
                            });

                            this.tutorSubjectStudyLevelsFormArrayControls.push(tutorSubjectStudyLevel);
                        }
                    }, error => {
                    });
                this.incrementLoad();
            }, error => {
            });
    };

    getSubjectCategorys() {
        if (this.subjectForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.subjectForm.get('subjectId').value)
                .subscribe(success => {
                    this.subjectCategorys = success;
                    $('.loading').hide();
                }, error => {
                });
        }
    };

    submitSubjectForm() {
        this.subjectFormSubmitted = true;
        if (this.subjectForm.valid) {
            if (this.tutorSubjectStudyLevelsFormArrayControls.value.filter(u => u.checked == true).length > 0) {
                $('.loading').show();
                this.tutorSubjectsService.create(this.subjectForm.getRawValue())
                    .subscribe(success => {
                        this.resetSubjectForm();
                    }, error => {
                    });
            } else {
                this.toastr.error('Please select at least 1 level to save a subject',);
            }
        }
    };

    deleteTutorSubject(tutorSubject: TutorSubject) {
        $('.loading').show();
        this.tutorSubjectsService.delete(tutorSubject.tutorSubjectId)
            .subscribe(success => {
                this.resetSubjectForm();
            }, error => {
            });
    };

    cropMoved(data) {
        debugger;
        let canvas = this.angularCropper.cropper.getCroppedCanvas({
            width: 170,
            height: 170,
        });
        this.tutor.storeProfileImageDownload = canvas.toDataURL();
        canvas.toBlob((blob: any) => {
            debugger;
            blob['name'] = 'myfilename.png';
            /*if (this.profileThreeUploader.queue.length > 1) {
                this.profileThreeUploader.removeFromQueue(this.profileThreeUploader.queue[0]);
            }*/
            // this.croppedProfileImage = blob;
            this.profileThreeUploader.clearQueue();
            this.profileThreeUploader.addToQueue([blob]);
        })

        $('.cropper img').show();
    }
}
