import {Component, OnInit} from '@angular/core';
import {UtilService} from './service/util.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor(
        private utilService: UtilService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        if(this.utilService.getItem(this.utilService.USER_LOGIN)=='1'){
            // this.router.navigateByUrl("/dashboard")
        }else{
            this.router.navigateByUrl("/login")
        }
    }


}
