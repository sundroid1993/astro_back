import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit {

  pdf;

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  selectpdf(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.pdf = file
    }
  }

  close() {
    this.activeModal.close()
  }

}
