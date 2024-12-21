import { Component, ElementRef, Input, OnInit, ViewChild, Output } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import {
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular';
@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.scss'],
})
export class ShowImageComponent  implements OnInit {
@Input() image : any
@Input() delete_btn : any
finalImage: any;
gallerySettings = {
  thumbnail: true,
  animateThumb: false,
  showThumbByDefault: false,
};
  constructor( public modalCtrl: ModalController,public db : DbService) { }

  ngOnInit() {
    const imageUrl = this.image;
    this.product_img(imageUrl);
  }

  product_img(data: any) {
    // console.log(data)
    if (data) {
      if (data.indexOf('http') == -1) {
        return this.db.baseUrl + data;
      } else if (data.indexOf('http') == 0) {
        return data
      }
    }
  }

  @ViewChild('zoomImage', { static: false }) zoomImage: ElementRef | any;

  zoomIn() {
    this.zoomImage.nativeElement.style.transform = 'scale(1.2)'; // Increase the scale factor as needed
  }

  zoomOut() {
    this.zoomImage.nativeElement.style.transform = 'scale(0.8)'; // Decrease the scale factor as needed
  }

  delete_img(){
    this.modalCtrl.dismiss('delete')
  }

}
