import { Component, OnInit } from '@angular/core';
import { DbService } from '../../../services/db.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, LoadingController} from '@ionic/angular';
import { ShowImageComponent } from 'src/app/components/show-image/show-image.component';
import lgZoom from 'lightgallery/plugins/zoom';
import { BeforeSlideDetail } from 'lightgallery/lg-events';
import { DownloadElvluationComponent } from 'src/app/components/download-elvluation/download-elvluation.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

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

  constructor(private iab: InAppBrowser,public db:DbService, private router: Router, public loadingCtrl: LoadingController, public modalCtrl : ModalController, public alertCtrl: AlertController) { }

  ngOnInit() {
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
      // if(res.)
      if(res.message.status != 'Failed')
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


  async approval(){
    try {
      // Show loading
      const loader = await this.loadingCtrl.create({ message: 'Authenticating...' });
      await loader.present();

      // Get user credentials
      const baseUrl = this.db.baseUrl;
      const userEmail = localStorage.getItem('customerRefId') || '';

      // Get password from secure storage
      let userPassword = '';
      try {
        const pwdResult = await SecureStoragePlugin.get({ key: 'CustomerPwd' });
        userPassword = pwdResult.value;
      } catch (error) {
        console.log('Password not found in secure storage, trying cap_sec_CustomerPwd');
        try {
          const pwdResult = await SecureStoragePlugin.get({ key: 'cap_sec_CustomerPwd' });
          userPassword = pwdResult.value;
        } catch (error2) {
          loader.dismiss();
          this.db.alert('Password not found. Please login again.');
          return;
        }
      }

      if (!userEmail || !userPassword) {
        loader.dismiss();
        this.db.alert('Credentials not found. Please login again.');
        return;
      }

      // Step 1: Login via API to create session
      try {
        const loginResponse = await fetch(`${baseUrl}api/method/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            usr: userEmail,
            pwd: userPassword
          }),
          credentials: 'include'
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (loginData.message === 'Logged In' || loginData.full_name) {
          // Login successful, now open browser
          loader.message = 'Opening application...';

          // Extract session ID from cookies or response
          let sessionId = '';
          
          // Note: Browser fetch API doesn't expose set-cookie headers for security reasons
          // We'll need to rely on the response data or let the browser handle cookies
          
          // If no session ID in headers, check response data
          if (!sessionId && loginData.sid) {
            sessionId = loginData.sid;
          }
          
          // Also check for session_data in response
          if (!sessionId && loginData.session_data && loginData.session_data.sid) {
            sessionId = loginData.session_data.sid;
          }

          // Add small delay to ensure session is properly set on server
          await new Promise(resolve => setTimeout(resolve, 500));

          // Direct URL to /app - session should already be created from login API
          const appUrl = `${baseUrl}app`;
          
          console.log('Opening app URL:', appUrl);

          // Create browser
          const browser = this.iab.create(appUrl, '_blank', {
            location: 'no',
            toolbar: 'yes',
            zoom: 'no',
            hardwareback: 'yes',
            clearcache: 'no',
            clearsessioncache: 'no',
            useWideViewPort: 'yes',
            enableViewportScale: 'no',
            closebuttoncaption: 'Close',
            closebuttoncolor: '#0000ff'
          });

          loader.dismiss();

          // Handle browser events
          browser.on('loadstart').subscribe((event: any) => {
            console.log('Loading:', event.url);
            
            // If loading login page or home page, immediately redirect to app
            if (event.url.includes('/login') || event.url === baseUrl || event.url === baseUrl.slice(0, -1)) {
              console.log('Intercepting and redirecting to app...');
              browser.executeScript({
                code: `window.location.href = '${baseUrl}app';`
              });
            }
          });

          browser.on('loadstop').subscribe((event: any) => {
            console.log('Loaded:', event.url);

            // Check if we're on the app page
            if (event.url.includes('/app') || event.url.includes('/desk')) {
              console.log('Successfully loaded app page');
              return;
            }

            // If redirected to login, immediately redirect to /app
            if (event.url.includes('/login') || event.url === baseUrl || event.url === baseUrl.slice(0, -1)) {
              browser.executeScript({
                code: `
                  console.log('Redirecting to app...');
                  // Since we already logged in via API, just navigate to app
                  window.location.href = '${baseUrl}app';
                `
              });
            }
            
            // If on any other page, also try to redirect to app
            else if (!event.url.includes('/app')) {
              setTimeout(() => {
                browser.executeScript({
                  code: `
                    if (!window.location.href.includes('/app')) {
                      console.log('Forcing redirect to app...');
                      window.location.href = '${baseUrl}app';
                    }
                  `
                });
              }, 500);
            }
          });

          browser.on('exit').subscribe(() => {
            console.log('Browser closed');
          });

        } else {
          loader.dismiss();
          this.db.alert('Login failed. Please check your credentials.');
        }

      } catch (error) {
        loader.dismiss();
        console.error('Login error:', error);
        this.db.alert('Failed to authenticate. Please try again.');
      }

    } catch (error) {
      console.error('Error:', error);
      this.db.alert('Failed to open application.');
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
