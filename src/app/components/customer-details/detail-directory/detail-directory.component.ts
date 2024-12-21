import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerPage } from 'src/app/pages/Go1-onsite/pdf-viewer/PdfViewerPage';

@Component({
  selector: 'app-detail-directory',
  templateUrl: './detail-directory.component.html',
  styleUrls: ['./detail-directory.component.scss'],
})
export class DetailDirectoryComponent  implements OnInit {

  @Input() employeeDetail:any;
  @Input() doctype:any;

  constructor(public db:DbService, private modalCtrl: ModalController, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    if(this.doctype){
      this.getDetail()
    }
  }


  getDetail(){
    let data = {
      doctype: this.doctype,
      name: this.employeeDetail.name
    }
    this.db.doc_detail(data).subscribe(res => {
      if(res && res.message && res.message.length != 0){
        this.employeeDetail = res.message[1]
      }
    })
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  getDateDifference(startDate: Date) {
    const endDate = new Date(); // Current date

    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDiff = end.getFullYear() - start.getFullYear();
    let monthsDiff = end.getMonth() - start.getMonth();

    // Adjusting months and years if necessary
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    return `${yearsDiff} yr, ${monthsDiff} m`;
  }

  social(type,data){
    
    if(type == 'mail'){
      const emailLink = 'mailto:' + data;
      const element = document.createElement('a');
      element.setAttribute('href', emailLink);
      element.click();
    }else if(type == 'call'){
      let number = 'tel:' + data;
      let element = document.createElement('a');
      element.setAttribute('href', number);
      element.click();
    }else if(type == 'whatsapp'){
      let url = `https://api.whatsapp.com/send?phone=${data}`;
      window.open(url, '_system');
    }
  }


  openUrl(url){
    if(url){
      url = this.db.product_img(url);
      if(url.includes('pdf')){
       this.openPDF(url);
      }else{
        window.open(url, '_blank');
      }
    }
  }

  async openPDF(pdfUrl) {
   const ismodal = await this.modalCtrl.create({
      component: PdfViewerPage,
      // show-image
      cssClass: this.db.ismobile ? '' : 'web_site_form',
      componentProps: {
        image: pdfUrl,
        modalView:true
      },
      enterAnimation: this.db.enterAnimation,
          leaveAnimation:this.db.leaveAnimation,
    });
    await ismodal.present();
  }

}
