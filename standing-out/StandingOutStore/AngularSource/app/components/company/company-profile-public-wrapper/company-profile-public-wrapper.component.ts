import { Component, OnInit } from '@angular/core';

declare var companyId: any;

@Component({
  selector: 'app-company-profile-public-wrapper',
    templateUrl: './company-profile-public-wrapper.component.html'
})
export class CompanyProfilePublicWrapperComponent implements OnInit {

    companyId: string = companyId;

  constructor() { }

  ngOnInit(): void {
  }

}
