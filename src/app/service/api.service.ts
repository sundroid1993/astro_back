import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    BASE_URL = 'http://localhost:3000/';
    BASE_IMAGE_URL = 'http://localhost/astro-api';
    IMAGE_BASE_URL = 'http://localhost/astro-api/';

    // BASE_URL = 'http://34.131.210.116:3000/';
    // BASE_IMAGE_URL = 'http://34.131.210.116/astro-api';
    // PROFILE_BASE_IMAGE_URL = 'http://34.131.210.116/astro-api/';

    constructor(private http: HttpClient) {

    }

    getAPI(url): Promise<any> {

        console.log('url:-' + url);
        return new Promise((resolve, reject) => {
            this.http.get(url).subscribe(result => {
                // loading.dismiss();
                try {
                    // console.log('data:-' + JSON.stringify(result, null, 4));
                    var parsedJSON = JSON.parse(JSON.stringify(result));
                    resolve(parsedJSON);
                } catch (err) {
                    reject(err);
                }
            }, error => {
                // loading.dismiss();
                console.log('API Error', JSON.stringify(error, null, 4));
                error = JSON.parse(JSON.stringify(error));
                reject(error);
            });
        });
    }

    deleteAPI(url): Promise<any> {

        console.log('url:-' + url);
        return new Promise((resolve, reject) => {
            this.http.delete(url).subscribe(result => {
                // loading.dismiss();
                try {
                    // console.log('data:-' + JSON.stringify(result, null, 4));
                    var parsedJSON = JSON.parse(JSON.stringify(result));
                    resolve(parsedJSON);
                } catch (err) {
                    reject(err);
                }
            }, error => {
                // loading.dismiss();
                console.log('API Error', JSON.stringify(error, null, 4));
                error = JSON.parse(JSON.stringify(error));
                reject(error);
            });
        });
    }

    postAPI(url, postData): Promise<any> {
        console.log('url:-' + url);
        console.log('postData:-' + JSON.stringify(postData, null, 4));

        return new Promise((resolve, reject) => {
            this.http.post(url, postData).subscribe(result => {
                // loading.dismiss();
                try {
                    // console.log('data:-' + JSON.stringify(result, null, 4));
                    var parsedJSON = JSON.parse(JSON.stringify(result));
                    resolve(parsedJSON);
                } catch (err) {
                    reject(err);
                }
            }, error => {
                // loading.dismiss();
                console.log('API Error', JSON.stringify(error, null, 4));
                error = JSON.parse(JSON.stringify(error));
                reject(error);
            });
        });
    }

    putAPI(url, postData): Promise<any> {
        console.log('url:-' + url);
        console.log('postData:-' + JSON.stringify(postData, null, 4));


        return new Promise((resolve, reject) => {
            this.http.put(url, postData).subscribe(result => {
                // loading.dismiss();
                try {
                    // console.log('data:-' + JSON.stringify(result, null, 4));
                    var parsedJSON = JSON.parse(JSON.stringify(result));
                    resolve(parsedJSON);
                } catch (err) {
                    reject(err);
                }
            }, error => {
                // loading.dismiss();
                console.log('API Error', JSON.stringify(error, null, 4));
                error = JSON.parse(JSON.stringify(error));
                reject(error);
            });
        });
    }

}
