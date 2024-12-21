import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AlertController, MenuController,LoadingController, ModalController,AnimationController, Platform } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-navigation-link',
  templateUrl: './navigation-link.page.html',
  styleUrls: ['./navigation-link.page.scss'],
})
export class NavigationLinkPage implements OnInit {

  @Input() warehouse_list;
  @Input() sale_order_id;
  constructor(public modalCtrl: ModalController,public db:DbService,private router : Router) { } 

  ngOnInit() {

   const modalState = {
    modal : true,
    desc : 'fake state for our modal'
   };
 
   history.pushState(modalState, '');

  }

    @HostListener('window:popstate', ['$event'])
    dismissModal() {
    this.modalCtrl.dismiss();
    }

  add(item){
    // console.log(item)
    if(item.label == 'Print'){
      // this.modalCtrl.dismiss('success');
      // this.router.navigateByUrl(item.route);
      // this.close_modal('success');
      this.print_pdf();
    }else{
      if(!this.db.ismobile){
        let data = {
          next_route : item.label,
          status : "Success"
        }
        this.modalCtrl.dismiss(data);
      }else{
        this.modalCtrl.dismiss('Success');
      }
    }
  }
  
  close_modal(){
    // this.db.centres_list = [];
    this.modalCtrl.dismiss();
  }


  print_pdf(){
    let data = {
      doc_id: this.sale_order_id,
      doc_type : localStorage['docType'],
      letter_head : ""
    }
    this.db.print_pdf(data).subscribe(res =>{
      if(res && res['status'] == 'success'){
        window.open(res['message'], '_blank');
        this.close_modal();
      }else{
        this.db.alert(res.message); 
        this.close_modal();
      }
    })
  }


}


