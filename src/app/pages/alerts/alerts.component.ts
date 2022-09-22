import {Component, OnInit} from '@angular/core';
import {UtilService} from '../../service/util.service';
import {ApiService} from '../../service/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupalertComponent} from 'app/modals/popupalert/popupalert.component';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

    allAlerts = []
    declinedAlerts = []

    allTab = true;
    declinedTab = false;

    READ_NOTIFICATION_CSS = 'readNotification';
    UNREAD_NOTIFICATION_CSS = 'unreadNotification';

    alerts = [];

    constructor(
        public utilService: UtilService,
        private apiService: ApiService,
        private modalService: NgbModal,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.getNotifications();
    }

    getNotifications() {
        this.alerts = [];
        this.apiService.postAPI(this.apiService.BASE_URL + "notification/getAstroNotifications", {
            astro_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                // chatRequest.request=result.result;
                this.alerts = result.result;
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
            this.toaster.error("something went wrong")
        })
    }


    openAlert() {
        const modalRef = this.modalService.open(PopupalertComponent, {
            backdrop: 'static',
            size: 'sm',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
            console.log('dismissed:-' + JSON.stringify(result));
        })
    }
}
