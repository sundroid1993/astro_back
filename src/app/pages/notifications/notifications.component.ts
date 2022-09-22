import {Component, OnInit} from '@angular/core';
import {UtilService} from '../../service/util.service';
import {ApiService} from '../../service/api.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from "ngx-toastr";


@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'notifications.component.html',
    styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

    notifications = []
    readNotifications = []

    readTab = false;
    unreadTab = true;

    READ_NOTIFICATION_CSS = 'readNotification';
    UNREAD_NOTIFICATION_CSS = 'unreadNotification';

    constructor(
        public utilService: UtilService,
        private apiService: ApiService,
        private modalService: NgbModal,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.getNotificationByUserId()
    }

    getNotificationByUserId() {
        this.notifications = [];
        // this.apiService.postAPI(this.apiService.BASE_URL + "notification/getAstroNotifications", {
        //     astro_id: this.utilService.getUserID()
        // }).then((result) => {
        //     if (result.status) {
        //         // chatRequest.request=result.result;
        //         this.notifications = result.result;
        //     } else {
        //         this.toaster.error(result.message)
        //     }
        // }, (error) => {
        //     console.log(error);
        //     this.toaster.error("something went wrong")
        // })

        let url = this.apiService.BASE_URL + 'notification/checkUpdateForAstro';
        this.apiService.postAPI(url, {
            astro_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                this.notifications = result.result;
                this.notifications.reverse()
            }
        }, (error) => {
            console.log(error);
        })
    }

    openNotifications() {

    }


}
