import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../service/util.service';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupalertComponent } from 'app/modals/popupalert/popupalert.component';

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

    constructor(
        public utilService: UtilService,
        private apiService: ApiService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
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
