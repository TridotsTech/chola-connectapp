import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DbService } from '../../services/db.service';
import { LeaveTypeComponent } from 'src/app/components/leaves-module/leave-type/leave-type.component';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {

  @ViewChild('file_upload', { static: false }) file_upload: ElementRef | undefined;
  select_item:any;
  constructor(public loadingCtrl:LoadingController,public db:DbService,public modalCntrl:ModalController) { }

  ngOnInit() {

  }

  async createNew() {
    const modal = await this.modalCntrl.create({
      component: LeaveTypeComponent,
      cssClass: this.db.ismobile ? 'job-detail-popup' : 'filter-popup',
      componentProps: {
        title: 'Select Document',
        type: 'document',
        datas: 'BGV Required Document' 
      },
    });
    await modal.present();
    const val = await modal.onWillDismiss();
      if(val && val.data && val.role){
        console.log(val)
        this.get_emp_info('New',val.data.name)
      }
    }

    upload_image(item){
      this.select_item = item;
      if (this.file_upload) {
        this.file_upload.nativeElement.click();
      }
    }

  async get_emp_info(type,doc){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    let doc_array:any =[];
    this.db.employee_img.custom_document_detail.map(res =>{
      doc_array.push({name:res.name, document_name:res.document_name,document:res.document})
    })
    if(type == 'New')
    {
      doc_array.push({document_name:doc})
    }
    let data = {
      name: localStorage['employee_id'],
      employee:localStorage['employee_id'],
      doctype:'Employee',
      custom_document_detail:doc_array
    };

    this.db.inset_docs({data:data}).subscribe(res => {
       this.file_url = ''
       setTimeout(()=>{
        loader.dismiss();
       },1000)
      if (res && res.message && res.message.status == 'Success') {  
        if(res.message.data && res.message.data.name)
          this.db.employee_img = res.message.data
          this.db.sendSuccessMessage("Document updated successfully!")
      }else{
        if(res._server_messages){
          let d = JSON.parse(res._server_messages)
          let f = JSON.parse(d[0])
          this.db.sendErrorMessage(f.message)
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      }
    })
  }

  categoryfile:any;
  categoryimagedata:any;
  file_url:any;

  onFileChange($event: any): void {
    this.readThis($event.target);
  }

  async readThis(inputValue: any): Promise<void> {
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    if (inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size;
      this.categoryfile = file.name;
      var myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {
        this.categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: this.categoryfile,
          content: this.categoryimagedata,
          decode: 'True',
        };

        if (file_size <= 10000000) {
          //10Mb in BYtes

          this.db.upload_image(img_data).subscribe(
            (res: any) => {
             
              if(res && res.data && res.data.name){
                this.file_url = res.data.file_url;
                let check = this.db.employee_img.custom_document_detail.find(res => res.name == this.select_item.name)
                if(check && this.file_url)
                {
                  check.document = this.file_url
                  this.get_emp_info('','');
                }
                // setTimeout(() =>{
                  loader.dismiss();
                // },2000)
                
              }
             
            },
            (error: any) => {
              loader.dismiss();
            }
          );
        } else if (file_size > 10000000) {
          loader.dismiss();
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          loader.dismiss();
        }
      };
      myReader.readAsDataURL(file);
    }
    else 
      loader.dismiss();
  }

}
