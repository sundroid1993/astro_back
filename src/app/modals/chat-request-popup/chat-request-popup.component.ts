import {Component, Input, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UtilService} from "../../service/util.service";
import {ApiService} from "../../service/api.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {Events, EventService} from "../../service/event.service";

@Component({
    selector: 'app-chat-request-popup',
    templateUrl: './chat-request-popup.component.html',
    styleUrls: ['./chat-request-popup.component.scss']
})
export class ChatRequestPopupComponent implements OnInit {

    @Input() chatRequest;
    userDetail;

    timeLeft: number = 120000;
    interval;
    eventServiceSubscription;

    constructor(
        private ngFirestore: AngularFirestore,
        public utilService: UtilService,
        public apiService: ApiService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private toaster: ToastrService,
        private datePipe: DatePipe,
        private eventService: EventService
    ) {
    }

    ngOnInit(): void {
        if (this.utilService.checkValue(this.chatRequest)) {
            this.getUserDetail();
        }
        this.setTimer();
        this.eventServiceSubscription = this.eventService.on(Events.CANCEL_REQUEST, (data => {
            console.log("chat event terminated")
            console.log(data)
            if (this.utilService.checkValue(data)) {
                if (data.request_id == this.chatRequest.request_id) {
                    this.toaster.error("Chat canceled by client");
                    this.activeModal.close();
                }
            }
        }));
    }

    ngOnDestroy() {
        if (this.utilService.checkValue(this.eventServiceSubscription)) {
            this.eventServiceSubscription.unsubscribe();
        }
    }

    setTimer() {
        this.timeLeft = 120000;
        this.interval = setInterval(() => {
            // console.log('timeleft:-' + this.timeLeft);
            if (this.timeLeft > 0) {
                this.timeLeft = this.timeLeft - 1000;
            } else {
                this.clearTimer();
                this.requestAction(3);
            }
        }, 1000);
    }

    clearTimer() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    getUserDetail() {
        this.apiService.postAPI(this.apiService.BASE_URL + "user/getUserDetailById", {
            id: this.chatRequest.user_id
        }).then((result) => {
            if (result.status) {
                this.userDetail = result.result;
                localStorage.setItem('userDetail', JSON.stringify((this.userDetail)));
            }
        }, (error) => {
            console.log(error);
        })
    }

    close() {
        this.activeModal.close();
    }

    requestAction(action) {
        this.activeModal.close({
            action: action
        });
    }

    // getPreviousMsgs() {
    //   let url = this.apiService.BASE_URL + "chat/getPreviousMsgs"
    //   this.apiService.postAPI(url, {
    //     user_id: this.user_id,
    //     astro_id: this.astro_id
    //   }).then((result) => {
    //     if (result.status) {
    //       // this.messagesToShow = result.result;
    //       // this.initVoiceSDK()
    //       for (let msg of result.result) {
    //         this.messagesToShow.push({
    //           date: msg.created_at,
    //           message: msg.msg,
    //           sender: msg.sender,
    //           type: msg.type
    //         })
    //       }
    //       this.scrollBottom()
    //     } else {
    //       this.toaster.error(result.message)
    //     }
    //   }, (error) => {
    //     console.log(error);
    //   })
    // }

}
