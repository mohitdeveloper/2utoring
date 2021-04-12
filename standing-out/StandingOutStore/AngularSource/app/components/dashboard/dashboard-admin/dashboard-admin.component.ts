import { OnInit, Component } from "@angular/core";
import { TableSearch, ManagementInfoDashboard, PagedList, ClassSessionIndex } from "../../../models";
import { DashboardService } from "../../../services";

declare let title: string;

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html'
})

export class DashboardAdminComponent implements OnInit {
    constructor(private dashboardService: DashboardService) { }

    title: string = title;
    date = new Date();
    startDate = null;
    endDate = null;
    toLoad: number = 2;
    loaded: number = 0;

    incrementLoad(): void{
        this.loaded++;
        if (this.loaded >= this.toLoad) {
            $('.loading').hide();
        }
    };

    dashboardInfo: ManagementInfoDashboard = new ManagementInfoDashboard();
    sessions: PagedList<ClassSessionIndex> = new PagedList<ClassSessionIndex>();

    dashboardSearchModel: TableSearch = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'StartDate',
        order: 'DESC',
        filter: '',
        startDate: this.startDate,
        endDate: this.endDate
    };

    sessionSearchModel: TableSearch = {
        take: 10,
        search: '',
        page: 1,
        totalPages: 1,
        sortType: 'StartDate',
        order: 'DESC',
        filter: '',
        startDate: this.startDate,
        endDate: this.endDate
    };


    search(): void {
        console.log(this.startDate);

        this.dashboardSearchModel.startDate = this.startDate;
        this.dashboardSearchModel.endDate = this.endDate;
        this.sessionSearchModel.startDate = this.startDate;
        this.sessionSearchModel.endDate = this.endDate;

        this.ngOnInit();
    };



    ngOnInit(): void {
        console.log('test');

        this.loaded = 0;
        $('.loading').show();
        this.getDasboard();
        this.getSessions();
    };

    getDasboard(): void {
        this.dashboardService.getManagementInfo(this.dashboardSearchModel).subscribe(success => {
            this.dashboardInfo = success;
            this.incrementLoad();
        }, err => {
        });
    };

    getSessions(): void {
        this.dashboardService.getSessions(this.dashboardSearchModel).subscribe(success => {
            this.sessions = success;
            this.incrementLoad();
        }, err => {
        });
    };

    nextSessions(): void {
        this.sessionSearchModel.page = this.sessionSearchModel.page + 1;
        this.getSessions();
    };

    prevSessions(): void {
        this.sessionSearchModel.page = this.sessionSearchModel.page - 1;
        this.getSessions();
    };

    submitSessionForm(event: any): void {
        event.target.submit();
    };
}