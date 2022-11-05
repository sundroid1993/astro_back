import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/service/api.service';
import { UtilService } from 'app/service/util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  submitted = false;
  otpVerified = false;
  phone;
  userProfile;

  verification_code = '';
  resend_disabled = true;

  new_password = '';
  confirm_password = '';

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    public utilService: UtilService,
    private apiService: ApiService,
    private toaster: ToastrService
  ) {
  }

  timeLeft: number = 120000;
  interval;

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }
}
