import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {
    ClassSessionsService, TutorsService, EnumsService, SubjectsService, SubjectCategoriesService, StudyLevelsService,
    SettingsService, ClassSessionFeaturesService
} from '../../../services';
import { ClassSession, EnumOption, GuidOption, Tutor, SearchOption, ClassSessionFeatures } from '../../../models';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

declare var classSessionId: any;

@Component({
    selector: 'app-class-sessions-details',
    templateUrl: './class-sessions-details.component.html',
    styleUrls: ['./class-sessions-details.component.css']
})
export class ClassSessionsDetailsComponent implements OnInit {

    classSessionId: string = classSessionId;
    classSessionComplete: boolean = false;
    classSession: ClassSession;
    loaded: number = 0;
    toLoad: number = 7;
    tutor: Tutor;
    subjects: SearchOption[] = [];
    subjectCategorys: SearchOption[] = [];
    studyLevels: SearchOption[] = [];
    types: EnumOption[] = [];
    scheduleTypes: EnumOption[] = [];
    baseClassSessionCommision: number;
    currentUrl: string = window.location.href;
    classSessionFeatures: ClassSessionFeatures = new ClassSessionFeatures();
    // Three features to apply when edit/creating lesson: ClassSize, PrivateLessons, CommissionPerStudent
    classSizeLimit: number;

    classSessionForm: FormGroup;
    classSessionFormSubmitted: boolean = false;

    get classSessionFormControls() { return this.classSessionForm.controls };

    constructor(private fb: FormBuilder,
        private toastr: ToastrService,
        private classSessionsService: ClassSessionsService,
        private tutorsService: TutorsService,
        private enumsService: EnumsService,
        private subjectsService: SubjectsService,
        private subjectCategoriesService: SubjectCategoriesService,
        private studyLevelsService: StudyLevelsService,
        private settingsService: SettingsService,
        private classSessionFeaturesService: ClassSessionFeaturesService) {
    }

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit(): void {
    //console.log("this:", this.tutor);
        $('.loading').show();
        this.subjectsService.getOptions()
            .subscribe(success => {
                this.subjects = success;
                this.incrementLoad();
            },
                error => {
                });
        this.subjectCategoriesService.getOptions()
            .subscribe(success => {
                this.subjectCategorys = success;
                this.incrementLoad();
            },
                error => {
                });
        this.studyLevelsService.getOptions()
            .subscribe(success => {
                this.studyLevels = success;
                this.incrementLoad();
            },
                error => {
                });
        this.enumsService.get('ClassSessionType')
            .subscribe(success => {
                //console.log("loaded types");
                this.types = success;
                this.incrementLoad();
            },
                error => {
                });
        this.enumsService.get('ClassSessionScheduleType')
            .subscribe(success => {
                this.scheduleTypes = success;
                this.incrementLoad();
            },
                error => {
                });
        this.settingsService.getBaseClassSessionCommision()
            .subscribe(success => {
                // This commission is no longer valid.. See Subscription Features - Commission Tiers
                this.baseClassSessionCommision = success;
                //console.log("Settings baseClassSessionCommision:", this.baseClassSessionCommision);
                this.incrementLoad();
            },
                error => {
                });
        this.setupClassSessionByMode();
    }

    setupClassSessionByMode(): void {
        this.isCreateMode() ? this.setupCreateModeClassSession() : this.setupEditModeClassSession();
    }

    // Create mode form
    setupCreateModeClassSession(): void {
        this.setupClassSessionForm(new ClassSession());
    }

    // Edit mode form
    setupEditModeClassSession(): void {
        this.setupExistingClassSession();
    }

    setupExistingClassSession(): void {
        this.classSessionsService.getById(this.classSessionId)
            .subscribe(
                success => {
                    this.classSessionComplete = success.complete;
                    this.classSession = success;
                    this.setupClassSessionForm(success);
                },
                error => { });
    }

    // usage getClassSessionFeaturesByTutorId.subscribe(features => { // do stuff with features });
    getClassSessionFeaturesByTutorId: Observable<ClassSessionFeatures> = new Observable(subscriber => {
        //console.log("Getting classroom subscription features..");
        this.classSessionFeaturesService.getClassroomSubscriptionFeaturesByTutorId(this.tutor.tutorId)
            .subscribe(features => {
                //console.log("Got classroom subscription features:", features);
                this.classSessionFeatures = features;
                subscriber.next(features);
            }, error => { console.log("Could not get classroom subscription features") });
    });

    isCreateMode(): boolean {
        return (this.classSessionId == undefined);
    }

    getClassSizeLimit(): number {
        const classSizeLimit = this.isCreateMode()
            ? this.classSessionFeatures.tutorDashboard_CreateLesson_Session_MaxPersons
            : this.classSessionFeatures.tutorDashboard_EditLesson_Session_MaxPersons;
        return classSizeLimit;
    }

    // should have features available before being called
    populateForm(classSession: ClassSession): void {
        this.classSessionFormSubmitted = false;
        if (this.isCreateMode() && this.tutor.localLogin == false) {
            classSession.requiresGoogleAccount = true;
        }
        this.classSessionForm = this.fb.group(this.setupFormControls(classSession));
    }

    setupFormControls(classSession: ClassSession): any {
        this.classSizeLimit = this.getClassSizeLimit();

        if (classSession.maxPersons > this.classSizeLimit)
            classSession.maxPersons = this.classSizeLimit;

        //console.log("Setting class size limit:", this.classSizeLimit);

        return {
            classSessionId: [classSession.classSessionId],
            ownerId: [this.tutor.userId],
            requiresGoogleAccount: [{ value: classSession.requiresGoogleAccount, disabled: (this.tutor.localLogin == true || classSession.started == true) }],
            name: [classSession.name, [Validators.required, Validators.maxLength(40)]],
            subjectId: [classSession.subjectId, [Validators.required]],
            subjectCategoryId: [classSession.subjectCategoryId, [Validators.required]],
            studyLevelId: [classSession.studyLevelId, [Validators.required]],
            maxPersons: [classSession.maxPersons, [Validators.required, Validators.min(1), Validators.max(this.classSizeLimit), Validators.pattern('^[0-9]+$')]],
            isUnder16: [{ value: classSession.isUnder16, disabled: this.tutor.dbsApprovalStatus != 'Approved' }],
            type: [classSession.type, [Validators.required]],
            lessonDescriptionBody: [classSession.lessonDescriptionBody, [Validators.required, Validators.maxLength(500)]],
            startDate: [classSession.startDate, [Validators.required]],
            detailsDuration: [classSession.detailsDuration, [Validators.required]],
            scheduleType: [{ value: classSession.scheduleType, disabled: (!this.isCreateMode()) }, [Validators.required]],
            scheduleEndDate: [{ value: classSession.scheduleEndDate, disabled: (!this.isCreateMode()) }],
            pricePerPerson: [classSession.pricePerPerson, [Validators.required, Validators.min(10)]],
        }
    }

    // Gets tutor, then features, then populates form
    setupClassSessionForm(classSession: ClassSession): void {
        this.tutorsService.getMy()
            .subscribe(tutorSuccess => {
                this.tutor = tutorSuccess;
                this.setupFeaturesAndPopulateForm(classSession);
                // this.populateForm(classSession);
                this.incrementLoad();
            }, error => {
            });
    };

    // Needs tutorId before it can be called
    setupFeaturesAndPopulateForm(classSession: ClassSession): void {
        this.getClassSessionFeaturesByTutorId
            .subscribe(
                features => {
                    this.populateForm(classSession);
                    this.removePrivateLessonType();
                },
                error => { });
    }

    getClassSizeEntry(): number {
        const formControls = this.classSessionFormControls;

        return (!isNaN(formControls.maxPersons.value) ?
            formControls.maxPersons.value :
            (!isNaN(this.classSession.maxPersons)) ?
                this.classSession.maxPersons : -1);
    }

    //maxPersonsChanged(): void {
    //    console.log(`Max persons changed...`);
    //    const classSizeEntry = this.getClassSizeEntry();
    //    if (classSizeEntry > 0)
    //        this.setupCommissionFigureByStudentCount(classSizeEntry);
    //}

    setupCommissionFigureByStudentCount(studentCount: number): void {
        // If still using this component, calculate commission using tiered values.
        // const commissionToSet = this.classSessionFeatures.admin_CommissionPerStudent[studentCount - 1];
        //console.log(`Setting student commission for studentCount...${studentCount}  commission:   ${commissionToSet}`);
        this.baseClassSessionCommision = 0; // commissionToSet;
    }

    getBaseCommissionByContext(): number {
        let calculating = false;

        if (calculating == false) {
            calculating = true;
            const classSizeEntry = this.getClassSizeEntry();
            if (classSizeEntry > 0)
                this.setupCommissionFigureByStudentCount(classSizeEntry);

            calculating = false;
        }
        return this.baseClassSessionCommision;
    }

    privateLessonCountLimit(): number {
        const privateLessonCount = this.isCreateMode()
            ? this.classSessionFeatures.tutorDashboard_CreateCourse_PrivateLessonCount
            : this.classSessionFeatures.tutorDashboard_EditCourse_PrivateLessonCount;
        //console.log("Private lesson allowed..:", privateLessonAllowed);
        return privateLessonCount;
    }

    removePrivateLessonType(): void {
        // if (this.isPrivateLessonAllowed()) return;

        const currentTypes = this.types.concat([]);
        const privateLessonOptionIndex = this.findPrivateTypeIndex(currentTypes);
        if (privateLessonOptionIndex < 0) return;

        //console.log(`Removing private lesson option from :${currentTypes} at index : ${privateLessonOptionIndex}`);
        currentTypes.splice(privateLessonOptionIndex, 1);
        this.types = currentTypes;
    }

    findPrivateTypeIndex(currentTypes): number {
        return currentTypes.findIndex(x => x.name.toLocaleUpperCase() === "PRIVATE");
    }

    save(): void {
        this.classSessionFormSubmitted = true;
        if (this.classSessionForm.valid) {
            $('.loading').show();
            if (!this.isCreateMode()) {
                this.classSessionsService.update(this.classSessionId, this.classSessionForm.getRawValue())
                    .subscribe(success => {
                        window.location.href = '/Tutor/ClassSessions/SetupMaterial/' + success.classSessionId;
                    }, error => {
                        if (error.code == 400) {
                            this.toastr.error(error.error);
                            $('.loading').hide();
                        } else {
                            this.toastr.error('Sorry we were unable to update your lesson');
                            $('.loading').hide();
                        }
                    });
            } else {
                this.classSessionsService.create(this.classSessionForm.getRawValue())
                    .subscribe(success => {
                        window.location.href = '/Tutor/ClassSessions/SetupMaterial/' + success.classSessionId;
                    }, error => {
                        if (error.code == 400) {
                            this.toastr.error(error.error);
                            $('.loading').hide();
                        } else {
                            this.toastr.error('Sorry we were unable to create your lesson');
                            $('.loading').hide();
                        }
                    });
            }
        }
    };

    getSubjectCategorys() {
        if (this.classSessionForm.get('subjectId').valid) {
            $('.loading').show();
            this.subjectCategoriesService.getOptionsFiltered(this.classSessionForm.get('subjectId').value)
                .subscribe(success => {
                    this.subjectCategorys = success;
                    $('.loading').hide();
                }, error => {
                });
        }
    };

    checkSheduleOver(): boolean {
        var date = new Date();
        date.setDate(date.getDate() + 60);
        if (this.classSessionForm != undefined && this.classSessionForm.value.scheduleEndDate != null && this.classSessionForm.value.scheduleEndDate != undefined) {
            if (this.classSessionForm.value.scheduleEndDate > date) {
                return true;
            }
        }

        return false;
    }
}
