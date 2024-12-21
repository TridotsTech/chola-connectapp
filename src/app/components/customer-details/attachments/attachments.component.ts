import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { ShowImageComponent } from '../../show-image/show-image.component';
import { UserListPage } from 'src/app/pages/user-list/user-list.page';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent  implements OnInit {

  categoryfile: any;
  categoryimagedata: any;
  image_field_check = "no uploads";
  image_count: any = [];
  image_datas: any
  image:any;
  each:any;
  post_image : any;
  multiple_array : any = [];

  @Input() order_id:any;
  @Input() doctype:any;

  constructor(public db:DbService,public modalCtrl: ModalController,private alertCtrl : AlertController) { }

  ngOnInit() {
    this.get_image_list();
    this.get_assigned_list();
  }

  get_image_list(){
    let data = {
      doctype : "File",
      fields: ["file_url","name"],
      filters : {
        attached_to_doctype: this.doctype,
        attached_to_name: this.order_id
    }
    }
    this.db.get_list(data).subscribe(res =>{
      // console.log(res)
      res.message.map(res => {
        this.multiple_array.push(res)
      })
    })
  }

  get_assigned_list(){
    let data = {
      doctype : "ToDo",
      fields: ["allocated_to"],
      filters : {
        reference_type: this.doctype,
        reference_name: this.order_id,
        status: 'Open'
    }
    }
    this.db.get_list(data).subscribe(res =>{
      if(res && res.message){
          this.db.selected_mail = res.message;
      }
    })
  }

  remove_email(i){
    // let data = {
    //   assign_to: email,
    //   doctype: this.doctype,
    //   name: this.order_id,
    //   action:"remove"
    // }

    let selected_emails:any = [];
    this.db.selected_mail.splice(i,1);
    this.db.selected_mail.map((res:any)=>{ selected_emails.push(res.email_id)})

    let data = {
      assign_to: selected_emails,
      doctype: this.doctype,
      // doctype: localStorage['docType'],
      name: this.order_id,
      // descriptions: this.description
    }

    this.db.assigned_to(data).subscribe(res =>{
      if(res && res.status == 'Failed'){
        var d = JSON.parse(res._server_messages);
        var d1 = JSON.parse(d);
        this.db.alert(d1.message);
      }else{
        // this.modalCtrl.dismiss();
        this.db.sendErrorMessage('Deleted Successfully');
        this.get_assigned_list();
        // console.log(res)
      }
    })    
  }

  changeListener($event: any, each: any): void {
    // this.image_count.push(each.fieldname);
    this.image_field_check = "false";
    // this.readThis($event.target, each);
    this.base64($event.target, each);
  }

  async base64(inputValue: any, each): Promise<void> {

    // let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    // await loader.present();

    if (inputValue.files && inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size
      this.categoryfile = file.name
      var myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {

        this.categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: this.categoryfile,
          content: this.categoryimagedata,
          // decode: "True",
        }

        let array_image:any = []
        array_image.push(img_data)
        this.post_image = array_image
        // console.log(this.post_image);
        this.image_datas = img_data
        
        // console.log(this.image_datas);

        if (file_size <= 10000000) {  //10Mb in BYtes

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          }
          this.multiple_array.splice(0, 0, img_data);
          // console.log(this.multiple_array)
         
        } else if (file_size > 10000000) { //10Mb in bytes
          // loader.dismiss()
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          // loader.dismiss()
        }
        this.upload_file(img_data);
      }
      myReader.readAsDataURL(file);
    }
    
  }

 async remove_img(imgs,type){
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: 'Are you sure do you want to Delete..?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'Ok',
          handler: () => {
            if(type == 'email'){
              this.remove_email(imgs)
            }else if(type == 'image'){
              this.delete(imgs)
            }
          }
        }
      ]
    })
    await alert.present();
    
  }

  delete(imgs){
    let data = {
      doctype: "File",
      filters: {name: imgs.name}
      }
      this.db.delete_docs(data).subscribe(res => {
        // console.log(res)
        if(res && res.status == "Success"){
          this.db.alert(res.message)
          this.get_image_list();
          // this.modalCtrl.dismiss()
        }
      })
      this.multiple_array = []
  }


  upload_file(img_data){
    // console.log(img_data)
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      // folder: "Home/Attachments",
      doctype: "File",
      attached_to_doctype : localStorage['docType'] ? localStorage['docType'] : this.db.selected_list.page,
      attached_to_name: this.order_id,
      decode : true
    }
    this.db.inset_docs({data : data}).subscribe(res =>{
      // console.log(res)
      if(res && res.message && res.message.status == "Success"){
        this.db.alert("Upload Successfully")
        this.modalCtrl.dismiss()
      }else{
        this.db.alert("Something went wrong try again later")
      }
    })
    this.multiple_array = []
    this.get_image_list()
  }

 async user_list(){
    const modal = await this.modalCtrl.create({
      component: UserListPage,
      cssClass: this.db.ismobile ? 'user_list' : 'web_site_form',
      componentProps : {
        order_id : this.order_id,
        user_list : this.db.selected_mail && this.db.selected_mail.lenght !=0 ? this.db.selected_mail : null,
        doctype:this.doctype
      }
    });
    await modal.present();
    let data: any = await modal.onWillDismiss();
    if(data){
      this.get_assigned_list();
      // this.db.close_modal();
    }
    // if(data && data.user_filter && data.user_filter.length != 0){
    //   this.db.selected_mail = data.user_filter
    // }
  }

  remove_user(data,i){
    // console.log(data)
    if(data['selected']){
      data['selected'] = false
    }
    // this.db.selected_mail.splice(data)
  }

 async get_image(image){
    // console.log(image)

    const modal = await this.modalCtrl.create({
      component: ShowImageComponent,
      cssClass: 'web_site_form',
      componentProps: {
        image: image,
      }
    });
    // console.log(this.sale_order_id)
    await modal.present();
  }

}
