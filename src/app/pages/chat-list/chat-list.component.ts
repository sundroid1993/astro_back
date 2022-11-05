import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {AddReportComponent} from "../../modals/add-report/add-report.component";
import {ApiService} from "../../service/api.service";
import {UtilService} from "../../service/util.service";
import {ChatComponent} from "../../modals/chat/chat.component";

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

    chatUsers = [];

    constructor(
        private modalService: NgbModal,
        config: NgbRatingConfig,
        private apiService: ApiService,
        private utilService: UtilService
    ) {
        config.max = 5;
        config.readonly = true;
    }


    ngOnInit(): void {
        this.getChatUsers();
    }

    getChatUsers() {
        this.chatUsers = [];
        let url = this.apiService.BASE_URL + 'chat/getUsersListForAstro';
        this.apiService.postAPI(url, {
            astro_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                this.chatUsers = result.result;
            } else {
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    openChat(chatCollection) {
        const modalRef = this.modalService.open(ChatComponent, {
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
            console.log('dismissed:-' + JSON.stringify(result));
        })
        modalRef.componentInstance.astro_id = this.utilService.getUserID();
        modalRef.componentInstance.user_id = chatCollection.user_id;
        modalRef.componentInstance.collection_id = chatCollection.collection_id;
        modalRef.componentInstance.chatCollection = chatCollection;
    }

}
