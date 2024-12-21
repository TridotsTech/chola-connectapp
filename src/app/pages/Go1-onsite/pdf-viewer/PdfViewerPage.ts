import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.page.html',
  styleUrls: ['./pdf-viewer.page.scss'],
})
export class PdfViewerPage implements OnInit {

  @Input() image: any;
  @Input() modalView: any;
  
  constructor(public sanitaize: DomSanitizer, public modal: ModalController, public db: DbService) { }

  ngOnInit() {
    // console.log(this.image);
    this.sanitize_url(this.image);
  }

  safe_url() {
    return this.sanitaize.bypassSecurityTrustResourceUrl(this.image);
  }

  ionViewWillEnter() {
    this.sanitize_url(this.image);
  }

  sanitize_url(data) {
    if (data) {
      let urlData = this.db.product_img(data)
      const url = 'https://docs.google.com/gview?url=' + urlData  + '&embedded=true#toolbar=0&view=FitH&scrollbar=1';
      // Log the URL for debugging purposes
      // console.log(url);
      return this.sanitaize.bypassSecurityTrustResourceUrl(url);
    }
  }

  onIframeLoad() {
    // console.log('Iframe loaded successfully');
  }
  
  onIframeError(event) {
    // console.error('Iframe error:', event);
  }

  downloadpdf(pdf) {
    window.open(this.db.product_img(pdf), '_blank');
  }

}
