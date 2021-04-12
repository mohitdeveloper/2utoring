import { Component, OnInit } from '@angular/core';
import { CompanyService, CompanySubjectsService,UsersService } from '../../../services';
import { Company } from '../../../models';
import * as $ from 'jquery';

declare var companyId: any;
@Component({
    selector: 'app-company-dashboard',
    templateUrl: './company-dashboard.component.html',
    styleUrls: ['./company-dashboard.component.css']
})
export class CompanyDashboardComponent implements OnInit {
    companyId: string = companyId;
    //company: Company = {};
    company: Company;
    subjects: string[] = [];
    currentUrl: string = window.location.href;

    gaugeType = "full";
    gaugeLabel = "";
    gaugeAppendText = "";
    gaugeSize = 50;
    gaugeColor = "#d2fbd5";
    thick = 6;

    coursesThisMonth:string;
    lessonThisMonth:string;
    revenueThisMonth:string;
    revenuePercentage:string;
    mostPopularSubject:string;
    mostPopularLevel:string;
    openSafeGaurdIsses:string;
    lessonsToday:string;
    numberOfStudentsToday:string;
    revenueToday:string;
    revenuePercentageToday:string;
    closedSafeGaurdIsses:string;
    mostPopularSubjectText:string;
    companyDescription:string;
    companyName:string;
    alertMessage: any = null;
    
    constructor(private companyService: CompanyService, private companySubjectsService: CompanySubjectsService, private usersService: UsersService) {    }

    ngOnInit(): void {
        $('.loading').show();
        this.companyService.getById(this.companyId)
            .subscribe(success => {
                this.company = success;
            }, error => {
            });

        this.getUserAlertMessage();

        this.companySubjectsService.getByCompanyForProfile(this.companyId)
            .subscribe(success => {
                this.subjects = success; 
            }, error => {
            });


                this.companyName = "Wizcraft";
                this.companyDescription = "I am in that company";
                this.coursesThisMonth = "25";
                this.lessonThisMonth = "35";
                this.revenueThisMonth= "£10,242";
                this.revenuePercentage = "21.6%";
                this.mostPopularSubject ="45";
                this.mostPopularSubjectText = "English";
                this.mostPopularLevel = "GCSE";
                this.openSafeGaurdIsses = "15";
                this.closedSafeGaurdIsses = "50";
                this.lessonsToday = "15"; 
                this.numberOfStudentsToday = "25";
                this.revenueToday = "£342";
                this.revenuePercentageToday = "20.6%";
        $('.loading').hide();

        

         //this.companyService.getCompnayBasiscDetails()
         //    .subscribe(success => {
         //        debugger;
         //        this.companyName = success.companyName;
         //        this.companyDescription = success.companyDescription;
         //        this.coursesThisMonth = success.coursesThisMonth;
         //        this.lessonThisMonth = success.lessonThisMonth;
         //        this.revenueThisMonth= success.revenueThisMonth;
         //        this.revenuePercentage = success.revenuePercentage;
         //        this.mostPopularSubject = success.mostPopularSubject;
         //        this.mostPopularSubjectText = success.mostPopularSubjectText;
         //        this.mostPopularLevel = success.mostPopularLevel;
         //        this.openSafeGaurdIsses = success.openSafeGaurdIsses;
         //        this.closedSafeGaurdIsses = success.closedSafeGaurdIsses;
         //        this.lessonsToday = success.lessonsToday;
         //        this.numberOfStudentsToday = success.numberOfStudentsToday;
         //        this.revenueToday = success.revenueToday;
         //        this.revenuePercentageToday = success.revenuePercentageToday;
         //        $('.loading').hide();
         //    }, error => {
         //        debugger;
         //    });
    }

    getUserAlertMessage() {
        this.usersService.userAlert()
            .subscribe(success => {
                this.alertMessage = success;
            }, error => {
            });
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
}
