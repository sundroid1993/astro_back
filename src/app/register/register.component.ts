import {Component, OnInit} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../service/api.service';
import {UtilService} from '../service/util.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    name = '';
    email = '';
    phone = '';

    model: NgbDateStruct;

    PersonalDetailsTab: boolean = true;
    VerifyPhoneTab: boolean = false;
    OtherDetailsTab: boolean = false;
    OtherDetailsmoreTab: boolean = false;
    thankyouTab: boolean = false;

    resend_disabled = true;
    timeLeft: number = 120000;
    interval;
    otpGenerated = false;

    otp;

    dropdownSettings = {};

    gender = '1';
    dob;
    selectedPrimarySkills = [];
    selectAllSkills = [];
    selectedLanguages = [];
    experience = '';
    daily_hrs = '';
    other_platform = '';
    selectedCity;
    refer = '';
    income_source = '';
    onboard_reason = '';
    bio = '';
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

    constructor(
        private apiService: ApiService,
        public utilService: UtilService,
        private router: Router,
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

    ngOnInit(): void {
        if (this.utilService.getItem(this.utilService.USER_LOGIN) == '1') {
            this.router.navigateByUrl('/dashboard')
        }
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

    unselectAllTabs() {
        this.PersonalDetailsTab = false;
        this.VerifyPhoneTab = false;
        this.OtherDetailsTab = false;
        this.OtherDetailsmoreTab = false;
        this.thankyouTab = false;
    }

    checkAstroByEmailPhone() {

        if (this.name == '') {
            alert('Enter name');
            return;
        }
        if (this.email == '') {
            alert('Enter email');
            return;
        }
        if (this.phone == '') {
            alert('Enter phone');
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
                alert(result.message);
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
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })
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


    openVerifyPhone() {
        this.unselectAllTabs()
        this.VerifyPhoneTab = true;
    }

    submitOtherDetails() {
        // this.unselectAllTabs();
        // this.OtherDetailsmoreTab = true;
        // return;
        if (this.gender == '') {
            alert('Please select gender');
            return;
        }
        if (this.dob == undefined) {
            alert('Please select date of birth');
            return;
        }
        if (this.selectedPrimarySkills.length == 0) {
            alert('Please select primary skills');
            return;
        }
        if (this.selectAllSkills.length == 0) {
            alert('Please select all skills');
            return;
        }
        if (this.selectedLanguages.length == 0) {
            alert('Please select languages');
            return;
        }
        if (this.experience == '') {
            alert('Please enter experience');
            return;
        }
        if (this.daily_hrs == '') {
            alert('Please enter daily hours');
            return;
        }
        if (this.other_platform == '') {
            alert('Please select other platform');
            return;
        }


        this.unselectAllTabs();
        this.OtherDetailsmoreTab = true;
    }

    upload() {

    }

    backToBasic() {
        this.unselectAllTabs();
        this.PersonalDetailsTab = true;
    }

    submitOTP() {
        if (this.otp == undefined || this.otp == '') {
            alert('Please enter otp');
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
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })
    }

    submitMoreDetails() {
        if (this.onboard_reason == '') {
            alert('Please enter on board reason');
            return;
        }
        if (this.selectedCity == undefined || this.selectedCity == '') {
            alert('Please select city');
            return;
        }
        if (this.income_source == '') {
            alert('Please enter other income source');
            return;
        }
        if (this.refer == '') {
            alert('Please select refer from');
            return;
        }
        if (this.bio == '') {
            alert('Please enter long bio');
            return;
        }

        let post = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            gender: this.gender,
            dob: this.dob.year + '-' + this.dob.month + '-' + this.dob.day,
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
        }

        console.log(post)

        this.apiService.postAPI(this.apiService.BASE_URL + 'user/insertAstrologer', post).then((result) => {
            if (result.status) {
                this.unselectAllTabs()
                this.thankyouTab = true;
            } else {
                alert(result.message);
            }
        }, (error) => {
            console.log(error);
        })

    }

}
