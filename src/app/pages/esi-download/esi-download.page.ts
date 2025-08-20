import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-esi-download',
  templateUrl: './esi-download.page.html',
  styleUrls: ['./esi-download.page.scss'],
})
export class EsiDownloadPage implements OnInit {
  
  Is_esi:any;
  constructor(private fileOpener: FileOpener,public db: DbService,public alertController:AlertController,public loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.get_esi_flag()
    
  }

  async downloadESI(type){
    try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss();
      }, 10000);
      this.db.get_insurance_esic_card({employee_id:localStorage['employee_id'],card_type:type}).subscribe(async res => {
        if (res && res.message.status && res.message.status == 'Success') {
        // const fileContent = res.message.fcontent;
        const fileName = res.message.filename
        // const pdfBlob = new Blob([new Uint8Array(fileContent)], { type: "application/pdf" });
        const filePath = await this.saveFileToDevice(res.message.base64_pdf,fileName);
        await this.openFile(filePath);
        setTimeout(() => {
          loader.dismiss();
        }, 4500);
    } 
    else if(res.status == "Failed"){
      this.db.alert(res.message)
      setTimeout(() => {
        loader.dismiss();
      }, 450);
    }
    else {
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

  async saveFileToDevice(base64, fileName: string): Promise<string> {
    // const base64Data = await this.convertBlobToBase64(blob);
    const base64Data = base64;
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

  get_esi_flag() {
    let data = {
      employee_id: localStorage['employee_id'],
    }
    this.db.get_esi_flag(data).subscribe(res => {
      this.Is_esi = res.message
      // if(res.)
      // if(res.message.status != 'failed')
        // this.car_request = res.message
      // console.log(res)
    })
  }

}
