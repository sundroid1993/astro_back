import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

    @Input() terms = false

    constructor(private ngbActiveModal: NgbActiveModal) {
    }

    ngOnInit(): void {
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
}
