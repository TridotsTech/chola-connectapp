import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

// import {
//   FiltersPopupPage,
// } from 'src/app/pages/filters-popup/filters-popup.page';
// import {
//   ProductPopupPage,
// } from 'src/app/pages/product-popup/product-popup.page';

import { DbService } from 'src/app/services/db.service';

import {
  ActionSheetController,
  ModalController,
} from '@ionic/angular';

@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  styleUrls: ['./mobile-filters.component.scss'],
})
export class MobileFiltersComponent implements OnInit {
  @Output() get_cat_products = new EventEmitter();
  @Input() category_filters:any;


  constructor(private actionSheetCtrl:ActionSheetController,public db:DbService,private modalCtrl:ModalController,public location:Location) { }

  ngOnInit() {
    // this.addActiveClass();
  }

  ngAfterViewInit(){
    // setTimeout( () =>{  
    //   document.getElementById(this.db.childs.child_1+'g').scrollIntoView({behavior:'auto',inline:'center',block:'center'})
    // },500 )
  }

  change_view() {
    this.db.product_box.view == 'Grid View' ?  this.db.product_box.view = 'List View' :  this.db.product_box.view = 'Grid View';
  }


  async select_sort(data:any) {
    const actionsheet = await this.actionSheetCtrl.create({
      header: data,
      buttons: this.db.sortings
    })
    await actionsheet.present();
    const { role } = await actionsheet.onDidDismiss();
    if(role != 'backdrop'){
      // this.db.minimax_price.mini_price = '';
      // this.db.minimax_price.max_price = '';
      this.get_cat_products.emit(role);
    }
  }


  // async select_filter(data){
  //   const modal = await this.modalCtrl.create({
  //     component:FiltersPopupPage,
  //     componentProps:{
  //       brands : this.category_filters
  //     }
  //   })
  //   await modal.present();
  //   let value =await modal.onWillDismiss();
  //   if(value.data == 'success'){
  //     this.get_cat_products.emit('')
  //   }
  // }


  // AddClass
  // addActiveClass(){
  //     setTimeout(()=>{
  //       const myTag = document.querySelector(".active-category-name");
  //       if(myTag && myTag.classList.contains('active-category-name')){
  //         myTag.classList.add('scroll_To_center');
  //         this.removeActiveCenterClass(myTag);
  //       }
  //     }, 500);
  // }

  
  // / removeActiveCenterClass
  //  removeActiveCenterClass(arg){
  //     setTimeout(()=>{
  //       arg.classList.remove('scroll_To_center');
  //     }, 100);
  // }


  // async open_product_popup(){
  //   const modal = await this.modalCtrl.create({
  //     component: ProductPopupPage,
  //     componentProps: {   categories : this.db.category }
  //   })
  //   await modal.present();
  //   let { data } = await modal.onWillDismiss();
  //   if(data && data != ''){
  //     this.db.mobile_category.parent = data
  //     this.gotoo(data,'child-1')
  //   }
  // }

  // gotoo(route,child_no){
  //   if(route.default_view && !this.db.ismobile){
  //     this.db.product_box.view = route.default_view;
  //   } else {
  //     this.db.product_box.view = 'Grid View';
  //   }
  //   if(child_no == 'child-1'){
  //       this.db.childs.child_1 = route.route;
  //       // this.db.mobile_category.child = []
  //       this.db.mobile_category.child = route
  //       this.db.childs.child_3,this.db.childs.child_2 = undefined;
  //       // [routerLink]="db.ismobile ? '/cl/'+item.route : '/c/'+item.route"
  //       // this.db.ismobile ? this.router.navigateByUrl('/cl/'+route.route) :  this.router.navigateByUrl('/c/'+route.route);
  //   } else if(child_no == 'child-2'){
  //       this.db.childs.child_2 = route.route;
  //       this.db.mobile_category.child = route
  //       this.db.childs.child_3 = [];
  //       // this.db.ismobile ? this.router.navigateByUrl('/cl/'+this.db.childs.child_1+'/'+route.route) :  this.router.navigateByUrl('/c/'+this.db.childs.child_1+'/'+route.route);
  //   }else if(child_no == 'child-3'){
  //      this.db.childs.child_3 = route.route;
  //   }
  //     this.db.choosed_product_id = route.route;
  //     if(child_no == 'all' && this.db.choosed_product_id == undefined){
  //       this.db.childs.child_2 = route;
  //       this.db.childs.child_3 = undefined;
  //       this.db.choosed_product_id = route
  //     }

  //   if(this.db.choosed_product_id &&  this.db.choosed_product_id != ''){
  //     this.location.replaceState("/c/"+route.route);
  //       this.get_cat_products.emit('');
  //   }
  //   //  this.addActiveClass();
  //    this.db.load_mobile_categories();
  // }


  // show_view(data){
  //   // console.log(document.getElementById(data).scrollIntoView())
  //   document.getElementById(data).scrollIntoView({behavior:'auto',inline:'center',block:'center'})
  //   // console.log(d)
  //   // d.;
  //   // d.classList.add('selected__message')
  // }

}
