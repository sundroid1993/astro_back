import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popupalert',
  templateUrl: './popupalert.component.html',
  styleUrls: ['./popupalert.component.css']
})
export class PopupalertComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close()
  }

}
