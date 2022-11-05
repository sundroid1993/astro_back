import {Component, OnInit} from '@angular/core';
import {UtilService} from '../service/util.service';
import {ApiService} from '../service/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-pop-users',
    templateUrl: './pop-users.component.html',
    styleUrls: ['./pop-users.component.css']
})
export class PopUsersComponent implements OnInit {

    users = []

    constructor(
        public utilService: UtilService,
        private apiService: ApiService,
        private modalService: NgbModal,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.apiService.getAPI(this.apiService.BASE_URL + 'common/getPopUsers').then((result) => {
          if(result.status){
            this.users=result.result;
          }else{
            this.toaster.error("No users");
          }
        }, (error) => {
          this.toaster.error(error.message);
        })
    }

}
