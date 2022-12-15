import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UtilService} from "../../service/util.service";
import {ApiService} from "../../service/api.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DatePipe} from "@angular/common";
import {Events, EventService} from "../../service/event.service";
import {UserKundliComponent} from "../../pages/user-kundli/user-kundli.component";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    @ViewChild('target') private myScrollContainer: ElementRef;

    @Input() user_id;
    @Input() astro_id;
    @Input() collection_id = "";
    @Input() chatCollection = null;
    @Input() chat_request_id = null;
    @Input() view_only = false;
    msg = '';
    firestoreSubscription;
    eventServiceSubscription;
    chatRequestUpdatedSubs;
    userDetail;

    messagesToShow: Msg[] = [];
    startedAt;

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

    firstMsg = true;
    lastMsgDate = '';

    scrollToElement(): void {
        this.myScrollContainer.nativeElement.scroll({
            top: this.myScrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnInit(): void {
        console.log(this.chatCollection)
        this.getPreviousMsgs()

        console.log(this.user_id)
        console.log(this.astro_id)
        // this.userDetail = JSON.parse(localStorage.getItem('userDetail'));

        setTimeout(() => {
            console.log("Collection_id:-" + this.collection_id)
            this.firestoreSubscription = this.ngFirestore.collection('conversations').doc(this.collection_id).valueChanges().subscribe((res: any) => {
                console.log(res)
                if (!this.firstMsg) {
                    if (res != null && res != undefined) {
                        if (res.date != this.lastMsgDate) {
                            console.log(res);
                            this.lastMsgDate = res.date;
                            if (res.sender != this.astro_id) {
                                this.messagesToShow.push(res);
                                this.scrollToBottom();
                            }
                        }
                    }
                }
                this.firstMsg = false;
            });
        }, 1000)


        this.eventServiceSubscription = this.eventService.on(Events.CHAT_EVENTS, (data => {
            console.log("chat event terminated")
            console.log(data)
            if (this.utilService.checkValue(data)) {
                if (data.status == 2) {
                    this.toaster.error("Chat closed by client");
                    this.activeModal.close();
                }
            }
        }));
        this.chatRequestUpdatedSubs = this.eventService.on(Events.CHAT_REQUEST_UPDATED, (data => {
            console.log("chat request updated")
            console.log(data)
            if (this.utilService.checkValue(data)) {
                if (data.id == this.chat_request_id) {
                    this.startedAt = new Date();
                    this.startTimer();
                    this.chatRequestUpdatedSubs.unsubscribe();
                }
            }
        }));
        this.getUserDetail()

    }

    getUserDetail() {
        this.apiService.postAPI(this.apiService.BASE_URL + "user/getUserDetailById", {
            id: this.chatCollection.user_id
        }).then((result) => {
            if (result.status) {
                this.userDetail = result.result;
                // localStorage.setItem('userDetail', JSON.stringify((this.userDetail)));
            }
        }, (error) => {
            console.log(error);
        })
    }

    intervalPopup;
    secsUsed = 0;

    startTimer() {
        this.clearTimer()
        this.intervalPopup = setInterval(() => {
            this.secsUsed = ((new Date().getTime() - this.startedAt.getTime())) / 1000;
            // console.log("secsused:-" + this.secsUsed);
        }, 1000);
    }

    clearTimer() {
        if (this.intervalPopup != null) {
            clearInterval(this.intervalPopup);
        }
    }

    ngOnDestroy() {
        if (this.utilService.checkValue(this.eventServiceSubscription)) {
            this.eventServiceSubscription.unsubscribe();
        }
        if (this.utilService.checkValue(this.chatRequestUpdatedSubs)) {
            this.chatRequestUpdatedSubs.unsubscribe();
        }
        this.clearTimer();
    }

    isSender(message) {
        if (message.sender == this.astro_id) {
            return true;
        } else {
            return false;
        }
    }

    getPreviousMsgs() {
        let url = this.apiService.BASE_URL + "chat/getPreviousMsgs"
        this.apiService.postAPI(url, {
            user_id: this.user_id,
            astro_id: this.astro_id
        }).then((result) => {
            if (result.status) {
                // this.messagesToShow = result.result;
                // this.initVoiceSDK()
                for (let msg of result.result) {
                    this.messagesToShow.push({
                        id: msg.id,
                        date: msg.created_at,
                        message: msg.msg,
                        sender: msg.sender,
                        path: msg.path,
                        type: msg.type,
                        show_attac: msg.show_attac,
                        firstChatMsg: false
                    })
                }
                if (!this.view_only) {
                    this.messagesToShow.push({
                        date: '',
                        message: 'Customer has joined the chat',
                        sender: '',
                        path: '',
                        type: '',
                        show_attac: false,
                        firstChatMsg: true
                    })

                    this.scrollToBottom();
                }

                // this.scrollBottom()
                this.scrollToElement()
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
        })
    }

    @ViewChild('scrollMe') private myScrollCont: ElementRef;

    scrollBottom() {
        // document.querySelector( '.card').scrollTo({top:0,behavior:'smooth'});
        console.log("scrolling to height");
        window.scrollTo(0, document.body.scrollHeight);
    }

    ngAfterViewChecked() {
        // this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            setTimeout(()=>{
                console.log("scrollTop height");
                this.myScrollCont.nativeElement.scrollTop = this.myScrollCont.nativeElement.scrollHeight;
                this.scrollBottom()
            },500)
        } catch (err) {
        }
    }

    close() {
        this.activeModal.close();
    }

    sendMessage(type, path = '') {
        let messsage: Msg = {
            sender: this.astro_id,
            message: this.msg,
            type: type,
            path: path,
            show_attac: 1,
            date: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            firstChatMsg: false
        }

        // this.scrollBottom();
        // this.scrollToBottom();
        this.messagesToShow.push(messsage);
        this.scrollToBottom();

        this.ngFirestore.collection('conversations').doc(this.collection_id).set(messsage).then((result) => {

            console.log(result)

            this.apiService.postAPI(this.apiService.BASE_URL + "chat/insertMessage", {
                from_user: this.user_id,
                to_user: this.astro_id,
                sender: this.astro_id,
                msg: this.msg,
                path: path,
                type: type
            })
            this.msg = "";

        }, (error) => {
            console.log(error)
        })
    }


    onselectimage(e) {
        if (e.target.files) {
            const target: DataTransfer = <DataTransfer>(e.target);
            const reader: FileReader = new FileReader();
            let file = target.files[0];
            reader.readAsDataURL(target.files[0]);
            reader.onload = (e: any) => {
                let name = file.name;
                console.log(reader.result);
                console.log(file)

                this.sendImageMessage(reader.result)

                // if (type == 'S10') {
                //   this.uploadS10Image(type, file, index);
                // } else {
                //   this.uploadImage(type, file, index)
                // }
            }
            e.target.value = null;
        }
    }

    async sendImageMessage(base64) {
        this.apiService.postAPI(this.apiService.BASE_URL + "chat/uploadImageBase64", {
            image: base64
        }).then((result) => {
            if (result.status) {
                this.sendMessage('image', result.path)
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
        })
    }

    async updateAttachView(message: any, index) {
        await this.apiService.postAPI(this.apiService.BASE_URL + "chat/updateAttachmentShow", {
            id: message.id,
            status: message.show_attac
        });
        if (message.show_attac == 2) {
            this.messagesToShow.splice(index, 1);
        }
    }

    openKundli() {
        const modalRef = this.modalService.open(UserKundliComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
            console.log('dismissed:-' + JSON.stringify(result));
        })
        modalRef.componentInstance.user_id = this.chatCollection.user_id;
    }
}

interface Msg {
    id?;
    date;
    message;
    sender;
    path;
    type;
    show_attac;
    firstChatMsg?;
}
