import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, LoadingController} from '@ionic/angular';
import { ShowImageComponent } from 'src/app/components/show-image/show-image.component';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
// import { title } from 'process';
import { DownloadElvluationComponent } from 'src/app/components/download-elvluation/download-elvluation.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  multiple_array: any = [];
  categoryimagedata: any;
  categoryfile: any;

  settings = {
    counter: false,
    plugins: [lgZoom]
  };
  
  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    // console.log(index, prevIndex);
  };

  new_dashboard_values:any;
  is_probation:any = [];  

  constructor(public db:DbService, private router: Router, public loadingCtrl: LoadingController, public modalCtrl : ModalController, public alertCtrl: AlertController) { }

  ngOnInit() {
    // this.db.get_employee_detail()
    // console.log(this.settings)
    // console.log(this.onBeforeSlide)
  }

  ionViewWillEnter(){
    this.db.get_employee_detail()
    this.get_probation_detail()
  }

  get_probation_detail() {
    let data = {
      emp_id: localStorage['employee_id'],
    }
    this.db.probation_completed(data).subscribe(res => {
      this.is_probation = res.message
      // console.log(res)
    })
  }
  
  router_(route) {
    this.router.navigateByUrl(route);
  }

  changeListener1($event: any) {
    this.base64($event.target);
  }

  async base64(inputValue: any): Promise<void> {

    if (inputValue.files && inputValue.files.length > 0) {
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
          // decode: "True",
        };

        let array_image: any = [];
        array_image.push(img_data);
        // this.post_image = array_image
        // console.log(this.post_image);
        // this.image_datas = img_data

        // console.log(this.image_datas);

        if (file_size <= 10000000) {
          //10Mb in BYtes

          let img_data = {
            file_name: this.categoryfile,
            content: this.categoryimagedata,
          };
          this.multiple_array.splice(0, 0, img_data);
          // console.log(this.multiple_array)
        } else if (file_size > 10000000) {
          //10Mb in bytes
          // loader.dismiss()
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          // loader.dismiss()
        }
        // console.log(img_data);
        this.upload_file(img_data);
      };
      myReader.readAsDataURL(file);
    }
  }

  async upload_file(img_data) {
    // console.log(img_data);
    // let loader;
    // loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    // await loader.present();
    this.db.profile_loader = true;
    let data = {
      file_name: img_data.file_name,
      content: img_data.content,
      is_private: 0,
      // folder: "Home/Attachments",
      doctype: 'File',
      attached_to_doctype: "Employee",
      attached_to_name: localStorage['employee_id'],
      decode: true,
    };
    this.db.inset_docs({ data: data }).subscribe((res) => {
      // console.log(res)
      // loader.dismiss();
      if (res && res.message && res.message.status == 'Success') {
        // this.db.alert('Updated Successfully');
        this.insert_user_image(res.message)
      } else {
        this.db.alert('Something went wrong try again later');
        this.db.profile_loader = false;
      }
    });
   
  }

  insert_user_image(image){
    let data = {
      // user_image: image ? image.data.file_url : '',
      image: image ? image.data.file_url : '',
      name: localStorage['employee_id'],
      doctype: 'Employee'
    }
    this.db.inset_docs({data: data}).subscribe(res => {
      // console.log(res)
      if(res && res.message && res.message.status && res.message.status == 'Success'){
        this.db.get_employee_detail()
      }else{
        this.db.profile_loader = false;
      }
    })
  }

  async download_Evaluation(){
    const modal = await this.modalCtrl.create({
      component: DownloadElvluationComponent,
      cssClass: 'job-detail-popup',
      componentProps: {
        title:'Download Probation',
        data:this.is_probation
      }
    });
    await modal.present();
  }

  async get_image(image){
    // console.log(image)

    const modal = await this.modalCtrl.create({
      component: ShowImageComponent,
      cssClass: this.db.ismobile ? 'profile_popup' : 'web_site_form',
      componentProps: {
        image: image,
        delete_btn: true
      }
    });
    // console.log(this.sale_order_id)
    await modal.present();
    const data = await modal.onWillDismiss();
    if(data && data.data && data.data == "delete"){
      this.sure_delete()
    }
  }

  async sure_delete(){
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
            this.insert_user_image('')
          }
        }
      ]
    })
    await alert.present();
  }

 
}
