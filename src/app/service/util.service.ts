import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {


    constructor() {
    }

    USER_PROFILE = "USER_PROFILE";
    USER_LOGIN = "USER_LOGIN";
    DEVICE_TOKEN = "DEVICE_TOKEN";
    ON_BOARDING = "ON_BOARDING";

    DEFAULT_IMAGE = 'assets/img/default_profile.png';
    DEFAULT_BANNER = 'assets/img/default_banner.png';
    ASTRO_STATUS = 'ASTRO_STATUS';


    printObj(obj) {
        console.log('obj:-' + JSON.stringify(obj));
    }

    isUserLoggedIn() {
        if (this.getItem(this.USER_LOGIN) != null && this.getItem(this.USER_LOGIN) != undefined && this.getItem(this.USER_LOGIN) == '1') {
            return true;
        } else {
            return false;
        }
    }

    getAstroStatus() {
        if (this.getItem(this.ASTRO_STATUS) != null && this.getItem(this.ASTRO_STATUS) != undefined) {
            if (this.getItem(this.ASTRO_STATUS) == '1') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    getUserProfile() {
        if (this.getItem(this.USER_PROFILE) != null && this.getItem(this.USER_PROFILE) != undefined && this.getItem(this.USER_PROFILE) != '' && this.getItem(this.USER_PROFILE) != 'null') {
            let profile = JSON.parse(this.getItem(this.USER_PROFILE));
            return profile;
        } else {
            return null;
        }
    }

    getUserID() {
        if (this.getItem(this.USER_PROFILE) != null && this.getItem(this.USER_PROFILE) != undefined && this.getItem(this.USER_PROFILE) != '' && this.getItem(this.USER_PROFILE) != 'null') {
            let profile = JSON.parse(this.getItem(this.USER_PROFILE));
            return profile.id;
        } else {
            return "";
        }
    }

    getUserEmail() {
        if (this.getItem(this.USER_PROFILE) != null && this.getItem(this.USER_PROFILE) != undefined && this.getItem(this.USER_PROFILE) != '' && this.getItem(this.USER_PROFILE) != 'null') {
            let profile = JSON.parse(this.getItem(this.USER_PROFILE));
            return profile.email;
        } else {
            return "";
        }
    }


    getItem(key) {
        return window.sessionStorage.getItem("ASTRO_DASH_" + key);
    }

    setItem(key, value) {
        window.sessionStorage.setItem("ASTRO_DASH_" + key, value);
    }

    clearALLData() {
        window.localStorage.clear();
    }

    getTimerTimeLeft(millis) {
        // let secs = time / 1000;
        // let timeleft = (secs / 60) + ':' + (secs % 60);
        // return timeleft;
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return ((Number(minutes) < 10) ? '0' : '') + minutes + ':' + ((Number(seconds) < 10) ? '0' : '') + seconds;
    }

    checkValue(value) {
        if (value != null && value != undefined && value != '') {
            return true;
        } else {
            return false;
        }
    }

    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        let time='';
        if(h>0){
            time+=h+"hr ";
        }
        if(m>0){
            time+=m+"min ";
        }
        if(s>0){
            time+=s+"sec";
        }

        return time;
    }
}
