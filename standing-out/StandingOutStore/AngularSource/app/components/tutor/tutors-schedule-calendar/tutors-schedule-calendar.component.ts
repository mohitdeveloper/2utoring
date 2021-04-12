import { Component, Inject, ViewEncapsulation, ViewChild, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyService, TutorsService, UsersService } from '../../../services';
import { CalenderSchedulerComponent } from '../../calender-scheduler/calender-scheduler.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-tutor-schedule-calendar',
    templateUrl: 'tutors-schedule-calendar.component.html',
    styleUrls: ['./tutors-schedule-calendar.component.css'],
})
export class TutorScheduleCalendarComponent {
    public type: string = '';
    selectedTutorsData: any = [];
    isBookedSlotVisible: boolean = true;
    fromSettingPage: boolean = true;
    editSlot: boolean = false;
    @ViewChild('calendarRef', { static: false }) calendarRef: CalenderSchedulerComponent;
    constructor(private tutorsService: TutorsService, private companyService: CompanyService, private toastr: ToastrService, private usersService: UsersService) { }
    alertMessage: any = null;
    screenSize: number;
    scrHeight: any;
    scrWidth: any;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.fc-today-button').addClass('col-12');
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        } else {
            $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }


        if (this.screenSize >= 1300) {
            $('.mfs').css('display', 'none');
            // $('.fc-today-button').addClass('col-12');
            $('#myOtherLessonView').css('display', 'block');
        } else {
            // $('.fc-today-button').removeClass('col-12');
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
    }

    getScreenSize(event?) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);

        if (this.scrWidth <= 1025) {
            setTimeout(() => {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 300)
        } else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }

        if (this.scrWidth >= 1350) {
            setTimeout(() => {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300)
        }

        if (this.scrWidth <= 768) {
            setTimeout(() => {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300)

        } else {
            setTimeout(() => {
                $('.fc-today-button').removeClass('col-12');
            }, 300)
        }

    }


    ngOnInit() {
        this.getScreenSize();
        this.getTutorAvailability()
        this.getUserAlertMessage();
    }

    getTutorAvailability() {
        $('.loading').show();
        this.companyService.getTutorAvailabilities(null)
            .subscribe(success => {
                if (success != null) {
                    this.selectedTutorsData = success;
                    $('.loading').hide();
                }
            }, error => {
            });
    }

    saveAvailability() {
        $('.loading').show();
        let obj = this.calendarRef.addedEvents;
        if (this.calendarRef.deletedEvents.length > 0) {
            Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
        }

        this.tutorsService.saveAvailability(obj).subscribe(success => {
            $('.loading').hide();
            this.toastr.success('Availability saved successfully!');
            
        }, error => {
            $('.loading').hide();
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