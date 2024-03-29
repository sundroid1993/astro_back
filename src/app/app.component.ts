import {Component, OnInit} from '@angular/core';
import {UtilService} from './service/util.service';
import {Router} from '@angular/router';
import {ApiService} from "./service/api.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {EmitEvent, Events, EventService} from "./service/event.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChatRequestPopupComponent} from "./modals/chat-request-popup/chat-request-popup.component";
import {ChatComponent} from "./modals/chat/chat.component";
import {ToastrService} from "ngx-toastr";
import {io} from 'socket.io-client';
import {UserKundliComponent} from "./pages/user-kundli/user-kundli.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    firebaseId = '';
    firebaseSubscription;

    constructor(
        private utilService: UtilService,
        private router: Router,
        private apiService: ApiService,
        private ngFirestore: AngularFirestore,
        private eventService: EventService,
        private modalService: NgbModal,
        private toaster: ToastrService,
    ) {
    }

    // @HostListener('window:unload', ['$event'])
    // unloadHandler(event) {
    //     this.setAstroOffline()
    // }
    //
    // @HostListener('window:beforeunload', ['$event'])
    // beforeUnloadHandler(event) {
    //     this.setAstroOffline()
    // }
    //
    // setAstroOffline() {
    //     if (this.firebaseId != '') {
    //         this.ngFirestore.collection('astrologers').doc(this.firebaseId).delete().then(() => {
    //             this.firebaseId = '';
    //         })
    //     }
    // }

    private socket;

    ngOnInit(): void {
        console.log("ng destroy")
        this.apiService.getAPI(this.apiService.BASE_URL + "common/updateAstroStatus")
        if (this.utilService.isUserLoggedIn()) {
            // this.router.navigateByUrl("/dashboard")
            // this.setAstroOnline()
            this.connectSocket();
        } else {
            this.router.navigateByUrl("/login")
        }

        this.eventService.on(Events.USER_LOGIN_LOGUT, (data => {
            if (this.utilService.isUserLoggedIn()) {
                this.connectSocket();
            } else {
                this.disconnectSocket()
            }
        }));

        this.eventService.on(Events.USER_STATUS_CHANGE, (data => {
            console.log(JSON.stringify(data));
            console.log("astro_status:-" + this.utilService.getItem(this.utilService.ASTRO_STATUS))
            let astro_status=this.utilService.getItem(this.utilService.ASTRO_STATUS);
            console.log(astro_status);

            if (this.utilService.getItem(this.utilService.ASTRO_STATUS) == '1') {
                console.log("in if")
                this.connectSocket()
            } else {
                console.log("in else")
                this.disconnectSocket()
            }
        }));
    }

    connectSocket() {
        this.socket = io(this.apiService.BASE_URL, {
            transports: ["websocket"]
        });
        // console.log(this.socket)
        // console.log(this.socket.id)
        this.socket.on('connect', () => {
            console.log(this.socket.id);
            this.updateSocketId();
            this.startInterval()
            setTimeout(() => {
                this.socket.emit('astro_connected', {
                    astro_id: this.utilService.getUserID()
                })
            }, 1000)
        });
        this.socket.on('disconnect', () => {
            console.log("socket disconnect");
            this.firebaseId = '';
            // this.updateSocketId();
            if (this.utilService.checkValue(this.interval)) {
                clearInterval(this.interval)
                this.interval = null;
            }
            // this.startInterval()
        });
        this.socket.on('new_astro_request', (data) => {
            console.log("new_astro_request:-" + JSON.stringify(data))
            if (this.utilService.checkValue(data)) {
                this.openRequestModal(data)
            }
        });
        this.socket.on('terminate_chat', (data) => {
            console.log("chat terminated")
            console.log(data)
            this.eventService.emit(new EmitEvent(Events.CHAT_EVENTS, data));
        });
        this.socket.on('cancel_request', (data) => {
            console.log("cancel_request")
            console.log(data)
            this.eventService.emit(new EmitEvent(Events.CANCEL_REQUEST, data));
        });
        this.socket.on('chat_request_updated', (data) => {
            console.log("chat_request_updated")
            console.log(data)
            this.eventService.emit(new EmitEvent(Events.CHAT_REQUEST_UPDATED, data));
        });
        this.socket.on('astro_notification', (data) => {
            console.log("data:", data)
            this.toaster.error(data.message)
        });
    }

    interval

    startInterval() {
        this.interval = setInterval(() => {
            if (this.utilService.isUserLoggedIn()) {
                this.apiService.postAPI(this.apiService.BASE_URL + "astrologer/updateAstoLastUpdate", {
                    astro_id: this.utilService.getUserID()
                })
            }
        }, 10000);
    }


    updateSocketId() {
        this.apiService.postAPI(this.apiService.BASE_URL + "chat/updateAstroFirebaseId", {
            firebase_id: this.socket.id,
            id: this.utilService.getUserID()
        }).then((result) => {
            console.log(result)
        })
    }

    disconnectSocket() {
        this.socket.close()
        if (this.utilService.checkValue(this.interval)) {
            clearInterval(this.interval)
            this.interval = null;
        }
    }

    ngOnDestroy() {
        this.disconnectSocket();
    }

    async openRequestModal(eventData) {
        let user_id = eventData.user_id;
        let astroId = this.utilService.getUserID();

        let collectionDetail = await this.apiService.postAPI(this.apiService.BASE_URL + "chat/getUserCollection", {
            user_id: user_id,
            astro_id: this.utilService.getUserID()
        })

        if (collectionDetail.status) {
            this.openRequestPopup(eventData)
        } else {
            this.ngFirestore.collection('conversations').add({}).then((result) => {
                console.log(result)
                console.log("firestore id:-" + result.id)

                this.apiService.postAPI(this.apiService.BASE_URL + "chat/insertUserCollectionId", {
                    user_id: user_id,
                    astro_id: this.utilService.getUserID(),
                    collection_id: result.id
                }).then((result) => {
                    if (result.status) {
                        this.openRequestPopup(eventData)
                    } else {
                        this.toaster.error(result.message);
                    }
                }, (error) => {
                    console.log(error);
                    this.toaster.error("Something went wrong");
                })
            }, (error) => {
                console.log(error);
            });
        }
    }

    openRequestPopup(eventData) {
        const modalRef = this.modalService.open(ChatRequestPopupComponent, {
            backdrop: 'static',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((res) => {
            console.log('dismissed:-' + JSON.stringify(res));
            if (this.utilService.checkValue(res) && this.utilService.checkValue(res.action)) {
                this.apiService.postAPI(this.apiService.BASE_URL + "chat/updateChatRequest", {
                    id: eventData.request_id,
                    status: res.action
                }).then((result) => {
                    if (result.status) {
                        // chatRequest.request=result.result;
                        this.socket.emit('request_update', eventData);
                        if (result.result.status == 1) {
                            if (eventData.type == 0) {
                                this.makeCollection(result.result)
                            } else {
                                this.openKundli(eventData.user_id)
                                this.toaster.success("You will soon receive a call from user.")
                            }
                        }
                    } else {
                        this.toaster.error(result.message)
                    }
                }, (error) => {
                    console.log(error);
                    this.toaster.error("something went wrong")
                })
            }
        })
        modalRef.componentInstance.chatRequest = eventData;
    }

    openKundli(user_id) {
        const modalRef = this.modalService.open(UserKundliComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
            console.log('dismissed:-' + JSON.stringify(result));
        })
        modalRef.componentInstance.user_id = user_id;
    }

    updateFirebaseChat(chats) {
        let profile = this.utilService.getUserProfile();
        this.ngFirestore.collection("astrologers").doc(this.firebaseId).set({
            id: this.utilService.getUserID(),
            status: 'online',
            name: profile.name,
            profile_pic: profile.profile_pic,
            call_charges: profile.call_charges,
            chats: chats
        })
    }

    async makeCollection(chatRequest) {
        let collectionDetail = await this.apiService.postAPI(this.apiService.BASE_URL + "chat/getUserCollection", {
            user_id: chatRequest.user_id,
            astro_id: this.utilService.getUserID()
        })

        if (collectionDetail.status) {
            this.openChat(collectionDetail.result, chatRequest.id)
        } else {
            this.ngFirestore.collection('conversations').add({}).then((result) => {
                console.log(result)
                console.log("firestore id:-" + result.id)

                this.apiService.postAPI(this.apiService.BASE_URL + "chat/insertUserCollectionId", {
                    user_id: chatRequest.user_id,
                    astro_id: this.utilService.getUserID(),
                    collection_id: result.id
                }).then((result) => {
                    if (result.status) {
                        this.openChat(result.result, chatRequest.id)
                    } else {
                        this.toaster.error(result.message);
                    }
                }, (error) => {
                    console.log(error);
                    this.toaster.error("Something went wrong");
                })
            }, (error) => {
                console.log(error);
            });
        }
    }

    openChat(chatCollection, chat_id) {
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
        modalRef.componentInstance.chat_request_id = chat_id;
    }

    async updateAstroFirebaseId(firebase_id) {
        if (firebase_id != null && firebase_id != undefined && firebase_id != '') {
            await this.apiService.postAPI(this.apiService.BASE_URL + "astrologer/setAstroFirebaseId", {
                astro_id: this.utilService.getUserID(),
                firebase_id: firebase_id
            })
        }
    }


}
