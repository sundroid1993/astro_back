import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {AddReportComponent} from 'app/modals/add-report/add-report.component';
import {ChatComponent} from "../../modals/chat/chat.component";
import {ApiService} from "../../service/api.service";
import {UtilService} from "../../service/util.service";

@Component({
    selector: 'app-conductedchatscalls',
    templateUrl: './conductedchatscalls.component.html',
    styleUrls: ['./conductedchatscalls.component.css']
})
export class ConductedchatscallsComponent implements OnInit {

    Chat_tab: boolean = true;
    Call_tab: boolean = false;

    chatHistory = [];
    callHistory = [];

    type = 0;

    constructor(
        private modalService: NgbModal,
        config: NgbRatingConfig,
        public apiService: ApiService,
        public utilService: UtilService
    ) {
        config.max = 5;
        config.readonly = true;
    }

    opentab(value) {
        if (value == 'Chat') {
            this.type = 0;
            this.Chat_tab = true;
            this.Call_tab = false;
            this.getOrderHistory()
        } else if (value == 'Call') {
            this.type = 1;
            this.Chat_tab = false;
            this.Call_tab = true;
            this.getOrderHistory()
        }
    }

    ngOnInit(): void {
       this.opentab('Chat')
    }

    getOrderHistory() {
        let url = this.apiService.BASE_URL + 'astrologer/getAstroOrderHistory';
        this.apiService.postAPI(url, {
            astro_id: this.utilService.getUserID(),
            type: this.type
        }).then((result) => {
            if (result.status) {
                if (this.type == 0) {
                    this.chatHistory = result.result;
                } else {
                    this.callHistory = result.result;
                }
            }
        }, (error) => {
            console.log(error);
        })
    }

    openclient() {
        const modalRef = this.modalService.open(ChatComponent, {
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
            console.log('dismissed:-' + JSON.stringify(result));
        })
    }

}
