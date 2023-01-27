import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../service/api.service';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../service/util.service';
import {DatePipe} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
    selector: 'app-user-kundli',
    templateUrl: './user-kundli.component.html',
    styleUrls: ['./user-kundli.component.scss']
})
export class UserKundliComponent implements OnInit {

    // @Input() fromNotifications: any;
    customerDetail: CustomerInterface = null;
    @Input() user_id;
    name = '';
    date_birth = '';
    time_birth = '';
    place = '';
    latitude;
    longitude;
    timezone = '';

    tithi = '';
    tatva = '';
    yog = '';
    nakshatra = '';
    sunrise = '';
    sunset = '';

    varna = '';
    vashya = '';
    yoni = '';
    gan = '';
    moon_Sign = '';
    sign_Lord = '';
    nakshatra_charan = '';
    karan = '';
    name_alphabet = '';
    paya = '';
    charan = '';

    ascendant = '';
    nadi = '';
    yunja = '';

    manglik_report = '';
    user_name = '';

    ascendant_zodiac = '';
    ascendant_report = '';

    lagnaSVG: SafeHtml = '';
    navmasaSVG: SafeHtml = '';
    divisionalSVG: SafeHtml = '';
    planetData = [];
    lagnaTab = 'sign';
    dashaTab = 'vim';

    Basic: boolean = false;
    Navamsa: boolean = false;
    Transit: boolean = false;
    Dasha: boolean = false;
    Planets: boolean = false;
    Divisional: boolean = false;
    Lagna: boolean = true;
    Life: boolean = false;

    Ascendant: boolean = false;
    Planetary: boolean = false;
    Manglik: boolean = false;
    Vimshottari: boolean = false;

    year;
    month;
    date;
    hour;
    min;
    sec;
    lat;
    lng;

    divisionalCharts = [];
    selectedDivisional = '';

    vimDasha = [];
    yogDasha = [];
    
    vim_major = null;
    vim_minor = null;
    vim_sub_minor = null;
    vim_sub_sub_minor = null;
    vim_sub_sub_sub_minor = null;

    planets = [{name: 'SUN', desc: ''}, {name: 'MOON', desc: ''}, {name: 'MARS', desc: ''}, {
        name: 'MERCURY',
        desc: ''
    }, {name: 'JUPITER', desc: ''}, {name: 'VENUS', desc: ''}, {name: 'SATURN', desc: ''}];

    selected_lang = 'hi';
    
    constructor(
        private modalService: NgbModal,
        private ngbActiveModal: NgbActiveModal,
        private activeModal: NgbActiveModal,
        public apiService: ApiService,
        private sanitizer: DomSanitizer,
        private toaster: ToastrService,
        private calendar: NgbCalendar,
        public utilService: UtilService,
        private datePipe: DatePipe
    ) {

    }

    ngOnInit(): void {
        console.log(this.customerDetail);
        if(this.utilService.getItem("selected_lang")=='hi'){
            this.selected_lang='hi';
        }else{
            this.selected_lang='en';
        }

        let url = this.apiService.BASE_URL + 'user/getUserDetailById'
        this.apiService.postAPI(url, {
            id: this.user_id
        }).then((result) => {
            if (result.status) {
                this.customerDetail = result.result;
                this.loadKundliProfile()
            } else {
                this.toaster.error('User profile not found');
            }
        }, (error) => {
            console.log(error);
        })
    }

    loadKundliProfile() {
        this.user_name = this.customerDetail.first_name + ' ' + this.customerDetail.last_name;
        this.date_birth = this.customerDetail.dob
        this.time_birth = this.customerDetail.tob;
        // this.place = profile.place;
        this.latitude = Number(this.customerDetail.lat);
        this.longitude = Number(this.customerDetail.lng);
        // this.place = profile.place;
        if (this.utilService.checkValue(this.customerDetail.cityDetail) && this.utilService.checkValue(this.customerDetail.stateDetail)) {
            this.place = this.customerDetail.cityDetail.name + ', ' + this.customerDetail.stateDetail.name;
        }
        this.lat = Number(this.customerDetail.lat);
        this.lng = Number(this.customerDetail.lng);

        console.log(this.customerDetail);
        console.log(this.latitude);
        console.log(this.longitude);

        // this.timezone = profile.timezone;

        let istDT: Date = new Date(this.customerDetail.dob + ' ' + this.customerDetail.tob);

        this.year = istDT.getFullYear();
        this.month = istDT.getMonth() + 1;
        this.date = istDT.getDate();
        this.hour = istDT.getHours();
        this.min = istDT.getMinutes();
        this.sec = istDT.getSeconds();

        this.getPlantInfo();

        this.divisionalCharts.push('Chalit');
        this.divisionalCharts.push('Sun');
        this.divisionalCharts.push('Moon');
        this.divisionalCharts.push('Hora (D-2)');
        this.divisionalCharts.push('Drekkana (D-3)');
        this.divisionalCharts.push('Chaturthamsa (D-4)');
        this.divisionalCharts.push('Saptamsa (D-7)');
        this.divisionalCharts.push('Dasamsa (D-10)');
        this.divisionalCharts.push('Dwadasamsa (D-12)');
        this.divisionalCharts.push('Shodasamsa (D-16)');
        this.divisionalCharts.push('Vimsamsa (D-20)');
        this.divisionalCharts.push('Chaturvimsamsa (D-24)');
        this.divisionalCharts.push('Trimsamsa (D-30)');
        this.divisionalCharts.push('Khavedamsa (D-40)');
        this.divisionalCharts.push('Akshavedamsa (D-45)');
        this.divisionalCharts.push('Shastiamsa (D-60)');

        this.selectedDivisional = 'Chalit';

        this.openBasic()
    }

    closeModal() {
        this.activeModal.close();
    }

    getBasicDetails() {
        this.apiService.postAPIWHeaders("https://json.astrologyapi.com/v1/astro_details", {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {

            this.ascendant = result.ascendant;
            this.varna = result.Varna;
            this.vashya = result.Vashya;
            this.yoni = result.Yoni;
            this.gan = result.Gan;
            this.nadi = result.Nadi;
            this.sign_Lord = result.SignLord;
            this.nakshatra = result.Naksahtra;
            this.nakshatra_charan = result.NaksahtraLord;
            this.name_alphabet = result.name_alphabet;
            this.charan = result.Charan;

            this.tithi = result.Tithi;
            this.yunja = result.yunja;
            this.karan = result.Karan;
            this.yog = result.Yog;
            this.paya = result.paya;
            this.tatva = result.tatva;

            // {
            //   "Varna": "Vaishya",
            //   "Vashya": "Chatuspad",
            //   "Yoni": "Sarp",
            //   "sign_lord": 5,
            //   "sign": "Taurus",
            //   "Naksahtra": "Rohini",
            //   "naksahtra_lord": "Moon",
            //   "nakshatra_charan": 3,
            //   "name_alphabet": "Vi"
            // }
        }, (error) => {
            console.log(error);
        })


        this.apiService.postAPIWHeaders("https://json.astrologyapi.com/v1/advanced_panchang/sunrise", {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {

            // this.aynanamsha = "";

            this.sunrise = result.sunrise;
            this.sunset = result.sunrise;
            // this.nadi = "";
            // this.yunja = "";
            // this.tatva = "";
            // this.paya = "";


            // {
            //   "Varna": "Vaishya",
            //   "Vashya": "Chatuspad",
            //   "Yoni": "Sarp",
            //   "sign_lord": 5,
            //   "sign": "Taurus",
            //   "Naksahtra": "Rohini",
            //   "naksahtra_lord": "Moon",
            //   "nakshatra_charan": 3,
            //   "name_alphabet": "Vi"
            // }
        }, (error) => {
            console.log(error);
        })
    }

    openDivisionalItem(item) {
        this.selectedDivisional = item;
        this.getChart()
    }

    falsevalue() {
        this.Transit = false;
        this.Dasha = false;
        this.Planets = false;
        this.Divisional = false;
        this.Lagna = false;
        this.Basic = false;
        this.Navamsa = false;
        this.Life = false;
    }

    falsevalue_() {
        this.Ascendant = false;
        this.Planetary = false;
        this.Manglik = false;
        this.Vimshottari = false;
    }

    openAscendant() {
        this.falsevalue_();
        this.Ascendant = true;
        this.getLifeReport();
    }

    openPlanetary() {
        this.falsevalue_();
        this.Planetary = true;
        this.getLifePlanetaryReport()
    }

    openManglik() {
        this.falsevalue_();
        this.Manglik = true;
        this.getManglikReport()
    }

    openVimshottari() {
        this.falsevalue_();
        this.Vimshottari = true;
    }

    openLife() {
        this.falsevalue();
        this.Life = true;
        // if (this.ascendant_report == '') {
        this.openAscendant()
        // }
    }

    openNavamsa() {
        this.falsevalue();
        this.Navamsa = true;
        this.getChart()
    }

    openBasic() {
        this.falsevalue();
        this.Basic = true;
        this.getBasicDetails()
    }

    openTransit() {
        this.falsevalue();
        this.Transit = true;
    }

    openDasha() {
        this.falsevalue();
        this.Dasha = true;
        // if (this.vimDasha.length == 0) {
        this.getVimDasha();
        // }
        // if (this.yogDasha.length == 0) {
        this.getYogDasha()
        // }
    }

    getVimDasha() {
        this.vimDasha = [];
        let url = "https://json.astrologyapi.com/v1/major_vdasha";
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            this.vimDasha = result;
        }, (error) => {
            console.log(error);
        })
    }

    getYogDasha() {
        this.yogDasha = [];
        let url = "https://json.astrologyapi.com/v1/major_yogini_dasha";
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            this.yogDasha = result;
        }, (error) => {
            console.log(error);
        })
    }

    openPlanets() {
        this.falsevalue();
        this.Planets = true;
    }

    openDivisional() {
        this.falsevalue();
        this.Divisional = true;
        this.getChart()
    }

    openLagna() {
        this.falsevalue();
        this.Lagna = true;
        this.getChart();
    }

    getPlantInfo() {
        this.planetData = [];
        let url = "https://json.astrologyapi.com/v1/planets";
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            this.planetData = result;
        }, (error) => {
            console.log(error);
        })
    }

    getChart() {
        let url = "https://json.astrologyapi.com/v1/horo_chart_image/D1";
        if (this.Lagna) {
            url = "https://json.astrologyapi.com/v1/horo_chart_image/D1";
        } else if (this.Navamsa) {
            url = "https://json.astrologyapi.com/v1/horo_chart_image/D9";
        } else if (this.Dasha) {
            url = "https://json.astrologyapi.com/v1/horo_chart_image/D10";
        } else if (this.Divisional) {
            if (this.selectedDivisional == "Chalit") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/chalit";
            } else if (this.selectedDivisional == "Sun") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/SUN";
            } else if (this.selectedDivisional == "Moon") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/MOON";
            } else if (this.selectedDivisional == "Hora (D-2)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D2";
            } else if (this.selectedDivisional == "Drekkana (D-3)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D3";
            } else if (this.selectedDivisional == "Chaturthamsa (D-4)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D4";
            } else if (this.selectedDivisional == "Saptamsa (D-7)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D7";
            } else if (this.selectedDivisional == "Dasamsa (D-10)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D10";
            } else if (this.selectedDivisional == "Dwadasamsa (D-12)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D12";
            } else if (this.selectedDivisional == "Shodasamsa (D-16)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D16";
            } else if (this.selectedDivisional == "Vimsamsa (D-20)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D20";
            } else if (this.selectedDivisional == "Chaturvimsamsa (D-24)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D24";
            } else if (this.selectedDivisional == "Trimsamsa (D-30)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D30";
            } else if (this.selectedDivisional == "Khavedamsa (D-40)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D40";
            } else if (this.selectedDivisional == "Akshavedamsa (D-45)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D45";
            } else if (this.selectedDivisional == "Shastiamsa (D-60)") {
                url = "https://json.astrologyapi.com/v1/horo_chart_image/D60";
            }
        }
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            // this.lagnaSVG = result.svg;
            if (this.Lagna) {
                this.lagnaSVG = this.sanitizer.bypassSecurityTrustHtml(result.svg);
            } else if (this.Navamsa) {
                this.navmasaSVG = this.sanitizer.bypassSecurityTrustHtml(result.svg);
            } else if (this.Divisional) {
                if (result.hasOwnProperty('svg')) {
                    this.divisionalSVG = this.sanitizer.bypassSecurityTrustHtml(result.svg);
                } else {
                    this.divisionalSVG = this.sanitizer.bypassSecurityTrustHtml(result);
                }
            }
        }, (error) => {
            console.log(error);
        })
    }

    changeLagnaTab(tabName: string) {
        this.lagnaTab = tabName;
    }

    changeDashaTab(tabName: string) {
        this.dashaTab = tabName;
    }

    getLifeReport() {
        // console.log(this.Ascendant)
        let url = "";
        if (this.Ascendant) {
            url = "https://json.astrologyapi.com/v1/general_ascendant_report";
        }
        if (url == '') {
            return;
        }
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            if (this.Ascendant) {
                this.ascendant_zodiac = result.asc_report.ascendant;
                this.ascendant_report = result.asc_report.report;
            }
        }, (error) => {
            console.log(error);
        })
        this.apiService.postAPIWHeaders("https://json.astrologyapi.com/v1/current_vdasha", {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            // if (this.Ascendant) {
            //   this.ascendant_zodiac = result.asc_report.ascendant;
            //   this.ascendant_report = result.asc_report.report;
            // }

            this.vim_major = result.major;
            this.vim_minor = result.minor;
            this.vim_sub_minor = result.sub_minor;
            this.vim_sub_sub_minor = result.sub_sub_minor;
            this.vim_sub_sub_sub_minor = result.sub_sub_sub_minor;

        }, (error) => {
            console.log(error);
        })
    }

    getLifePlanetaryReport() {
        for (let i = 0; i < this.planets.length; i++) {
            // if (this.planets[i].desc == '') {
            let url = "https://json.astrologyapi.com/v1/general_house_report/" + (this.planets[i].name).toLowerCase();
            this.apiService.postAPIWHeaders(url, {
                "day": this.date,
                "month": this.month,
                "year": this.year,
                "hour": this.hour,
                "min": this.min,
                lat: this.lat,
                lon: this.lng,
                tzone: 5.5,
                selected_lang:this.selected_lang
            }).then((result) => {
                this.planets[i].desc = result.house_report;
            }, (error) => {
                console.log(error);
            })
            // }
        }
    }

    getManglikReport() {
        // if (this.manglik_report == '') {
        let url = "https://json.astrologyapi.com/v1/manglik";
        this.apiService.postAPIWHeaders(url, {
            "day": this.date,
            "month": this.month,
            "year": this.year,
            "hour": this.hour,
            "min": this.min,
            lat: this.lat,
            lon: this.lng,
            tzone: 5.5,
            selected_lang:this.selected_lang
        }).then((result) => {
            this.manglik_report = result.manglik_report;
        }, (error) => {
            console.log(error);
        })
        // }
    }

    onLangChangeSelected() {
        this.utilService.setItem("selected_lang",this.selected_lang)
        this.ngOnInit()
    }
}

interface CustomerInterface {
    id;
    unique_id;
    first_name;
    last_name;
    email;
    phone;
    image;
    gender;
    dob;
    tob;
    latitude;
    longitude;
    address;
    city;
    state;
    country;
    type;
    status;
    login_otp;
    login_otp_valid;
    phone_change_otp;
    phone_change_otp_valid;
    free_secs;
    notifications;
    privacy;
    created_Date;
    firebase_id;
    last_online;
    deleted;
    Updated_By;
    Updated_Date;
    calls_done;
    chat_done;
    cityDetail?;
    stateDetail?;
    lat?;
    lng?;
}
