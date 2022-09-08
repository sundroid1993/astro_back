import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddReportComponent } from 'app/modals/add-report/add-report.component';

@Component({
  selector: 'app-conductedchatscalls',
  templateUrl: './conductedchatscalls.component.html',
  styleUrls: ['./conductedchatscalls.component.css']
})
export class ConductedchatscallsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openclient() {
    const modalRef = this.modalService.open(AddReportComponent, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false,
      centered: true
    });
    modalRef.result.then((result) => {
      console.log('dismissed:-' + JSON.stringify(result));
    })
  }

}
