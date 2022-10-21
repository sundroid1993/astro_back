import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../service/api.service';
import { UtilService } from '../service/util.service';
import { Router } from '@angular/router';
import { CropImageComponent } from "../pages/crop-image/crop-image.component";
import { ToastrService } from "ngx-toastr";
import { TermsAndConditionsComponent } from "../pages/terms-and-conditions/terms-and-conditions.component";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    terms: boolean = false;
    name = '';
    email = '';
    phone = '';

    profile_pic = this.utilService.DEFAULT_IMAGE;

    model: NgbDateStruct;

    PersonalDetailsTab: boolean = true;
    VerifyPhoneTab: boolean = false;
    OtherDetailsTab: boolean = false;
    OtherDetailsmoreTab: boolean = false;
    ProfileBankDetails: boolean = false;
    thankyouTab: boolean = false;

    back() {
        if (this.ProfileBankDetails) {
            this.unselectAllTabs()
            this.OtherDetailsmoreTab = true
        } else if (this.OtherDetailsmoreTab) {
            this.unselectAllTabs()
            this.OtherDetailsTab = true
        } else if (this.OtherDetailsTab) {
            this.unselectAllTabs()
            this.VerifyPhoneTab = true
        } else if (this.VerifyPhoneTab) {
            this.unselectAllTabs()
            this.PersonalDetailsTab = true
        }
    }

    resend_disabled = true;
    timeLeft: number = 120000;
    interval;
    otpGenerated = false;

    otp;

    dropdownSettings = {};
    expdropdownSettings = {};

    gender = '1';
    dob;
    selectedPrimarySkills = [];
    selectAllSkills = [];
    selectedLanguages = [];
    selectedExperience = [];
    daily_hrs = '';
    other_platform = '';
    qualification = '';
    institute = '';
    other_platform_name = '';
    refer = '';
    refer_id = '';
    income_source = '';
    onboard_reason = '';
    bio = '';
    cities = [];
    skills = [];
    languages = [];
    experiences = [];
    min_date = '1925-01-01'

    selectedCities = [];

    per_min_chat_charge = 0;
    per_min_call_charge = 0;
    account_holder_name = '';
    account_type = '';
    account_no = '';
    ifsc = '';
    pan_number = '';
    pan_path = this.utilService.DEFAULT_BANNER;
    cheque_path = this.utilService.DEFAULT_BANNER;
    address_proof = this.utilService.DEFAULT_BANNER;

    constructor(
        private apiService: ApiService,
        public utilService: UtilService,
        private router: Router,
        private modalService: NgbModal,
        private toaster: ToastrService
    ) {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true
        };
        this.expdropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: true
        };
    }

    ngOnInit(): void {
        if (this.utilService.getItem(this.utilService.USER_LOGIN) == '1') {
            this.router.navigateByUrl('/dashboard')
        }
        this.getAllCities()
        this.getAllSkills()
        this.getAllLanguages()
        this.getAllExperience()
        this.getConstant()
    }

    getConstant() {
        this.apiService.getAPI(this.apiService.BASE_URL + 'common/getConstant').then((result) => {
            if (result.status) {
                // this.astro_comission = result.result.astro_comission;
                // this.min_call = result.result.min_call;
                // this.min_chat = result.result.min_chat;
                // this.gst = result.result.gst;
                this.per_min_call_charge = result.result.call_charges;
                this.per_min_chat_charge = result.result.chat_charges;
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    getAllSkills() {
        let url = this.apiService.BASE_URL + 'common/getActiveSkills';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.skills = result.result;
            }
        })
    }

    getAllLanguages() {
        let url = this.apiService.BASE_URL + 'common/getAllLanguages';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.languages = result.result;
            }
        })
    }

    getAllExperience() {
        let url = this.apiService.BASE_URL + 'common/getExperienceForAstro';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.experiences = result.result;
            } else {
                this.experiences = [];
            }
        }, (error) => {
            console.log(error);
            this.experiences = [];
        })
    }

    getAllCities() {
        let url = this.apiService.BASE_URL + 'common/getAllCities';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.cities = result.result
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    unselectAllTabs() {
        this.PersonalDetailsTab = false;
        this.VerifyPhoneTab = false;
        this.OtherDetailsTab = false;
        this.OtherDetailsmoreTab = false;
        this.ProfileBankDetails = false;
        this.thankyouTab = false;
    }

    checkAstroByEmailPhone() {

        if (this.name == '') {
            this.toaster.error('Enter name');
            return;
        }
        if (this.email == '') {
            this.toaster.error('Enter email');
            return;
        }
        if (this.phone == '') {
            this.toaster.error('Enter phone');
            return;
        }

        let url = this.apiService.BASE_URL + 'user/checkAstroEmailPhoneExist';
        this.apiService.postAPI(url, {
            phone: this.phone,
            email: this.email
        }).then((result) => {
            if (result.status) {
                this.registerTempAsto()
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    registerTempAsto() {
        let url = this.apiService.BASE_URL + 'user/generateTempAstrologer';
        this.apiService.postAPI(url, {
            phone: this.phone
        }).then((result) => {
            if (result.status) {
                this.openVerifyPhone()
                this.otpGenerated = true;
                this.setResendEnableTimer();
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    setResendEnableTimer() {
        this.clearTimer()
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


    openVerifyPhone() {
        this.unselectAllTabs();
        this.otp = '';
        this.VerifyPhoneTab = true;
    }

    submitOtherDetails() {
        // this.unselectAllTabs();
        // this.OtherDetailsmoreTab = true;
        // return;
        if (this.gender == '') {
            this.toaster.error('Please select gender');
            return;
        }
        if (this.dob == undefined) {
            this.toaster.error('Please select date of birth');
            return;
        }
        if (this.qualification == 'yes' && this.institute == '') {
            this.toaster.error('Please enter institute name');
            return;
        }
        if (this.selectedPrimarySkills.length == 0) {
            this.toaster.error('Please select primary skills');
            return;
        }
        if (this.selectAllSkills.length == 0) {
            this.toaster.error('Please select all skills');
            return;
        }
        if (this.selectedLanguages.length == 0) {
            this.toaster.error('Please select languages');
            return;
        }
        if (this.selectedExperience.length == 0) {
            this.toaster.error('Please enter experience');
            return;
        }
        if (this.daily_hrs == '') {
            this.toaster.error('Please enter daily hours');
            return;
        }
        if (this.other_platform == '') {
            this.toaster.error('Please select other platform');
            return;
        }
        if (this.other_platform == 'yes' && this.other_platform_name == '') {
            this.toaster.error('Please specify other platform name');
            return;
        }


        this.unselectAllTabs();
        this.OtherDetailsmoreTab = true;
    }

    openCropper(type) {
        let modal = this.modalService.open(CropImageComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        })
        if (type == 'profile_pic') {
            modal.componentInstance.ratio = 1 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'pan') {
            modal.componentInstance.ratio = 2 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'cheque') {
            modal.componentInstance.ratio = 2 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'address') {
            modal.componentInstance.ratio = 2 / 1;
            modal.componentInstance.width = 600;
        }

        modal.result.then((result) => {
            console.log(result);
            if (result != null && result != undefined && result.hasOwnProperty('image')) {
                this.uploadBaseImage(result.image, type)
            }
        })
    }

    uploadBaseImage(image, type) {
        this.apiService.postAPI(this.apiService.BASE_URL + "astrologer/uploadImageBase64", {
            image: image
        }).then((result) => {
            if (result.status) {
                if (type == 'profile_pic') {
                    this.profile_pic = result.path;
                } else if (type == 'pan') {
                    this.pan_path = result.path;
                } else if (type == 'cheque') {
                    this.cheque_path = result.path;
                } else if (type == 'address') {
                    this.address_proof = result.path;
                }
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error.error.message);
            this.toaster.error(error.error.message)
        })
    }

    backToBasic() {
        this.unselectAllTabs();
        this.PersonalDetailsTab = true;
    }

    backToverify() {
        this.unselectAllTabs();
        this.PersonalDetailsTab = true;
    }

    submitOTP() {
        if (this.otp == undefined || this.otp == '') {
            this.toaster.error('Please enter otp');
            return;
        }
        let url = this.apiService.BASE_URL + 'user/verifyTempAstro';
        this.apiService.postAPI(url, {
            phone: this.phone,
            otp: this.otp
        }).then((result) => {
            if (result.status) {
                this.clearTimer()
                this.unselectAllTabs()
                this.OtherDetailsTab = true;
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    submitMoreDetails() {
        if (this.onboard_reason == '') {
            this.toaster.error('Please enter on board reason');
            return;
        }
        if (this.selectedCities.length == 0) {
            this.toaster.error('Please select city');
            return;
        }
        if (this.income_source == '') {
            this.toaster.error('Please enter other income source');
            return;
        }
        if (this.refer == '') {
            this.toaster.error('Please select refer from');
            return;
        }
        if (this.refer == 'yes' && this.refer_id == '') {
            this.toaster.error('Please enter refer id');
            return;
        }
        if (this.bio == '') {
            this.toaster.error('Please enter long bio');
            return;
        }

        this.unselectAllTabs();
        this.ProfileBankDetails = true;

    }

    submitProfileDetails() {
        if (this.per_min_chat_charge == undefined || this.per_min_chat_charge == 0) {
            this.toaster.error('Please enter per min chat charge');
            return;
        }
        if (this.per_min_call_charge == undefined || this.per_min_call_charge == 0) {
            this.toaster.error('Please enter per min call charge');
            return;
        }
        if (this.account_holder_name == '') {
            this.toaster.error('Please enter account holder name');
            return;
        }
        if (this.account_type == '') {
            this.toaster.error('Please enter account type');
            return;
        }
        if (this.account_no == '') {
            this.toaster.error('Please enter account no');
            return;
        }
        if (this.ifsc == '') {
            this.toaster.error('Please enter ifsc code');
            return;
        }
        if (this.pan_number == '') {
            this.toaster.error('Please enter pan number');
            return;
        }
        if (this.pan_path == '' || this.pan_path == this.utilService.DEFAULT_BANNER) {
            this.toaster.error('Please upload pan card');
            return;
        }
        if (this.cheque_path == '' || this.pan_path == this.utilService.DEFAULT_BANNER) {
            this.toaster.error('Please upload cancel cheque image');
            return;
        }
        if (this.address_proof == '' || this.pan_path == this.utilService.DEFAULT_BANNER) {
            this.toaster.error('Please upload address proof');
            return;
        }
        this.addAstrologer()
    }

    addAstrologer() {
        let post = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            gender: this.gender,
            // dob: this.dob.year + '-' + this.dob.month + '-' + this.dob.day,
            dob: this.dob,
            skills: this.selectedPrimarySkills,
            all_skills: this.selectAllSkills,
            language: this.selectedLanguages,
            experience: this.selectedExperience[0].id,
            daily_hrs: this.daily_hrs,
            qualification: this.qualification,
            institute: this.institute,
            any_other_platform: this.other_platform,
            other_platform_name: this.other_platform_name,
            onboarding_reason: this.onboard_reason,
            city: this.selectedCities[0].id,
            income_source: this.income_source,
            refer: this.refer,
            refer_id: this.refer_id,
            bio: this.bio,
            per_min_chat_charge: this.per_min_chat_charge,
            per_min_call_charge: this.per_min_call_charge,
            account_holder_name: this.account_holder_name,
            account_type: this.account_type,
            account_no: this.account_no,
            ifsc: this.ifsc,
            pan_number: this.pan_number,
            pan_path: this.pan_path,
            cheque_path: this.cheque_path,
            address_proof: this.address_proof,
        }

        if (this.profile_pic != this.utilService.DEFAULT_IMAGE) {
            post['profile_pic'] = this.profile_pic
        }

        console.log(post)

        this.apiService.postAPI(this.apiService.BASE_URL + 'user/insertAstrologer', post).then((result) => {
            if (result.status) {
                this.unselectAllTabs()
                this.thankyouTab = true;
            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    openTermsCondition() {
        // /terms
        let modal = this.modalService.open(TermsAndConditionsComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        })

        modal.result.then((result) => {
            console.log(result);
            this.terms = result.status;
        })

        modal.componentInstance.terms = this.terms
    }
}
