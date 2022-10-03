import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-image-info-modal',
  templateUrl: './image-info-modal.component.html',
  styleUrls: ['./image-info-modal.component.scss']
})
export class ImageInfoModalComponent implements OnInit {

  constructor(
      private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close()
  }

}
