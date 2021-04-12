import { Component, OnInit } from '@angular/core';
import { TableSearch, PagedList, PagedTutor, TutorTableSearch } from '../../../models/index';
import { TutorsService, UsersService } from '../../../services/index';
import * as $ from 'jquery';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TutorInviteModalComponent } from '../tutor-invite-modal/tutor-invite-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TutorInfoDialogComponent } from './tutor-info-dialog.component';


declare var title: any;

@Component({
    selector: 'app-tutors-index',
    templateUrl: './tutors-index.component.html'
})

export class TutorsIndexComponent implements OnInit {
    constructor(private modalService: NgbModal, public dialog: MatDialog, private tutorsService: TutorsService, private toastr: ToastrService, private usersService: UsersService) { }
    alertMessage: any = null;
    title: string = title;
    //title: string = 'Tutor Managements';
    takeValues: any[] = [
        { take: 10, name: 'Show 10' },
        { take: 25, name: 'Show 25' },
        { take: 50, name: 'Show 50' },
        { take: 100, name: 'Show 100' }
    ];

    filterOptions: string[] = ['All', 'ApprovalNotRequired', 'Approved', 'Unapproved']

    searchModel: TutorTableSearch = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'User.Name',
        order: 'ASC',
        profileFilter: 'All',
        dbsFilter: 'All',
        filter: '',
    };

    results: PagedList<PagedTutor> = { paged: null, data: null };

    updateSearchModel(type: string): void {
        if (type === 'rows') {
            this.searchModel.page = 1;
        }

        this.getTutors();
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getTutors();
    };

    next(): void {
        this.searchModel.page++;
        this.getTutors();
    };

    previous(): void {
        this.searchModel.page--;
        this.getTutors();
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

    getTutors(): void {
        $('.loading').show();

        this.tutorsService.getPaged(this.searchModel)
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
        this.getTutors();
        this.getUserAlertMessage();
    };

    onType(event): void {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };

    popinviteTutorsModal(): void {
        const modalRef = this.modalService.open(TutorInviteModalComponent, { size: 'lg' });
        modalRef.result.then((result) => {
            if (result && result.length > 3) {
                this.addToInvitesByEmails(result);
            }
        }, (dismissalReason) => {
        });
    }

    addToInvitesByEmails(bulkEmailString: string): void {
        const emailIds = bulkEmailString.split(",").map(x => x.trim()).filter(x => x !== '');
        if (!emailIds || emailIds.length === 0) return;
        this.tutorsService.sendInvitesToTutors(emailIds)
            .subscribe(success => {
                $('.loading').hide();
                this.toastr.success('Invitation sent successfully!');
            }, error => {
                console.log(error);
            });
    };

    
    showInformation(type) {
        const dialogRef = this.dialog.open(TutorInfoDialogComponent, {
            maxWidth: type == 'CRI' ? '75vw' : '65vw',
            //height: type == 'CRI' ? '40vw' : 'auto',
            //maxHeight: type == 'CRI' ? '60vw' : 'auto',
            panelClass: 'custom-modalbox',
            data: { type: type }
        });

        dialogRef.afterClosed().subscribe((showSnackBar: boolean) => {
            if (showSnackBar) {
                
            } else {
                
            }
        });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
    }
}

