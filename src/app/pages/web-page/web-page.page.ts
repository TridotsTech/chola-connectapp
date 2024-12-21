import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { Router,ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-web-page',
  templateUrl: './web-page.page.html',
  styleUrls: ['./web-page.page.scss'],
})
export class WebPagePage implements OnInit {

  page_route:any;
  web_form:any;
  is_show:any = false;
  @ViewChild(IonContent, { static: true }) content: IonContent | any;

  constructor(public db:DbService,public route : ActivatedRoute, public Ngzone : NgZone) { }

  ngOnInit() {


    this.route.queryParams.subscribe(async (params:any) => {
        // console.log(params);
       if (params && params.page_route) {

        localStorage['site_name'] = 'erp14test.tridotstech.com'
        this.db.domain_site = localStorage['site_name'] ? localStorage['site_name'] : '';
        this.db.domain = this.db.domain_site;
        this.db.site_values(this.db.domain)
          this.page_route = params.page_route;
        //   this.is_show = true;
          this.get_form(this.page_route);
       }
    });
    // this.route.params.subscribe(res =>{
    //   console.log(res);
    //   if(res && res['page_route']){
    //     this.page_route = res['page_route'];
    //       // this.get_form(res['page_route']);  
    //   }
    // })
  }

  scrollToTop(eve) {
    this.content.scrollToTop(400); // Scroll to the top with animation (400ms)
  }

  get_form(datas:any){
    this.db.web_form_dynamic(datas).subscribe(res=>{
      // console.log(res)
      if(res && res.data){
        this.web_form = res.data;
        this.is_show = true;
        this.Ngzone.run(()=>{
            this.web_form = this.web_form;
          })
        // console.log('success135');
        // setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 100);
        // this.get_form_values();
      }
    })
  }


}
