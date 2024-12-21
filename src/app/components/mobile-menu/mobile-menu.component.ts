import {
  Component,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, MenuController, LoadingController, IonAccordion } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import $ from 'jquery';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  showmore1 = false;
  showmore2 = false;
  showmore3 = false;
  showmore4 = false;
  showmore5 = false;
  showmore6 = false;

  showRole = false;
  show_center = false;

  categoryfile: any;
  categoryimagedata: any;
  image_field_check = "no uploads";
  image_count: any = [];
  each: any;
  image_datas: any
  image: any
  post_image: any;
  multiple_array: any = [];

  @Input() menu;
  // @ViewChild('yourAccordion') accordion: IonAccordion | any;
  constructor(public db: DbService, private ngZone: NgZone, private router: Router, private modalCtrl: ModalController, public menuCtrl: MenuController, public loadingCtrl: LoadingController) { }

  ngOnInit() {
    // console.log(this.db.permission_details)
    // this.db.get_permission_details()
    // this.ngZone.run(() => {
    // });
    // if(this.db.ismobile){
    //   this.db.checkMobileMenu();
    //   // this.db.get_permission_details();
    //   // this.db.get_employee_detail()
    // }
  }

  // ngOnChanges(){
  //   this.db.get_permission_details();
  // }

  // altlyfes = [
  //   {
  //     title: 'About us',
  //     route: '/p/about-us',
  //     icon: '/assets/icon/About-us.svg',
  //     enable: 0
  //   },
  //   {
  //     title: 'Altlyfer',
  //     route: '/p/altlyfer',
  //     icon: '/assets/icon/communityy.svg',
  //     enable: 0
  //   },
  //   {
  //     title: 'Altlyfer Events',
  //     route: '/p/altlyfer-events',
  //     icon: '/assets/icon/events-01.svg',
  //     enable: 0,
  //   },
  //   // {
  //   //   title: 'Become a affiliate',
  //   //   route: '/p/affiliated',
  //   //   icon: '/assets/icon/communityy.svg',
  //   //   enable: 1,
  //   // },
  //   // {
  //   //   title: 'Blogs',
  //   //   route: '/blog-list',
  //   //   icon: '/assets/icon/blog.svg',
  //   //   enable: 1
  //   //   // (this.db.website_settings && this.db.website_settings.enable_loyalty == 1) ? 1 : 0
  //   // },
  //   {
  //     title: 'Contact Us',
  //     route: '/contact-us',
  //     icon: '/assets/icon/contact-us.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'FAQ',
  //     route: '/p/faqs',
  //     icon: '/assets/icon/question.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Affiliate program',
  //     route: '/affiliate-program',
  //     icon: '/assets/icon/affiliate-program.svg',
  //     enable: 0,
  //   }
  // ]

  Sell_with_us = [
    {
      title: 'Sell with us',
      route: '/p/whysellwithus',
      icon: '/assets/icon/sell-with-us/sell-with-us.svg',
      enable: 1,
    },
    {
      title: 'Fees & Pricing',
      route: '/p/fees-and-pricing',
      icon: '/assets/icon/sell-with-us/price.svg',
      enable: 0,
    },
    {
      title: 'Beginners Guideline',
      route: 'https://cdn.gokommerce.com/altlyfes/1RXGTJIE_ALTLYFES_beginners_guide_1.pdf',
      icon: '/assets/icon/sell-with-us/guidelines.svg',
      enable: 0,
    },
    {
      title: 'Policies For Seller',
      route: '/p/guidelines-and-acceptance-policies-for-content-of-your-shop-at-altlyfescom',
      icon: '/assets/icon/sell-with-us/policy.svg',
      enable: 0,
    },

    {
      title: 'Seller Criteria',
      route: '/p/seller-selection-criteria-1',
      icon: '/assets/icon/sell-with-us/criteria.svg',
      enable: 0,
    },
    {
      title: 'Seller Subscription',
      route: '/p/seller-subscription',
      icon: '/assets/icon/sell-with-us/subscription.svg',
      enable: 0,
    },
  ]

  seller_community: any = [];

  // shop = [
  //   {
  //     title: 'Categories',
  //     route: '/tabs/category',
  //     icon: '/assets/icon/category.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Wishlist',
  //     route: '/tabs/wishlist',
  //     icon: '/assets/icon/heart.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'MyCart',
  //     route: '/yourcart',
  //     icon: '/assets/icon/mycart.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Orders',
  //     route: '/my-orders',
  //     icon: '/assets/icon/cart.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Profile',
  //     route: '/tabs/my-profile',
  //     icon: '/assets/icon/user-sidemenu.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Wallet',
  //     route: '/tabs/wallet',
  //     icon: '/assets/icon/wallet.svg',
  //     enable: 0
  //     // (this.db.website_settings && this.db.website_settings.enable_wallet == 1) ? 1 : 0
  //   },
  //   {
  //     title: 'Reward Points',
  //     route: '/reward-points',
  //     icon: '/assets/icon/Reward.svg',
  //     enable: 0
  //     // (this.db.website_settings && this.db.website_settings.enable_loyalty == 1) ? 1 : 0
  //   },
  // ]

  // policy = [
  //   {
  //     title: 'Terms & conditions',
  //     route: '/terms/terms-condition',
  //     icon: '/assets/icon/terms.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Privacy Policy',
  //     route: '/terms/privacy-policy',
  //     icon: '/assets/icon/privacy-policy.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Return Policy',
  //     route: '/terms/return-policy',
  //     icon: '/assets/icon/privacy-policy.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'Cancellation Policy',
  //     route: '/terms/return-policy',
  //     icon: '/assets/icon/cancellation-policy.svg',
  //     enable: 0
  //   },
  //   {
  //     title: 'Prohibited Items Policy',
  //     route: '/p/prohibited-items-policy',
  //     icon: '/assets/icon/cancellation-policy.svg',
  //     enable: 0
  //   },
  //   {
  //     title: 'Community Policy',
  //     route: '/p/community-policy',
  //     icon: '/assets/icon/privacy-policy.svg',
  //     enable: 0
  //   }
  // ]

  // store_settings = [
  //   {
  //     title: 'All Stores',
  //     route: '',
  //     icon: '/assets/icons/All-store.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'FL Store',
  //     route: '',
  //     icon: '/assets/icons/FL-Direct.svg',
  //     enable: 1
  //   },
  //   {
  //     title: 'FL MarketPlace',
  //     route: '',
  //     icon: '/assets/icons/Farmlink.svg',
  //     enable: 1
  //   }
  // ]

  push_sales_data_home = [
    {
      page: 'Home',
      page_name: 'Home',
      route: '/tabs/dashboard',
      enable: 1,
    },
  ]

  push_sales_data = [
    // {
    //   page: 'Home',
    //   page_name: 'Home',
    //   route: '/tabs/dashboard',
    //   enable: 1,
    // },
    {
      page: 'Task',
      page_name: 'Tasks',
      route: '/list/tasks',
      enable: 1,
    },
    {
      page: 'Meeting',
      page_name: 'Meeting',
      route: '/list/meeting',
      enable: 1,
    }, {
      page: 'Content',
      page_name: 'Content',
      route: '/messages',
      enable: 1,
    },
  ]

  select_center() {

    // this.db.select_store();

    if (!this.db.cust_email && !this.db.cust_name) {
      this.menuCtrl.close();
      this.router.navigateByUrl('/location');
    } else {
      this.show_center = !this.show_center;
    }
  }

  router_(route) {
    this.router.navigateByUrl(route);
  }

  router_mobile(type, data){
    localStorage['docType'] = data;
    // console.log(data,"data , Mobile menu")
    type == 'static' ? data['selected'] = true : null
    this.router.navigateByUrl(data.route);
  }

  close_menu(){
    this.menuCtrl.close();
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

        let array_image: any = []
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
          this.multiple_array.push(img_data);
          // console.log(this.multiple_array)

        } else if (file_size > 10000000) { //10Mb in bytes
          // loader.dismiss()
          this.db.filSizeAlert();
        } else if (file_size == 0) {
          // loader.dismiss()
        }

      }
      myReader.readAsDataURL(file);
    }
  }

  remove_img(imgs, i) {
    imgs.map((r, index) => {
      if (index == i) {
        imgs.splice(index, 1);
      }
    })
  }

  login_as = [
    {
      title: 'Go1 Business',
    },
    {
      title: 'Go1 Purchase',
    },
    {
      title: 'Go1 HR',
    },
    {
      title: 'Go1 Employee',
    },
    {
      title: 'Go1 Onsite',
    },
    // {
    //   title: 'Meena Gas',
    // },
    {
      title: 'Go1 CRM',
    },
    {
      title: 'Go1 Sales Executive',
    },
  ]

  open_profile() {
    this.router.navigateByUrl('/tabs/my-profile')
    this.menuCtrl.close()
  }

  loader_1: any;
  async goto_login(data) {
    this.loader_1 = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await this.loader_1.present();
    if (data == "Go1 Hr") {
      this.login('sriramhr@gmail.com', 'Test@123')
    } else if (data == "Go1 Onsite") {
      this.login('projectmanager@mail.com', 'Test@123')
    } else if (data == "Go1 CRM") {
      this.login('salesmanger@gmail.com', 'Test@123')
    } else if (data == "Go1 Purchase") {
      this.login('pm3@gmail.com', 'Test@123')
    } else if (data == "Meena Gas") {
      this.login('meenagas@gmail.com', 'Test@123')
    }else if (data == "Go1 Business") {
      this.login('go1business@gmail.com', 'Test@123')
    }else if (data == "Go1 Sales") {
      this.login('salesexecutive@gmail.com', 'Test@123')
    }else if (data == "Go1 Employee") {
      this.login('sriramemployee@1.in', 'Test@123')
    }
    this.menuCtrl.close()
    this.loader_1.dismiss()
  }

  login(user, login_pwd) {
    let data = {
      usr: user,
      pwd: login_pwd,
    }
    this.db.getLogin(data).subscribe((data: any) => {
      this.loader_1.dismiss()
      if (data.message.status == "Success") {
        this.db.side_menu_show = true;
        localStorage['CustomerPwd'] = login_pwd;
        data.message.full_name = data.full_name ? data.full_name : '';
        this.db.store_customer_info(data.message);
        this.router.navigateByUrl('/dashboard');
      }
    })
  }

}
