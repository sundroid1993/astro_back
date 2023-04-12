import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../service/api.service';
import {UtilService} from '../../service/util.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {ToastrService} from 'ngx-toastr';
import {EmitEvent, Events, EventService} from "../../service/event.service";

import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexGrid,
    ApexStroke,
    ApexTitleSubtitle,
    ApexXAxis,
    ChartComponent
} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
};


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    status: boolean = true;


    callCompleted = 0;
    chatCompleted = 0;
    avg_rating = 0;
    today_revenue = 0
    total_revenue = 0

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
                if(this.utilService.checkValue(result.result.calls)){
                    this.callCompleted = result.result.calls;
                }
                if(this.utilService.checkValue(result.result.chat)){
                    this.chatCompleted = result.result.chat;
                }
                if(this.utilService.checkValue(result.result.avgRating)){
                    this.avg_rating = result.result.avgRating;
                }
                if(this.utilService.checkValue(result.result.today_revenue)){
                    this.today_revenue = result.result.today_revenue;
                }
                if(this.utilService.checkValue(result.result.total_revenue)){
                    this.total_revenue = result.result.total_revenue;
                }

            } else {
                this.toaster.error(result.message)
            }
        }, (error) => {
            console.log(error);
            this.toaster.error("something went wrong")
        })
    }


    ngAfterViewInit() {
        this.apiService.getAPI(this.apiService.BASE_URL + 'common/getRevenueByMonthByAstroId/'+this.utilService.getUserID()).then((result) => {
            if (result.status) {
                let series = {
                    name: 'Revenue',
                    data: []
                }
                let categories = [];


                for (let item of result.result) {
                    series.data.push(Number(item.total).toFixed(0))
                    categories.push(item.month_name)
                }

                this.chartOptions={
                    series: [
                        series
                    ],
                    chart: {
                        height: 350,
                        // width: 100,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: true
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    title: {
                        text: '',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            // opacity: 0.5
                        }
                    },
                    xaxis: {
                        categories: categories
                    }

                }
                setTimeout(()=>{
                    window.dispatchEvent(new Event('resize'))
                },500)
            }
        })
    }


    public chartOptions: Partial<ChartOptions> = {
        series: [
            // {
            //     name: 'Orders',
            //     data: [1, 2, 3, 4, 5]
            // },
            // {
            //     name: 'Revenue',
            //     data: [5,4,3,2,1]
            // }
        ],
        chart: {
            height: 350,
            // width: 100,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: '',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                // opacity: 0.5
            }
        },
        xaxis: {
            categories: []
        }

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
