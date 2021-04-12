import { Component, OnInit } from '@angular/core';

declare var companyId: any;
declare var type: any;

@Component({
  selector: 'app-company-profile-wrapper',
  templateUrl: './company-profile-wrapper.component.html',
  styleUrls: ['./company-profile-wrapper.component.css']
})
export class CompanyProfileWrapperComponent implements OnInit {

    companyId: string = companyId;
    type: string = type;

  constructor() { }

  ngOnInit(): void {
  }

}
