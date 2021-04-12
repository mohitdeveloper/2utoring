"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsIndexComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../../services/index");
var $ = require("jquery");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_toastr_1 = require("ngx-toastr");
var utilities_alert_modal_1 = require("../../utilities/utilities-alert-modal/utilities-alert-modal");
var ReceiptsIndexComponent = /** @class */ (function () {
    function ReceiptsIndexComponent(stripeService, sessionAttendeesService, toastr, modalService) {
        this.stripeService = stripeService;
        this.sessionAttendeesService = sessionAttendeesService;
        this.toastr = toastr;
        this.modalService = modalService;
        this.title = title;
        this.receiptResults = { paged: null, data: null };
        this.searchModel = {
            take: 10,
            page: 1,
            startingAfterId: null,
            endingBeforeId: null
        };
    }
    ReceiptsIndexComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.getReceipts();
    };
    ;
    ReceiptsIndexComponent.prototype.next = function () {
        this.searchModel.startingAfterId = this.receiptResults.data[this.receiptResults.data.length - 1].id;
        this.searchModel.endingBeforeId = null;
        this.getReceipts();
    };
    ;
    ReceiptsIndexComponent.prototype.previous = function () {
        this.searchModel.startingAfterId = null;
        this.searchModel.endingBeforeId = this.receiptResults.data[0].id;
        this.getReceipts();
    };
    ;
    ReceiptsIndexComponent.prototype.getReceipts = function () {
        var _this = this;
        this.stripeService.getPagedReceipts(this.searchModel)
            .subscribe(function (success) {
            _this.receiptResults = success;
            _this.searchModel.page = _this.receiptResults.paged.page;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    ReceiptsIndexComponent.prototype.friendlyStatus = function (item) {
        return item.status == "succeeded" ? ((item.amountRefunded && item.amountRefunded > 0) ? "Refunded" : "Success") : "Failed";
    };
    ;
    ReceiptsIndexComponent.prototype.toSearch = function () {
        window.location.href = '/find-a-lesson';
    };
    ;
    ReceiptsIndexComponent.prototype.isRefundable = function (item) {
        return (!item.refunded && this.diffInHours(item) >= 24);
    };
    ReceiptsIndexComponent.prototype.diffInHours = function (item, otherDate) {
        if (otherDate === void 0) { otherDate = new Date(); }
        var date1 = otherDate;
        var date2 = new Date(item.lessonStartDate);
        var milliSeconds = date2.getTime() - date1.getTime();
        var hrsDiff = (milliSeconds / (1000 * 60 * 60)) + (this.timeOffsetMins / 60);
        return hrsDiff;
    };
    ReceiptsIndexComponent.prototype.initiateRefund = function (receiptIndex) {
        var _this = this;
        var modalRef = this.modalService.open(utilities_alert_modal_1.UtilitiesAlertModal, { size: 'lg' });
        //set any variables
        modalRef.componentInstance.confirmButtons = true;
        modalRef.componentInstance.title = 'Cancel lesson and get refund';
        modalRef.componentInstance.message = 'Are you sure you want to cancel your lesson and get a refund?';
        modalRef.componentInstance.htmlMessage =
            "<strong>NOTE:</strong> A cancellation fee of <b>\u00A31.00</b> will be charged to cover system, payment processing and administrative\n            costs.";
        modalRef.componentInstance.noButtonText = 'No, Keep lesson';
        modalRef.componentInstance.yesButtonText = 'Proceed to cancel';
        modalRef.componentInstance.yesButtonClass = "btn btn-primary mr-7";
        modalRef.componentInstance.noButtonClass = "btn btn-danger mr-7";
        //handle the response 
        modalRef.result.then(function (result) {
            if (result == true) {
                _this.processRefund(receiptIndex);
            }
        }, function (reason) {
            console.log('dismissed - closed no action');
        });
    };
    ;
    ReceiptsIndexComponent.prototype.processRefund = function (receiptIndex) {
        var _this = this;
        $('.loading').show();
        this.sessionAttendeesService.refundStudent(receiptIndex.classSessionId, receiptIndex.sessionAttendeeId)
            .subscribe(function (success) {
            if (success) {
                _this.ngOnInit();
                _this.toastr.success('Lesson cancelled and refunded successfully');
            }
            else {
                _this.toastr.error('Unable to cancel at this time, please try again');
            }
        }, function (err) {
            _this.toastr.error('Unable to cancel at this time, please try again');
        }, function () { $('.loading').hide(); });
    };
    ReceiptsIndexComponent.prototype.ngOnInit = function () {
        this.timeOffsetMins = -1 * (new Date()).getTimezoneOffset(); // Gets the adustment in minutes required for the search i.e +01:00 -> -60
        this.getReceipts();
    };
    ;
    ReceiptsIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-receipts-index',
            templateUrl: './receipts-index.component.html'
        }),
        __metadata("design:paramtypes", [index_1.StripeService, index_1.SessionAttendeesService,
            ngx_toastr_1.ToastrService, ng_bootstrap_1.NgbModal])
    ], ReceiptsIndexComponent);
    return ReceiptsIndexComponent;
}());
exports.ReceiptsIndexComponent = ReceiptsIndexComponent;
//# sourceMappingURL=receipts-index.component.js.map