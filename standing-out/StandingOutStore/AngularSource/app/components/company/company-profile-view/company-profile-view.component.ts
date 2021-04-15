import { Component, OnInit, Input } from '@angular/core';
import { CompanyService, CompanySubjectsService, CoursesService, UsersService, subjectImages } from '../../../services';
import { Company, CompanySubject, TeamMeetData } from '../../../models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../company-register/company-register/confirmation-dialog.component'
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var isAuthenticated: any;
/*declare var stripeCountry: any;*/
@Component({
    selector: 'app-company-profile-view',
    templateUrl: './company-profile-view.component.html',
    styleUrls: ['./company-profile-view.component.scss']
})
export class CompanyProfileViewComponent implements OnInit {

    @Input() companyId: string;
    @Input() showEditButton: boolean;
    isAuthenticated = isAuthenticated;
    /*stripeCountry: any = stripeCountry;*/
    hasDbsApproved: boolean = false;
    loaded: number = 0;
    toLoad: number = 2;
    userType: any;
    //company: Company;
    company: any;
    subjects: string[] = [];
    getUrl = window.location;
    url: string = this.getUrl.protocol + "//" + this.getUrl.host;
    teamMemberData: TeamMeetData[] = [];
    profileTabActive = 'tab1';
    companyCourses = [];
    tutorObj = {}; 
    dataLimit: number = 10;
    currentLimit: number = this.dataLimit;
    
    contactAgency: FormGroup;
    contactAgencyFormSubmitted: boolean = false;
    get contactAgencyFormCompanyControls() { return this.contactAgency.controls };
    alertMessage: any = null;
    subjectsImages = subjectImages;
    constructor(private companysService: CompanyService,
        private companySubjectsService: CompanySubjectsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private coursesService: CoursesService,
        private usersService: UsersService
    ) {}

    incrementLoad() {
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    ngOnInit(): void {
        $('.loading').show();
        //this.getUserType();
        this.getUserAlertMessage();

        this.contactAgency = this.fb.group({
            email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            receiverEmail: [''],
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            lastName: ['', [Validators.required, Validators.maxLength(20)]],
            message: ['', [Validators.required, Validators.maxLength(500)]],
        });

        this.companysService.getCompanyDataById(this.companyId)
            .subscribe(success => {
                this.company = success;
                this.getTutorsDetails();
                this.companyCourses = this.company.courses
                $('.loading').hide();
            }, error => {
            });

        //this.companysService.getTeamData()
        //    .subscribe(success => {
        //        if (success != null) {
        //            this.teamMemberData = success;
        //        }
        //    }, error => {
        //        // debugger;
        //    });
    }
    //delete team data
    openDialog(mbrId, index) {
        const dialogRef = this.dialog.open(ConfirmationDialog, {
            data: {
                message: 'Are you sure want to delete?',
                buttonText: {
                    ok: 'Yes',
                    cancel: 'No'
                }
            }
        });
        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                //debugger;
                //this.meetData.splice(index, 1);
                // delete query will gone here
                this.companysService.deleteCompanyMember(mbrId)
                    .subscribe(success => {
                        this.teamMemberData.splice(index, 1); // Splice after delete is success
                        this.toastr.success('Member removed!');
                        //console.log(success);
                    }, error => {
                    });
            }
        });
    }

    sendMessageForAgency() {
        this.contactAgencyFormSubmitted = true;
        if (this.contactAgency.valid) {
            $('.loading').show();
            var sendMessageInfo = { ...this.contactAgency.getRawValue() };
            //this.contactAgency.controls["receiverEmail"].setValue(this.company.emailAddress);
            this.contactAgency.patchValue({ 'receiverEmail': this.company.emailAddress});
            this.companysService.sendMessageToAgency(sendMessageInfo)
                .subscribe(success => {
                    if (success) {
                        $('.loading').hide();
                        this.toastr.success('Mail sent sucessfully!');
                        window.location.reload();
                    } else {
                        $('.loading').hide();
                        this.toastr.error('Something went wrong');
                    }
                }, error => {
                    $('.loading').hide();
                    this.toastr.error('Something went wrong');
                });
        }
    }

    getTutorsDetails() {
        for (let i = 0; i < this.company.tutors.length; i++) {
            debugger;
            this.tutorObj[this.company.tutors[i].tutorId] = this.company.tutors[i];
            if (this.company.tutors[i].dbsApprovalStatus == 'Approved') {
                this.hasDbsApproved = true;
            }
        }
    }
    showMoreData() {
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    }

    backToSearch(type) {
        if (type == 'search') {
            window.location.href = '/tutor-course-search';
        } else {
            window.location.href = '/company/profile/edit';
        }
    }

    redirectMe(typ, id) {
        debugger;
        if (typ == 'myCourse') {
            localStorage.setItem('tutorId', id);
            localStorage.removeItem('expCourses')
            window.location.href = "/my-course";
        }
        if (typ == 'tutorCourses') {
            window.location.href = "/tutor/" + id;
            localStorage.setItem('expCourses', 'True')
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id)
            localStorage.removeItem('expCourses')
            window.location.href = "/course-details";
        }
        if (typ == 'viewTutor') {
            localStorage.removeItem('expCourses')
            window.location.href = "/tutor/" + id;
        }
    }

    getUserType() {
        //get user type
        this.coursesService.getUserType()
            .subscribe(success => {
                this.userType = success;
                $('.loading').hide();
            }, error => {
            });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }
    goToTutorSearch() {
        this.company.name
        localStorage.setItem("CompanyName", this.company.name)
        window.location.href = "/tutor-search";
    }

    handleDesableBookTutor() {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.alertMessage.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        } else {
            this.toastr.warning("Action not allowed.");
            //alert("CompanyTutor, Tutor, Company");
        }
    }

    markCompanyPorfileApprovedMessageRead(): void {
        $('.loading').show();
        let messageObj = {
            'userType': this.alertMessage.userType,
            'referenceId': this.alertMessage.id,
            'messageColumnName': 'ProfileMessageRead',
            'messageStatus': true
        }

        this.usersService.messageStatusUpdate(messageObj)
            .subscribe(success => {
                $('.loading').hide();
                $('#companyProfileMessageApproved').css('display', 'none');
            }, error => {
            });
    };

    setProfileTabActive(tabName) {
        this.profileTabActive = tabName;
    }
}
