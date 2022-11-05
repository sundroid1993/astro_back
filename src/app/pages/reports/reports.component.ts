import {Component, OnInit} from '@angular/core';
import {UtilService} from "../../service/util.service";
import {ApiService} from "../../service/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

    Astrologers_tab: boolean = true;
    Broker_tab: boolean = false;
    Customer_tab: boolean = false;
    type = 0;

    selectedUser = [];
    dropdownSettings = {
        singleSelection: true,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: true
    };

    customers = [];

    onCustomerSelected() {
        setTimeout(() => {
            this.getOrders()
        }, 500)
    }

    onAstroSelected() {
        setTimeout(() => {
            this.getOrders()
        }, 500)
    }

    onDateChanged() {
        setTimeout(() => {
            this.getOrders()
        }, 500)
    }

    onTypeChanged() {
        setTimeout(() => {
            this.getOrders()
        }, 500)
    }

    async getCustomers() {
        let result = await this.apiService.getAPI(this.apiService.BASE_URL + 'user/getAstroCustomers/'+this.utilService.getUserID());
        if (result.status) {
            this.customers.push({
                id: 0,
                name: 'ALL'
            });
            for (let item of result.result) {
                this.customers = this.customers.concat({
                    id: item.id,
                    name: item.first_name + ' ' + item.last_name
                });
            }
            this.selectedUser = this.selectedUser.concat({
                id: 0,
                name: 'ALL'
            })
            // this.onCustomerSelected()
        } else {
            this.customers = [];
            // this.toaster.error('No users found');
        }
    }

    openAstrologerstab() {
        this.Astrologers_tab = true;
        this.Broker_tab = false;
        this.Customer_tab = false;
    }

    openBrokertab() {
        this.Astrologers_tab = false;
        this.Broker_tab = true;
        this.Customer_tab = false;
    }

    openCustomertab() {
        this.Astrologers_tab = false;
        this.Broker_tab = false;
        this.Customer_tab = true;
    }

    orders = [];
    from = '';
    to = '';
    status = -1;

    today = 0;
    yesterday = 0;
    week = 0;
    month = 0;
    year = 0

    p = 1;

    constructor(
        public utilService: UtilService,
        private apiService: ApiService,
        private modalService: NgbModal,
        private toaster: ToastrService,
        private datePipe: DatePipe
    ) {
        this.from = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.to = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }

    async ngOnInit() {
        await this.getCustomers()
        this.getOrders()
    }

    getOrders() {
        this.orders = [];
        this.apiService.postAPI(this.apiService.BASE_URL + 'order-history/getAstroOrders', {
            from: this.from + ' 00:00:00',
            to: this.to + ' 23:59:59',
            selectedUser: this.selectedUser[0].id,
            selectedAstro: this.utilService.getUserID(),
            type: this.type,
            status: this.status
        }).then((result) => {
            if (result.status) {
                this.orders = result.result;
            } else {
                this.orders = [];
                this.toaster.error('No orders found');
            }
        }, (error) => {
            this.orders = [];
            this.toaster.error(error.message);
        })
    }

    downloadReport() {
        this.apiService.postAPI(this.apiService.BASE_URL + 'report/downloadAstrologerReport', {
            from: this.from + ' 00:00:00',
            to: this.to + ' 23:59:59',
            selectedUser: this.selectedUser[0].id,
            selectedAstro: this.utilService.getUserID(),
            type: this.type,
            status: this.status
        }).then((result) => {
            if (result.status) {
                window.open(this.apiService.BASE_IMAGE_URL+result.result)
            } else {
                this.toaster.error('No orders found');
            }
        }, (error) => {
            this.toaster.error(error.message);
        })
    }

}
