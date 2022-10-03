import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../service/api.service";
import { UtilService } from "../../service/util.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CropImageComponent } from "../crop-image/crop-image.component";
import {ImageInfoModalComponent} from "../../modals/image-info-modal/image-info-modal.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profile_pic = 'assets/img/default_profile.png';

    dropdownSettings = {};
    expDD = {};

    Information_tab: boolean = true;
    SME_tab: boolean = false;
    Bank_tab: boolean = false;

    skillList = [];
    languages = [];
    experienceList = [];

    user_name = '';
    user_email = '';
    user_phone = '';
    gender = '1';
    dob;
    selectedCities = [];
    selectedPrimarySkills = [];
    selectAllSkills = [];
    selectedLanguages = [];
    selectedExperience = [];
    daily_hrs = '';
    other_platform = '';
    other_platform_name = '';
    reason_other_platform: boolean = false;
    refer = '';
    refer_id = '';
    income_source = '';
    onboard_reason = '';
    bio = '';
    cities = [];

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

    astroDetail;

    astroProfileUpdateList = [];
    showUpdateButton = false;

    constructor(
        private apiService: ApiService,
        private utilService: UtilService,
        private toaster: ToastrService,
        private modalService: NgbModal
    ) {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 5,
            allowSearchFilter: true
        };
        this.expDD = {
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
        this.getSkills()
        this.getLanguages()
        this.getExperience()
        this.getAllCities()

        this.getAstroProfile()
        this.getBankDetails()
        this.checkUpdateForAstro();
    }

    on_other_platform() {
        if (this.other_platform == 'yes') {
            this.reason_other_platform = true;
        }
        else {
            this.reason_other_platform = false;
        }
    }

    checkUpdateForAstro() {
        this.astroProfileUpdateList = [];
        this.showUpdateButton = true;
        let url = this.apiService.BASE_URL + 'notification/checkUpdateForAstro';
        this.apiService.postAPI(url, {
            astro_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                this.astroProfileUpdateList = result.result;
                this.astroProfileUpdateList.reverse()
                for (let data of this.astroProfileUpdateList) {
                    if (data.approve_status == 0) {
                        this.showUpdateButton = false;
                        break;
                    }
                }
            }
        }, (error) => {
            console.log(error);
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

    getSkills() {
        let url = this.apiService.BASE_URL + 'common/getActiveSkills';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.skillList = result.result;
            }
        })
    }

    getLanguages() {
        let url = this.apiService.BASE_URL + 'common/getAllLanguages';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.languages = result.result;
            }
        })
    }

    getExperience() {
        let url = this.apiService.BASE_URL + 'common/getExperience';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                for (let i = 0; i < result.result.length; i++) {
                    this.experienceList = this.experienceList.concat({
                        id: result.result[i].id,
                        name: result.result[i].range1 + ' - ' + result.result[i].range2
                    })
                }
                // this.languages = result.result;
            }
        })
    }


    openCropper(type) {
        console.log(type)
        let modal = this.modalService.open(CropImageComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        })
        if (type == 'profile_pic') {
            modal.componentInstance.ratio = 1 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'pan_image') {
            modal.componentInstance.ratio = 2 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'cheque_image') {
            modal.componentInstance.ratio = 2 / 1;
            modal.componentInstance.width = 600;
        } else if (type == 'address_image') {
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
        this.apiService.postAPI(this.apiService.BASE_URL + 'astrologer/uploadImageBase64', {
            image: image
        }).then((result) => {
            if (result.status) {
                if (type == 'profile_pic') {
                    this.profile_pic = result.path;
                } else if (type == 'pan_image') {
                    this.pan_path = result.path
                } else if (type == 'cheque_image') {
                    this.cheque_path = result.path
                } else if (type == 'address_image') {
                    this.address_proof = result.path
                }
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error.error.message);
            this.toaster.error(error.error.message)
        })
    }

    validateAstroProfile() {
        if (this.user_name == '') {
            this.toaster.error('Please enter name');
            return false;
        }
        if (this.user_email == '') {
            this.toaster.error('Please enter email');
            return false;
        }
        if (this.user_phone == '') {
            this.toaster.error('Please enter phone');
            return false;
        }
        if (this.gender == '') {
            this.toaster.error('Please select gender');
            return false;
        }
        if (this.dob == undefined) {
            this.toaster.error('Please select date of birth');
            return false;
        }
        if (this.selectedPrimarySkills.length == 0) {
            this.toaster.error('Please select primary skills');
            return false;
        }
        if (this.selectAllSkills.length == 0) {
            this.toaster.error('Please select all skills');
            return false;
        }
        if (this.selectedLanguages.length == 0) {
            this.toaster.error('Please select language');
            return false;
        }
        if (this.selectedExperience.length == 0) {
            this.toaster.error('Please enter experience');
            return false;
        }
        if (this.daily_hrs == '') {
            this.toaster.error('Please select daily contribution hours');
            return false;
        }
        if (this.other_platform == '') {
            this.toaster.error('Please select working on other platform');
            return false;
        }
        if (this.other_platform == 'yes' &&this.other_platform_name=='') {
            this.toaster.error('Please enter other platform name');
            return false;
        }
        if (this.onboard_reason == '') {
            this.toaster.error('Please enter on board reason');
            return false;
        }
        if (this.selectedCities.length == 0) {
            this.toaster.error('Please select city');
            return false;
        }
        if (this.income_source == '') {
            this.toaster.error('Please enter main source of income');
            return false;
        }
        if (this.refer == '') {
            this.toaster.error('Please select reference');
            return false;
        }
        if (this.refer == 'yes' && this.refer_id=='') {
            this.toaster.error('Please enter refer id');
            return false;
        }
        if (this.bio == '') {
            this.toaster.error('Please enter bio');
            return false;
        }

        return true;
    }

    validateAstroSME() {
        if (this.per_min_chat_charge == 0) {
            this.toaster.error('Please enter per min chat charges');
            return false;
        }
        if (this.per_min_call_charge == 0) {
            this.toaster.error('Please enter per min call charges');
            return false;
        }

        return true;
    }

    updateAstrologer() {
        if (this.validateAstroProfile() && this.validateBankDetails()) {
            let basic_profile = {
                from_admin: 0,
                name: this.user_name,
                email: this.user_email,
                phone: this.user_phone,
                gender: this.gender,
                dob: this.dob,
                skills: JSON.stringify(this.selectedPrimarySkills),
                all_skills: JSON.stringify(this.selectAllSkills),
                language: JSON.stringify(this.selectedLanguages),
                experience: this.selectedExperience[0].id,
                daily_hrs: this.daily_hrs,
                any_other_platform: this.other_platform,
                other_platform_name: this.other_platform_name,
                onboarding_reason: this.onboard_reason,
                city: this.selectedCities[0].id,
                income_source: this.income_source,
                refer: this.refer,
                refer_id: this.refer_id,
                bio: this.bio,
                user_id: this.utilService.getUserID(),
                per_min_chat_charge: this.per_min_chat_charge,
                per_min_call_charge: this.per_min_call_charge,
            }

            let bank_detail = {
                from_admin: 0,
                account_holder_name: this.account_holder_name,
                account_type: this.account_type,
                account_no: this.account_no,
                ifsc: this.ifsc,
                pan_number: this.pan_number,
                pan_path: this.pan_path,
                cheque_path: this.cheque_path,
                address_proof: this.address_proof,
                astro_id: this.utilService.getUserID()
            }

            if (this.profile_pic != 'assets/img/default_profile.png') {
                basic_profile['profile_pic'] = this.profile_pic
            } else {
                basic_profile['profile_pic'] = ''
            }

            let post = {
                basic_profile: basic_profile,
                bank_detail: bank_detail,
                astro_id: this.utilService.getUserID()
            }

            let base64 = btoa(JSON.stringify(post));

            // console.log(JSON.parse(atob(base64)))

            // return;

            let url = this.apiService.BASE_URL + 'user/updateAstroApproval';
            this.apiService.postAPI(url, {
                astro_id: this.utilService.getUserID(),
                data: base64
            }).then((result) => {
                if (result.status) {
                    this.toaster.success('Updates sent to admin for approvals');
                    // this.getAstroProfile()
                    this.checkUpdateForAstro()
                } else {
                    this.toaster.error(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        }
    }

    validateCharges() {
        if (this.per_min_call_charge == null || this.per_min_call_charge == undefined || this.per_min_call_charge == 0) {
            this.toaster.error('Please enter per min call charges');
            return false;
        }
        if (this.per_min_chat_charge == null || this.per_min_chat_charge == undefined || this.per_min_chat_charge == 0) {
            this.toaster.error('Please enter per min chat charges');
            return false;
        }
        return true;
    }

    submitAstroCharges() {
        if (this.validateCharges()) {
            let post = {
                call_charges: this.per_min_call_charge,
                chat_charges: this.per_min_chat_charge,
                user_id: this.utilService.getUserID()
            }

            let url = this.apiService.BASE_URL + 'user/updateAstroCharges';
            this.apiService.postAPI(url, post).then((result) => {
                if (result.status) {
                    this.toaster.success('Charges updated successfully');
                    this.getAstroProfile()
                } else {
                    this.toaster.error(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        }
    }

    getAstroProfile() {
        let url = this.apiService.BASE_URL + 'user/getAstroFullDetailById';
        this.apiService.postAPI(url, {
            user_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                this.astroDetail = result.result;

                this.setastroDetailProfile()

            } else {
                this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    private setastroDetailProfile() {
        this.user_name = this.astroDetail.name;
        this.user_email = this.astroDetail.email;
        this.user_phone = this.astroDetail.phone;
        this.gender = this.astroDetail.gender;
        // this.dob=this.astroDetail.dob;
        // alert(this.astroDetail.dob)
        // let dob = this.astroDetail.dob.split('-');
        // this.dob = {
        //     year: Number(dob[0]),
        //     month: Number(dob[1]),
        //     day: Number(dob[2])
        // };
        this.dob = this.astroDetail.dob
        console.log(this.dob)
        this.selectAllSkills = JSON.parse(this.astroDetail.all_skills);
        this.selectedPrimarySkills = JSON.parse(this.astroDetail.skills);
        this.selectedLanguages = JSON.parse(this.astroDetail.language);
        this.daily_hrs = this.astroDetail.daily_hrs;
        this.selectedExperience = this.selectedExperience.concat({
            id: this.astroDetail.experienceDetail.id,
            name: this.astroDetail.experienceDetail.range1 + '-' + this.astroDetail.experienceDetail.range2,
        })

        // this.experience = this.astroDetail.experience;
        this.other_platform = this.astroDetail.any_other_platform;
        this.other_platform_name = this.astroDetail.other_platform_name;
        this.selectedCities = this.selectedCities.concat({
            id: this.astroDetail.cityDetail.id,
            name: this.astroDetail.cityDetail.name
        })
        // this.selectedCity = this.astroDetail.city;
        this.onboard_reason = this.astroDetail.onboarding_reason;
        this.refer = this.astroDetail.refer;
        this.refer_id = this.astroDetail.refer_id;
        this.income_source = this.astroDetail.income_source;
        this.bio = this.astroDetail.bio;
        this.per_min_chat_charge = this.astroDetail.chat_charges;
        this.per_min_call_charge = this.astroDetail.call_charges;
        if (this.astroDetail.profile_pic != null && this.astroDetail.profile_pic != undefined && this.astroDetail.profile_pic != '' && this.astroDetail.profile_pic != 'null') {
            this.profile_pic = this.astroDetail.profile_pic;
        }
    }

    validateBankDetails() {

        if (this.account_holder_name == '') {
            this.toaster.error('Please enter account holder name');
            return false;
        }
        if (this.account_type == '') {
            this.toaster.error('Please select account type');
            return false;
        }
        if (this.account_no == '') {
            this.toaster.error('Please enter account number');
            return false;
        }
        if (this.ifsc == '') {
            this.toaster.error('Please enter ifsc code');
            return false;
        }
        if (this.pan_number == '') {
            this.toaster.error('Please enter pam number');
            return false;
        }
        if (this.pan_path == this.utilService.DEFAULT_BANNER) {
            this.toaster.error('Please select pan image');
            return false;
        }
        if (this.cheque_path == this.utilService.DEFAULT_BANNER) {
            this.toaster.error('Please select cheque image');
            return false;
        }
        if (this.address_proof == this.utilService.DEFAULT_BANNER || this.address_proof == '') {
            this.toaster.error('Please select address proof');
            return false;
        }

        return true;
    }

    submitBankDetails() {
        if (this.validateBankDetails()) {
            let post = {
                from_admin: 0,
                account_holder_name: this.account_holder_name,
                account_type: this.account_type,
                account_no: this.account_no,
                ifsc: this.ifsc,
                pan_number: this.pan_number,
                pan_path: this.pan_path,
                cheque_path: this.cheque_path,
                address_proof: this.address_proof,
                astro_id: this.utilService.getUserID()
            }

            let url = this.apiService.BASE_URL + 'user/addAstrologerBankDetail';
            this.apiService.postAPI(url, post).then((result) => {
                if (result.status) {
                    this.toaster.success('Bank details updated successfully');
                    this.getBankDetails()
                } else {
                    this.toaster.error(result.message);
                }
            }, (error) => {
                console.log(error);
            })

        }
    }

    getBankDetails() {
        let post = {
            astro_id: this.utilService.getUserID()
        }

        let url = this.apiService.BASE_URL + 'user/getAstrologerBankDetail';
        this.apiService.postAPI(url, post).then((result) => {
            if (result.status) {
                this.account_holder_name = result.result.account_holder_name;
                this.account_type = result.result.account_type;
                this.account_no = result.result.account_no;
                this.ifsc = result.result.ifsc;
                this.pan_number = result.result.pan_number;
                this.pan_path = result.result.pan_path;
                this.address_proof = result.result.address_proof;
                this.cheque_path = result.result.cheque_path;
            } else {
                // this.toaster.error(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    infoModal(){
        const modalRef = this.modalService.open(ImageInfoModalComponent, {
            backdrop: 'static',
            size: 'xl',
            keyboard: false,
            centered: true
        });
        modalRef.result.then((result) => {
        })
    }


}
