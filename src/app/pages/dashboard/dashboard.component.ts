import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { UtilService } from '../../service/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';



@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    public canvas: any;
    public ctx;
    public chartColor;
    public chartEmail;
    public chartHours;
    chefContent: boolean = false;
    adminContent: boolean = false;
    revenue = 0;
    profile_rating = '';
    total_orders = 0;
    foodItemsCount = '0';
    adminTotalOrders = 0;
    adminTotalRevenue = 0;
    adminMonthRevenue = 0;
    adminTotalChefs = 0;


    // public chartOptions: Partial<ChartOptions>;

    constructor(
        private apiService: ApiService,
        private modalService: NgbModal,
        private router: Router,
        public utilService: UtilService,
        private toaster: ToastrService
    ) {
    }

    ngOnInit() {
        // this.chartOptions.series[0].data = [];
        // this.chartOptions.series[1].data = [];
        // this.chartOptions.xaxis.categories = [];

        // this.chartOptions.xaxis.categories = ['2021-10', '2021-11', '2021-12', '2022-1']
    }


    ngAfterViewInit() {
    }

}
