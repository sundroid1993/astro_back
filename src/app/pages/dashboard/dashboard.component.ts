import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {UtilService} from '../../service/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {EmitEvent, Events, EventService} from "../../service/event.service";


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    status: boolean = true;


    callCompleted = 0;
    chatCompleted = 1;

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
        private toaster: ToastrService,
        private eventService: EventService
    ) {
    }

    ngOnInit() {
        // this.status = this.utilService.getAstroStatus()
        // this.chartOptions.series[0].data = [];
        // this.chartOptions.series[1].data = [];
        // this.chartOptions.xaxis.categories = [];

        // this.chartOptions.xaxis.categories = ['2021-10', '2021-11', '2021-12', '2022-1']

        this.apiService.postAPI(this.apiService.BASE_URL + "astrologer/getAstroDashboardDetail", {
            astro_id: this.utilService.getUserID()
        }).then((result) => {
            if (result.status) {
                // chatRequest.request=result.result;
                this.callCompleted = result.result.calls;
                this.chatCompleted = result.result.chat;
            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
            this.toaster.error("something went wrong")
        })
    }


    ngAfterViewInit() {
    }

    onStatusChange() {
        console.log(this.status);
        if (this.status) {
            this.utilService.setItem(this.utilService.ASTRO_STATUS, '1')
        } else {
            this.utilService.setItem(this.utilService.ASTRO_STATUS, '0')
        }
        this.eventService.emit(new EmitEvent(Events.USER_STATUS_CHANGE, ''));
    }

}
