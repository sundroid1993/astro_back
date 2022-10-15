import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UtilService} from "../../service/util.service";
import {ApiService} from "../../service/api.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {DatePipe} from "@angular/common";
import {Events, EventService} from "../../service/event.service";

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

    messagesToShow = [];


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
        this.getPreviousMsgs()

        console.log(this.user_id)
        console.log(this.astro_id)

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

    }

    ngOnDestroy() {
        if (this.utilService.checkValue(this.eventServiceSubscription)) {
            this.eventServiceSubscription.unsubscribe();
        }
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
                        show_attac: msg.show_attac
                    })
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

    scrollBottom() {

    }

    close() {
        this.activeModal.close();
    }

    sendMessage(type, path = '') {
        let messsage = {
            sender: this.astro_id,
            message: this.msg,
            type: type,
            path: path,
            show_attac: 1,
            date: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
        this.scrollBottom()
        this.messagesToShow.push(messsage);

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

    updateAttachView(message: any) {
        this.apiService.postAPI(this.apiService.BASE_URL + "chat/updateAttachmentShow", {
            id: message.id
        });
    }
}
