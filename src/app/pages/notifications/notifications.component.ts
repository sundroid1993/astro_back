import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../service/util.service';
import { ApiService } from '../../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'notifications.component.html',
    styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

    unreadNotifications = []
    readNotifications = []

    readTab = false;
    unreadTab = true;

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

    openNotifications() {
        
    }


}
