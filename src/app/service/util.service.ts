import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
    ) {
    }

    USER_PROFILE = "USER_PROFILE";
    USER_LOGIN = "USER_LOGIN";
    DEVICE_TOKEN = "DEVICE_TOKEN";
    ON_BOARDING = "ON_BOARDING";

    DEFAULT_IMAGE = 'assets/img/default_profile.png';

    printObj(obj) {
        console.log('obj:-' + JSON.stringify(obj));
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
        return window.localStorage.getItem("ASTRO_" + key);
    }

    setItem(key, value) {
        window.localStorage.setItem("ASTRO_" + key, value);
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
}
