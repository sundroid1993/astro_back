import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PasswordResetComponent} from 'app/modals/password-reset/password-reset.component';
import {ApiService} from 'app/service/api.service';
import {UtilService} from 'app/service/util.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    phone;
    otp;
    resend_disabled = true;
    timeLeft: number = 0;
    interval;
    otpGenerated = false;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private router: Router,
        public utilService: UtilService,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        if(this.utilService.getItem(this.utilService.USER_LOGIN)=='1'){
            this.router.navigateByUrl("/dashboard")
        }
    }

    forgotPassword() {
        const modalRef = this.modalService.open(PasswordResetComponent, {
            backdrop: 'static',
            size: '',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
        })
    }

    registerAstro() {
        this.router.navigateByUrl('/register');
    }

    loginAstro() {

        if (this.phone != undefined && this.phone.toString().length == 10) {
            let url = this.apiService.BASE_URL + 'user/loginAstrologer';
            this.apiService.postAPI(url, {
                phone: this.phone
            }).then((result) => {
                if (result.status) {
                    this.clearTimer()
                    this.setResendEnableTimer()
                    this.otpGenerated = true;
                } else {
                    alert(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        } else {
            alert('Please enter valid phone');
        }
    }

    setResendEnableTimer() {
        this.timeLeft = 120000;
        this.interval = setInterval(() => {
            // console.log('timeleft:-' + this.timeLeft);
            if (this.timeLeft > 0) {
                this.timeLeft = this.timeLeft - 1000;
                this.resend_disabled = true;
            } else {
                this.clearTimer();
                this.resend_disabled = false;
            }
        }, 1000);
    }

    clearTimer() {
        if (this.interval != null) {
            clearInterval(this.interval);
        }
    }

    verifyOTP() {
        if (this.phone != undefined) {
            let url = this.apiService.BASE_URL + 'user/verifyAstroPhoneOTP';
            this.apiService.postAPI(url, {
                phone: this.phone,
                otp: this.otp
            }).then((result) => {
                if (result.status) {
                    this.clearTimer()
                    this.utilService.setItem(this.utilService.USER_LOGIN, '1');
                    this.utilService.setItem(this.utilService.USER_PROFILE, JSON.stringify(result.result));
                    this.router.navigateByUrl('/dashboard');
                } else {
                    alert(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        }

    }
}
