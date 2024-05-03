import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from 'app/service/api.service';
import { UtilService } from 'app/service/util.service';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

    @Input() terms = false
    terms_cond = ''

    constructor(private ngbActiveModal: NgbActiveModal, private apiService: ApiService, private utilService: UtilService) {
    }

    ngOnInit(): void {
        this.getAllCMS();
    }

    close(status) {
        this.ngbActiveModal.close({
            status: status
        });
    }

    cancel() {
        this.ngbActiveModal.close({
            status: this.terms
        })
    }

    getAllCMS() {
        this.apiService.getAPI(this.apiService.BASE_URL + 'cms/getAllCMS').then((result) => {
            if (result.status) {
                for (let item of result.result) {
                    if (item.page == 'ASTRO_TERMS') {
                        this.terms_cond = atob(item.data);
                    }
                }

                console.log(this.terms);

            }
        }, (error) => {
            console.log(error);
        })
    }
}
