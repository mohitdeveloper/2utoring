import { Component, OnInit } from '@angular/core';
import { ReceiptIndex, StripeTableSearch, StripePagedList } from '../../../models/index';
import { StripeService, SessionAttendeesService } from '../../../services/index';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesAlertModal } from '../../utilities/utilities-alert-modal/utilities-alert-modal';

declare var title: any;

@Component({
    selector: 'app-receipts-index',
    templateUrl: './receipts-index.component.html'
})

export class ReceiptsIndexComponent implements OnInit {
    constructor(private stripeService: StripeService, private sessionAttendeesService: SessionAttendeesService,
        private toastr: ToastrService, private modalService: NgbModal) { }

    title: string = title;
    receiptResults: StripePagedList<ReceiptIndex> = { paged: null, data: null };
    timeOffsetMins: number;

    searchModel: StripeTableSearch = {
        take: 10,
        page: 1,
        startingAfterId: null,
        endingBeforeId: null
    };

    reloadData(): void {
        this.searchModel.page = 1;
        this.getReceipts();
    };

    next(): void {
        this.searchModel.startingAfterId = this.receiptResults.data[this.receiptResults.data.length - 1].id;
        this.searchModel.endingBeforeId = null;
        this.getReceipts();
    };

    previous(): void {
        this.searchModel.startingAfterId = null;
        this.searchModel.endingBeforeId = this.receiptResults.data[0].id;
        this.getReceipts();
    };

    getReceipts(): void {
        this.stripeService.getPagedReceipts(this.searchModel)
            .subscribe(success => {
                this.receiptResults = success;
                this.searchModel.page = this.receiptResults.paged.page;
            }, error => {
                console.log(error);
            });
    };

    friendlyStatus(item: ReceiptIndex): string {
        return item.status == "succeeded" ? ((item.amountRefunded && item.amountRefunded > 0)  ? "Refunded" : "Success") : "Failed";
    };

    toSearch(): void {
        window.location.href = '/find-a-lesson';
    };

    isRefundable(item: ReceiptIndex): Boolean {
        return (!item.refunded && this.diffInHours(item) >= 24);
    }

    diffInHours(item: ReceiptIndex, otherDate: Date = new Date()): Number {
        const date1 = otherDate;
        const date2 = new Date(item.lessonStartDate);

        const milliSeconds = date2.getTime() - date1.getTime();
        const hrsDiff = (milliSeconds / (1000 * 60 * 60)) + (this.timeOffsetMins/60);
        return hrsDiff;
    }

    initiateRefund(receiptIndex: ReceiptIndex): void {
        const modalRef = this.modalService.open(UtilitiesAlertModal, { size: 'lg' });

        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Cancel lesson and get refund';
        modalRef.componentInstance.message = 'Are you sure you want to cancel your lesson and get a refund?';
        modalRef.componentInstance.htmlMessage =
            `<strong>NOTE:</strong> A cancellation fee of <b>£1.00</b> will be charged to cover system, payment processing and administrative
            costs.`;
        modalRef.componentInstance.noButtonText = 'No, Keep lesson';
        modalRef.componentInstance.yesButtonText = 'Proceed to cancel';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";

        //handle the response 
        modalRef.result.then((result) => {
            if (result == true) {
                this.processRefund(receiptIndex);
            }
        }, (reason) => {
            console.log('dismissed - closed no action');
        });
    };

    processRefund(receiptIndex: ReceiptIndex) {
        $('.loading').show();

        this.sessionAttendeesService.refundStudent(receiptIndex.classSessionId, receiptIndex.sessionAttendeeId)
            .subscribe(
                success => {
                    if (success) {
                        this.ngOnInit();
                        this.toastr.success('Lesson cancelled and refunded successfully');
                    }
                    else { this.toastr.error('Unable to cancel at this time, please try again'); }
                }, err => {
                    this.toastr.error('Unable to cancel at this time, please try again');
            },
                () => { $('.loading').hide(); }
            );
    }

    ngOnInit() {
        this.timeOffsetMins = -1 * (new Date()).getTimezoneOffset(); // Gets the adustment in minutes required for the search i.e +01:00 -> -60
        this.getReceipts();
    };
}
