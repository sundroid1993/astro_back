import {Component, OnInit} from '@angular/core';
import {NgbModal, NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {AddReportComponent} from 'app/modals/add-report/add-report.component';
import {ChatComponent} from "../../modals/chat/chat.component";
import {ApiService} from "../../service/api.service";
import {UtilService} from "../../service/util.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-conductedchatscalls',
    templateUrl: './conductedchatscalls.component.html',
    styleUrls: ['./conductedchatscalls.component.css']
})
export class ConductedchatscallsComponent implements OnInit {

    Chat_tab: boolean = true;
    Call_tab: boolean = false;
    Decline_tab: boolean = false;

    chatHistory = [];
    declineHistory = [];
    callHistory = [];

    type = 0;

    constructor(
        private modalService: NgbModal,
        config: NgbRatingConfig,
        public apiService: ApiService,
        public utilService: UtilService,
        private toaster: ToastrService
    ) {
        config.max = 5;
        config.readonly = true;
    }

    unSelectAll(){
        this.Chat_tab = false;
        this.Call_tab = false;
        this.Decline_tab = false;
    }

    opentab(value) {
        if (value == 'Chat') {
            this.type = 0;
            this.unSelectAll()
            this.Chat_tab = true;
            this.getOrderHistory()
        } else if (value == 'Call') {
            this.type = 1;
            this.unSelectAll()
            this.Call_tab = true;
            this.getOrderHistory()
        } else if (value == 'Decline') {
            this.type = 1;
            this.unSelectAll()
            this.Decline_tab = true;
            this.getDeclineRequests()
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

    getDeclineRequests() {
        let url = this.apiService.BASE_URL + 'astrologer/getDeclineRequests';
        this.apiService.postAPI(url, {
            astro_id: this.utilService.getUserID(),
            type: this.type
        }).then((result) => {
            if (result.status) {
                this.declineHistory = result.result;
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
        modalRef.componentInstance.view_only = true;
    }

    pickReport(index) {
        let element: HTMLElement = document.getElementById('file_' + index) as HTMLElement;
        element.click();
    }

    viewReport(history) {
        window.open(this.apiService.BASE_IMAGE_URL + history.report_path)
    }

    doFileInput(e, i) {
        console.log(i);
        if (e.target.files) {
            const target: DataTransfer = <DataTransfer>(e.target);
            const reader: FileReader = new FileReader();
            let file = target.files[0];
            reader.readAsDataURL(target.files[0]);
            reader.onload = (e: any) => {
                let name = file.name;
                console.log(reader.result);
                console.log(file)

                this.sendAttachment(reader.result, i)

                // if (type == 'S10') {
                //   this.uploadS10Image(type, file, index);
                // } else {
                //   this.uploadImage(type, file, index)
                // }
            }
            e.target.value = null;
        }
    }

    sendAttachment(base64, i) {
        this.apiService.postAPI(this.apiService.BASE_URL + "chat/uploadImageBase64", {
            image: base64
        }).then((result) => {
            if (result.status) {
                this.attachReport(result.path, i)
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
        })
    }

    attachReport(path, index) {
        let id = this.chatHistory[index].id
        this.apiService.postAPI(this.apiService.BASE_URL + "chat/attachReport", {
            id: id,
            report_path: path
        }).then((result) => {
            if (result.status) {
                this.chatHistory[index].report_path = path;
                this.toaster.success("Report attached");
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
        })
    }
}
