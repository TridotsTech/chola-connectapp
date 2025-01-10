import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-letter-request-detail',
  templateUrl: './letter-request-detail.component.html',
  styleUrls: ['./letter-request-detail.component.scss'],
})

export class LetterRequestDetailComponent  implements OnInit {
  @Input() letterrequestDetail;
  constructor(public loadingCtrl: LoadingController,private fileOpener: FileOpener,public db: DbService) { }

  ngOnInit() {
    this.get_employee_l_r_detail()
    // console.log(this.letterrequestDetail)
  }

  get_employee_l_r_detail() {
    let data = {
      name: this.letterrequestDetail.name,
      doctype: 'Employee Letter Request'
    }
    this.db.doc_detail(data).subscribe(res => {
      if (res && res.message && res.message[0].status == 'Success') {
        res.message[1]['user_image'] = res.message[1]['image'] ? res.message[1]['image'] : undefined;
        this.letterrequestDetail = res.message[1]
      }
    })
  }

  async downloadAndOpenPDF(item){
    try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss();
      }, 10000);
      let data={
        doc_name:item.name,
        emp_id:item.employee_id,
        letter_type:item.letter_type
      }
      this.db.employee_letter_request_download(data).subscribe(async res => {
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
    // const filePath = this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory;
    const base64Data = await this.convertBlobToBase64(blob);
    // console.log(base64Data,'base64')
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
      encoding: Encoding.Base64,
    });
    // console.log(savedFile,'save')
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
        alert('success')
      })
      .catch(err => {
        alert('Failed')
        console.error('Error opening PDF', err)
      });
  }

}
