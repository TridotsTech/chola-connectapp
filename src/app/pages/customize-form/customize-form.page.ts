import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-customize-form',
  templateUrl: './customize-form.page.html',
  styleUrls: ['./customize-form.page.scss'],
})
export class CustomizeFormPage implements OnInit {
  form_fields: any = [];
  // no_found:any;
  router_id: any;
  disabled = false;
  loader = true;
  route_pagename: any;
  constructor(public db: DbService,public modal : ModalController,public route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(res => {
      // console.log(res['id'])
      this.route_pagename = res['id']
    })

    this.get_customize_form()
  }

  ionViewWillEnter(){
    this.get_customize_form()
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.form_fields, event.previousIndex, event.currentIndex);
    // console.log(this.form_fields);
  }

  toggle(fields){
    fields.map(item =>{
      // item.toggle = item.toggle ? true : false
      if(item.hidden == 1){
        item.hidden = 1;
      }else{
        item.hidden = 0;
      }
      
    }) 
  }

  // toggle_check(item){
  //   console.log(item)
  // }

  get_customize_form() {
    let doc = {
      doctype: "Web Form",
      fields: ["name"],
      filters: { "doc_type": this.route_pagename ? this.route_pagename : this.db.selected_list.page}
    }
    this.db.get_list(doc).subscribe(res => {
      if (res && res.message.length != 0) {
        if(this.route_pagename == 'Project'){
          res.message[0].name = 'project'
        }
        let data = {
          user: localStorage['customerRefId'],
          web_form: res.message[0].name,
        }
        this.db.custom_doc_fields(data).subscribe(res => {
          this.router_id = res.message.name;
          localStorage['form_json'] = res.message.form_json;
          let fields;
          fields = JSON.parse(localStorage['form_json']);
          this.form_fields = fields.web_form_fields;
          this.loader = false;
          // this.form_fields = fields = fields.web_form_fields.filter(r => r.fieldtype != 'Section Break' && r.fieldtype != 'Page Break' && r.fieldtype != 'Column Break' );
          this.toggle(this.form_fields);
          // console.log(this.form_fields);
        })
      } else {
        this.form_fields = [];
        this.loader = false;
        // this.no_found = localStorage['docType']
      }
    })
  }

  update_field(item) {
    item.hidden = item.hidden == 1 ? 0 : 1;
  }

  save(){
    this.db.customize_form_details = true
    let fields = JSON.parse(localStorage['form_json']);
    fields.web_form_fields = this.form_fields
    // console.log(fields);
    localStorage['form_json'] = JSON.stringify(fields);
    let data = {
      name: this.router_id ,
      doctype: 'Dynamic Form',
      form_json : JSON.stringify(fields),
    }
    this.db.inset_docs({data : data}).subscribe(res =>{
      if(res.message.status == 'Success'){
        this.db.alert(res.message.message);
        !this.db.ismobile ? this.db.modalCtrl.dismiss() : null
        this.db.custom_form_update.next('custom_field');
      }
    })
  }

}


