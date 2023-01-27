import {Component, Input, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from "../../service/api.service";
import {UtilService} from "../../service/util.service";

@Component({
    selector: 'app-crop-image',
    templateUrl: './crop-image.component.html',
    styleUrls: ['./crop-image.component.css']
})
export class CropImageComponent implements OnInit {

    @Input() ratio = 2.5 / 1;
    @Input() width = 256;
    @Input() maintainAspectRatio = false;

    constructor(
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private apiService: ApiService,
        public utilService: UtilService,
        private toaster: ToastrService
    ) {
    }

    ngOnInit(): void {
        console.log("ratio:-" + this.ratio)
        console.log("width:-" + this.width)
    }

    imageChangedEvent: any = '';
    croppedImage: any = '';

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    imageLoaded() {
        /* show cropper */
    }

    cropperReady() {
        /* cropper ready */
    }

    loadImageFailed() {
        /* show message */
    }

    submitFile() {
        // console.log('cropped image:-' + this.croppedImage);
        if (this.croppedImage == null || this.croppedImage == undefined || this.croppedImage == '') {
            this.toaster.error('Please crop Image')
        }
        this.activeModal.close({
            image: this.croppedImage
        })
    }

    cancel() {
        this.activeModal.close();
    }
}
