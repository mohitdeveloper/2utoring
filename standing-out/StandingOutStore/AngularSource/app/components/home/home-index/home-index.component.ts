import { Component } from '@angular/core';

@Component({
    selector: 'app-home-index',
    templateUrl: './home-index.component.html'
})

export class HomeIndexComponent {
    constructor() {
        //$('.loading').show();
    }

    ngAfterViewInit() {
       
    }

    loadimage() {
        //setTimeout(() => {
        //    $('.loading').hide();
        //}, 1000)
        
    }
}
