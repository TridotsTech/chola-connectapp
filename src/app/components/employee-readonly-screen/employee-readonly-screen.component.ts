import { Component, OnInit, OnChanges, SimpleChanges, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-readonly-screen',
  templateUrl: './employee-readonly-screen.component.html',
  styleUrls: ['./employee-readonly-screen.component.scss'],
})
export class EmployeeReadonlyScreenComponent  implements OnInit {

  @Input() employeeDetail:any;
  @Input() doctype:any;

  constructor(public db:DbService, private modalCtrl: ModalController, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    // let url = this.db.product_img(this.employeeDetail.resume_link)
    // this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  // ngAfterViewInit() {
  //   const contentElement = this.modalContent.nativeElement;

  //   contentElement.addEventListener('ionGesture', (ev) => {
  //     if (ev.detail.type === 'pan' && ev.detail.direction === 'y' && ev.detail.deltaY > 100) {
  //       this.dismissModal();
  //     }

  //   });



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
      let num = '91' + data
      let url = `https://api.whatsapp.com/send?phone=${num}`;
      window.open(url, '_system');
    }
  }

  checkImages(data, type) {
    switch (data) {
      case "Total Leaves":
        return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
        break;
      case "All Applications":
        return type == "color" ? '#5461FF' : type == "class" ? 'color_1' : "/assets/leaves/calendar-purple.svg"
        break;
      case "Used Leaves":
        return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
        break;
      case "Open Applications":
        return type == "color" ? '#E08700' : type == "class" ? 'color_2' : "/assets/leaves/calendar-yellow.svg"
        break;
      case "Available Leaves":
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
        break;
      case "Approved Applications":
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
        break;
      case "Expired Leaves":
        return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
        break;
      case "Rejected Applications":
        return type == "color" ? '#C01212' : type == "class" ? 'color_4' : "/assets/leaves/calendar-red.svg"
        break;
      default:
        return type == "color" ? '#458F5A' : type == "class" ? 'color_3' : "/assets/leaves/calendar-green.svg"
    }
  }

  
}
