import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {UtilService} from "../../service/util.service";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CropImageComponent} from "../crop-image/crop-image.component";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profile_pic = 'assets/img/default_profile.png';

    Information_tab: boolean = true;
    SME_tab: boolean = false;
    Bank_tab: boolean = false;

    astroUser;

    user_name = "";
    user_email = "";
    user_phone = "";
    gender = "";
    dob;
    selectedPrimarySkills = [];
    selectAllSkills = [];
    daily_hrs = '';
    selectedLanguages = [];
    experience = '';
    other_platform = '';
    selectedCity;
    onboard_reason = '';
    refer = '';
    income_source = '';
    bio = '';
    per_min_chat_charge = 0;
    per_min_call_charge = 0;

    cities = [];
    skills = [
        {
            id: 1,
            name: 'Skill 1'
        },
        {
            id: 2,
            name: 'Skill 2'
        },
        {
            id: 3,
            name: 'Skill 3'
        },
        {
            id: 4,
            name: 'Skill 4'
        },
        {
            id: 5,
            name: 'Skill 5'
        },
        {
            id: 6,
            name: 'Skill 6'
        },
        {
            id: 7,
            name: 'Skill 7'
        },
    ]

    languages = [
        {
            id: 1,
            name: 'Hindi'
        },
        {
            id: 2,
            name: 'English'
        },
        {
            id: 3,
            name: 'French'
        },
        {
            id: 4,
            name: 'Spanish'
        },
        {
            id: 5,
            name: 'Portugese'
        }
    ]


    dropdownSettings = {}

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
        } else {

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
                } else {

                }
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error.error.message);
            this.toaster.error(error.error.message)
        })
    }

    ngOnInit(): void {
        this.getAstroProfile()
        this.getAllCities()
    }

    getAllCities() {
        let url = this.apiService.BASE_URL + 'common/getAllCities';
        this.apiService.getAPI(url).then((result) => {
            if (result.status) {
                this.cities = result.result
            } else {
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    getAstroProfile() {
        let url = this.apiService.BASE_URL + "user/getAstroUserById";
        this.apiService.postAPI(url, {
            user_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                this.astroUser = result.result;

                this.setAstroUserProfile()

            } else {
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    openInformation_tab() {
        this.Information_tab = true;
        this.SME_tab = false;
        this.Bank_tab = false;
    }

    openSME_tab() {
        this.Information_tab = false;
        this.SME_tab = true;
        this.Bank_tab = false;
    }

    openBank_tab() {
        this.Information_tab = false;
        this.SME_tab = false;
        this.Bank_tab = true;
    }

    validateAstroProfile() {
        if (this.user_name == '') {
            this.toaster.error("Please enter name");
            return false;
        }
        if (this.user_email == '') {
            this.toaster.error("Please enter email");
            return false;
        }
        if (this.user_phone == '') {
            this.toaster.error("Please enter phone");
            return false;
        }
        if (this.gender == '') {
            this.toaster.error("Please select gender");
            return false;
        }
        if (this.dob == undefined) {
            this.toaster.error("Please select date of birth");
            return false;
        }
        if (this.selectedPrimarySkills.length == 0) {
            this.toaster.error("Please select primary skills");
            return false;
        }
        if (this.selectAllSkills.length == 0) {
            this.toaster.error("Please select all skills");
            return false;
        }
        if (this.selectedLanguages.length == 0) {
            this.toaster.error("Please select language");
            return false;
        }
        if (this.experience == '') {
            this.toaster.error("Please enter experience");
            return false;
        }
        if (this.daily_hrs == '') {
            this.toaster.error("Please select daily contribution hours");
            return false;
        }
        if (this.other_platform == '') {
            this.toaster.error("Please select working on other platform");
            return false;
        }
        if (this.onboard_reason == '') {
            this.toaster.error("Please enter on board reason");
            return false;
        }
        if (this.selectedCity == '') {
            this.toaster.error("Please select city");
            return false;
        }
        if (this.income_source == '') {
            this.toaster.error("Please enter main source of income");
            return false;
        }
        if (this.refer == '') {
            this.toaster.error("Please select reference");
            return false;
        }
        if (this.bio == '') {
            this.toaster.error("Please enter bio");
            return false;
        }

        return true;
    }

    updateAstrologer() {
        if (this.validateAstroProfile()) {
            let post = {
                name: this.user_name,
                email: this.user_email,
                phone: this.user_phone,
                gender: this.gender,
                dob: this.dob.year + "-" + this.dob.month + "-" + this.dob.day,
                skills: JSON.stringify(this.selectedPrimarySkills),
                all_skills: JSON.stringify(this.selectAllSkills),
                language: JSON.stringify(this.selectedLanguages),
                experience: this.experience,
                daily_hrs: this.daily_hrs,
                any_other_platform: this.other_platform,
                onboarding_reason: this.onboard_reason,
                city: this.selectedCity,
                income_source: this.income_source,
                refer: this.refer,
                bio: this.bio,
                user_id: this.utilService.getUserID()
            }

            if (this.profile_pic != 'assets/img/default_profile.png') {
                post['profile_pic'] = this.profile_pic
            } else {
                post['profile_pic'] = ""
            }

            let url = this.apiService.BASE_URL + 'user/updateAstroBasicProfile';
            this.apiService.postAPI(url, post).then((result) => {
                if (result.status) {
                    this.toaster.success("Profile updated successfully");
                    this.getAstroProfile()
                } else {
                    alert(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        }
    }

    validateCharges() {
        if (this.per_min_call_charge == null || this.per_min_call_charge == undefined || this.per_min_call_charge == 0) {
            this.toaster.error("Please enter per min call charges");
            return false;
        }
        if (this.per_min_chat_charge == null || this.per_min_chat_charge == undefined || this.per_min_chat_charge == 0) {
            this.toaster.error("Please enter per min chat charges");
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
                    this.toaster.success("Charges updated successfully");
                    this.getAstroProfile()
                } else {
                    alert(result.message);
                }
            }, (error) => {
                console.log(error);
            })
        }
    }

    private setAstroUserProfile() {
        this.user_name = this.astroUser.name;
        this.user_email = this.astroUser.email;
        this.user_phone = this.astroUser.phone;
        this.gender = this.astroUser.gender;
        let dob = this.astroUser.dob.split("-");
        this.dob = {
            year: dob[0],
            month: dob[1],
            day: dob[2]
        };
        this.selectedPrimarySkills = JSON.parse(this.astroUser.skills);
        this.selectAllSkills = JSON.parse(this.astroUser.all_skills);
        this.selectedLanguages = JSON.parse(this.astroUser.language);
        this.daily_hrs = this.astroUser.daily_hrs;
        this.experience = this.astroUser.experience;
        this.other_platform = this.astroUser.any_other_platform;
        this.selectedCity = this.astroUser.city;
        this.onboard_reason = this.astroUser.onboarding_reason;
        this.refer = this.astroUser.refer;
        this.income_source = this.astroUser.income_source;
        this.bio = this.astroUser.bio;
        this.per_min_chat_charge = this.astroUser.chat_charges;
        this.per_min_call_charge = this.astroUser.call_charges;
        if (this.astroUser.profile_pic != null && this.astroUser.profile_pic != undefined && this.astroUser.profile_pic != '' && this.astroUser.profile_pic != 'null') {
            this.profile_pic = this.astroUser.profile_pic;
        }
    }

}
