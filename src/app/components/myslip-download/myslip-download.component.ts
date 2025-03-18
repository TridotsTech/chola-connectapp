import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LeaveTypeComponent } from '../leaves-module/leave-type/leave-type.component';

@Component({
  selector: 'app-myslip-download',
  templateUrl: './myslip-download.component.html',
  styleUrls: ['./myslip-download.component.scss'],
})
export class MyslipDownloadComponent  implements OnInit {
  @Input() title;
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  month:any;
  year:any;
  constructor(public modalCtrl: ModalController,public db:DbService,public alertController:AlertController,public loadingCtrl: LoadingController,private fileOpener: FileOpener) { }

  ngOnInit() {
    this.db.selectedYearSubject.subscribe((res) => {
        console.log(res)
        this.year = this.db.selectedYear;
    })
  }

  async open_dropdown(type){
    const modal = await this.modalCtrl.create({
        component: LeaveTypeComponent,
        cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
        componentProps: {
          title: type == 'month' ? 'Month':'Year',
          type:type ,
          value:this.monthNames
        },
      });
      await modal.present();
      const val = await modal.onWillDismiss();
      console.log(val)
      if(val && val.data){
        type == 'month' ? this.month = val.data : ''
      }
  }

  async download(){
    if(this.title == 'Salary Slip')
      this.payroll_download()
  }

  async payroll_download(){
    try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss();
      }, 10000);
      this.db.get_salary_slip_content({filters:{'salary_slip_select_year': parseInt(this.year), 'salary_slip_select_month': this.month, 'employee':localStorage['employee_id'], 'doctype': 'Salary Slip'}}).subscribe(async res => {
        if (res && res.message.fname && res.message.fcontent) {
        const fileContent = res.message.fcontent;
        const fileName = res.message.fname
        const pdfBlob = new Blob([new Uint8Array(fileContent)], { type: "application/pdf" });
        const filePath = await this.saveFileToDevice(pdfBlob, fileName);
        await this.openFile(filePath);
        setTimeout(() => {
          loader.dismiss();
        }, 4500);
    } else {
      this.db.alert('No Further Records')
      setTimeout(() => {
        loader.dismiss();
      }, 450);
    }

    }, error => {
      console.error(error)
    })
    } catch (error) {
      console.error('Error downloading or opening PDF file', error);
    }
  }

  async saveFileToDevice(blob: Blob, fileName: string): Promise<string> {
    const base64Data = await this.convertBlobToBase64(blob);
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
      encoding: Encoding.Base64,
    });
    return savedFile.uri;  // Return the file URI for later use
  }

  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  async openFile(filePath: string) {
    this.fileOpener.open(filePath, 'application/pdf')
      .then(() => {
        // alert('success')
      })
      .catch(err => {
        alert('Failed')
        console.error('Error opening PDF', err)
      });
  }

}
