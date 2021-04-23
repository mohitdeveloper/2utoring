import { Component, OnInit, Input, Output } from '@angular/core';
import { PagedList, SubjectStudyLevelSetup, SubjectStudyLevelSearchModel, SubjectStudyLevelSetupType } from '../../../models/index';
import { SubjectStudyLevelSetupService, UsersService, StripeCountrysService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { SubjectStudylevelCreateDialogComponent } from '../subject-studylevel-create-dialog/subject-studylevel-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { subjectStudyLevelDeleteDialog } from '../subject-studylevel-delete-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { SubjectStudylevelInfoDialogComponent } from '../subject-studylevel-info-dialog/subject-studylevel-info-dialog.component';

declare var title: string;
declare var stripeCountry: any;
@Component({
    selector: 'app-subject-studylevel-setup-index',
    templateUrl: './subject-studylevel-setup-index.component.html',
    styleUrls: ['./subject-studylevel-setup-index.component.css'],
})

// TODO - Continue here 25 Aug 2020...
export class SubjectStudyLevelSetupIndexComponent implements OnInit {

    tutorId: string = null;
    colMdLg: number = 6;

    @Input() ownerEntityId: string;
    @Input() ownerEntityType: string;
    @Input() ownerRegisterTitle: boolean;
    @Input() isFilterVisible: number = 1;
    @Input() isRegistrationDone: boolean;
    
    constructor(private subjectStudyLevelSetupService: SubjectStudyLevelSetupService, public dialog: MatDialog, private toastr: ToastrService, private usersService: UsersService, private stripeCountrysService:StripeCountrysService ) {

        //if (this.tutorId == null) {
        //    this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || this.tutorId;
        //    this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || 'Tutor';
        //    this.searchModel.subjectStudyLevelSetupType =
        //        (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
        //            SubjectStudyLevelSetupType.Tutor : SubjectStudyLevelSetupType.Company;
        //    this.searchModel.owningEntityId = this.owningEntityId;
        //}
    }
    stripeCountry: any = stripeCountry;
    title: string = title;
    alertMessage: any = null;
    takeValues: any[] = [
        { take: 10, name: 'Show 10' },
        { take: 25, name: 'Show 25' },
        { take: 50, name: 'Show 50' },
        { take: 100, name: 'Show 100' }
    ];

    owningEntityId: string;
    setupTypeAttrib: string;
    userType: string;

    searchModel: SubjectStudyLevelSearchModel = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'Subject.Name',
        order: 'ASC',
        filter: '',
        owningEntityId: '',
        subjectStudyLevelSetupType: SubjectStudyLevelSetupType.Company,
        subjectNameSearch: '',
        studyLevelSearch: '',
    };

    results: PagedList<SubjectStudyLevelSetup> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getSubjectStudyLevelSetupData();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getSubjectStudyLevelSetupData();
    };

    next(): void {
        this.searchModel.page++;
        this.getSubjectStudyLevelSetupData();
    };

    previous(): void {
        this.searchModel.page--;
        this.getSubjectStudyLevelSetupData();
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

    getSubjectStudyLevelSetupData(): void {
        $('.loading').show();

        this.subjectStudyLevelSetupService.getPaged(this.searchModel)
            .subscribe(success => {
                this.results = success;
                let innerWidth = window.innerWidth;
                if (innerWidth > 967) {
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
                }

                $('.loading').hide();
            }, error => {
                console.log(error);
            });
    };

    ngOnInit() {
        debugger;
        this.getUserAlertMessage();

        this.subjectStudyLevelSetupService.getUserType()
            .subscribe(success => {
                this.userType = success;
            }, error => {
            });



        if (this.ownerEntityId ||this.ownerEntityType ) {
            if (this.ownerRegisterTitle) {
                this.colMdLg = 4;
                this.title = 'Price Setup';
            }
            this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || this.ownerEntityId;
            this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || this.ownerEntityType;
            this.searchModel.subjectStudyLevelSetupType =
                (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
                    SubjectStudyLevelSetupType.Tutor : SubjectStudyLevelSetupType.Company;
            this.searchModel.owningEntityId = this.owningEntityId;
        } else {
            this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || null;
            this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || null;
            debugger;
            this.searchModel.subjectStudyLevelSetupType =
                (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ?
                    SubjectStudyLevelSetupType.Tutor : SubjectStudyLevelSetupType.Company;
            this.searchModel.owningEntityId = this.owningEntityId;
        }


        this.getSubjectStudyLevelSetupData();

        if (this.stripeCountry.currencySymbol==null) {
            this.stripeCountrysService.getMyStripeCountry()
                .subscribe(success => {
                    debugger;
                    this.stripeCountry = success;
                }, error => {
                });
        }

    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    //to open popup window add subject price
    addPriceForSubjects() {
        const dialogRef = this.dialog.open(SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: 'myClass',
            autoFocus:false,
            data: {
                'id': ''
            }
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                this.getSubjectStudyLevelSetupData();
            }
        });
    }

    //to open popup window update subject price
    updateSubjectPrice(subjectPriceId, allowEdit) {
        debugger;
        const dialogRef = this.dialog.open(SubjectStudylevelCreateDialogComponent, {
            //maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            //panelClass: 'my-dialog',
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: 'myClass',
            autoFocus: false,
            data: {
                'id': subjectPriceId ? subjectPriceId : '',
                'allowEdit': allowEdit,
                'userType': this.userType
                }
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                this.getSubjectStudyLevelSetupData();
            }
        });
    }

    //delete subject price 
    deleteSubjectPrice(subjectPriceId) {
        const dialogRef = this.dialog.open(subjectStudyLevelDeleteDialog, {
            data: {
                'id': subjectPriceId ? subjectPriceId : ''
            }
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                $('.loading').show();
                this.subjectStudyLevelSetupService.delete(subjectPriceId)
                    .subscribe(success => {
                        $('.loading').hide();
                        this.getSubjectStudyLevelSetupData();
                        this.toastr.success('Price delete successfully!');
                    }, error => {
                    });
            } else {
                this.getSubjectStudyLevelSetupData();
            }
        });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
                this.isRegistrationDone = success.initialRegistrationComplete;
            }, error => {
            });
    }

    showSubjectStudyLevelInfoBox() {
        //to open popup window add subject price
            const dialogRef = this.dialog.open(SubjectStudylevelInfoDialogComponent, {
                maxWidth: '60vw',
                panelClass: 'myClass',
                autoFocus: false,
                data: {
                    'userType': this.userType,
                    'isFilterVisible': this.isFilterVisible,
                }
            });

            dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
                if (showSnackBar) {
                    this.getSubjectStudyLevelSetupData();
                }
            });
    }

}
