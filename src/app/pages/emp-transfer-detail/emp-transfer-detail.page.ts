import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { EmployeeTransferOtpComponent } from 'src/app/components/employee-transfer-otp/employee-transfer-otp.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-emp-transfer-detail',
  templateUrl: './emp-transfer-detail.page.html',
  styleUrls: ['./emp-transfer-detail.page.scss'],
})
export class EmpTransferDetailPage implements OnInit {
  routeValue:any;
  transter_info:any;
  enterprise_data:any = [];
  constructor(public loadingCtrl: LoadingController,private fileOpener: FileOpener,public db: DbService,private activatedRoute: ActivatedRoute,public modalCntrl: ModalController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      // this.routeValue = params.get('id'); // Get the 'route' value from the URL
      this.get_doc(params.get('id'))
    });
  }

  get_doc(id){
    let data = {
      name: id,
      doctype: 'Employee Transfers'
    }
    this.db.doc_detail(data).subscribe(res => {
      if(res.status == 'Success'){
        this.transter_info = res.message[1]
        // Parse enterprise_json if it exists
        if(this.transter_info && this.transter_info.enterprise_json) {
          try {
            const parsedData = JSON.parse(this.transter_info.enterprise_json);
            console.log('Enterprise Data:', parsedData);
            
            // Define the field mapping with proper display names
            const fieldMapping = {
              'company': 'Company',
              'sbu': 'SBU',
              'branch': 'Branch',
              'department': 'Department',
              'function': 'Function',
              'product': 'Product',
              'continent': 'Continent',
              'country': 'Country',
              'zone': 'Zone',
              'sub_zone': 'Sub Zone',
              'state': 'State',
              'state_bu': 'State BU',
              'region': 'Region',
              'area': 'Area',
              'band': 'Band',
              'grade': 'Grade',
              'functional_designation': 'Functional Designation',
              'sub_products': 'Sub Products'
            };
            
            // Convert object to array format with proper field names
            if(typeof parsedData === 'object' && parsedData !== null && !Array.isArray(parsedData)) {
              // Check if parsedData has enterprise_details property
              const dataSource = parsedData.enterprise_details || parsedData;
              
              this.enterprise_data = Object.keys(fieldMapping).map(key => {
                let value = dataSource[key] || '-';
                
                // Special handling for specific fields
                if (key === 'band' && parsedData.band_grade && Array.isArray(parsedData.band_grade)) {
                  value = parsedData.band_grade[0] || '-';
                } else if (key === 'grade' && parsedData.band_grade && Array.isArray(parsedData.band_grade)) {
                  value = parsedData.band_grade[1] || '-';
                } else if (key === 'sub_products' && parsedData.sub_products && Array.isArray(parsedData.sub_products)) {
                  value = parsedData.sub_products[0] || '-';
                } else if (key === 'functional_designation' && parsedData.functional_designation) {
                  value = parsedData.functional_designation || '-';
                }
                
                return {
                  field: fieldMapping[key],
                  value: value
                };
              }); // Show all fields, even if empty
            } else if(Array.isArray(parsedData)) {
              this.enterprise_data = parsedData;
            } else {
              this.enterprise_data = [];
            }
          } catch(e) {
            console.error('Error parsing enterprise_json:', e);
            this.enterprise_data = [];
          }
        }
      }
      // console.log(res)
    }, (error: any) => {
    
    })
  }

  async openOtp(){
    const modal = await this.modalCntrl.create({
      component: EmployeeTransferOtpComponent,
      cssClass: 'new-opt-form',
      componentProps: {
        transter_info: this.transter_info
      }
    });
    await modal.present();
    const val = await modal.onWillDismiss();
      // console.log(val)
      if(val && val.data){
        this.transter_info.aadhaar_verified = val.data
      }
  }

  async downloadAndOpenPDF(item,type){
    try {
      let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
      await loader.present();
      setTimeout(() => {
        loader.dismiss();
      }, 10000);
      let data={
        doc_name:item.name,
        emp_id:item.employee
      }
      this.db.transfer_download(data,type).subscribe(async res => {
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
        // alert('success')
      })
      .catch(err => {
        alert('Failed')
        console.error('Error opening PDF', err)
      });
  }

}
