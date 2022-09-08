import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'app/service/api.service';
import { UtilService } from 'app/service/util.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  pendingOrders = [];

  selectedDate: NgbDateStruct;
  date: { year: number, month: number };

  fromDate;
  toDate;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private router: Router,
    public utilService: UtilService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
