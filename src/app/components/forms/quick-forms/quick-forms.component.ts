import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-quick-forms',
  templateUrl: './quick-forms.component.html',
  styleUrls: ['./quick-forms.component.scss'],
})
export class QuickFormsComponent  implements OnInit {

  @Input() detail_doc:any;
  @Input() parentTaskCreate: any;
  web_form:any;
  page_title:any = ""
  editFormValues: any;
  constructor(public db:DbService) { }

  ngOnInit() {
   if(this.detail_doc.name){
     let name = this.detail_doc.name
     if(this.detail_doc.name == 'Customer Feedback'){
      name = 'customer-feedback'
     }else if(this.detail_doc.name == 'Employee'){
      name = 'employee-quick'
     }
     this.getForms(name)
    //  this.getForms(this.detail_doc.name)
   }
  }


  getForms(data){

    let info = {
      user: localStorage['customerRefId'],
      web_form: data,
    };

    this.db.custom_doc_fields(info).subscribe((res) => {
      if(res.message){
        let value = res.message
        let formValues = JSON.parse(value['form_json'])
        this.page_title = formValues['doc_type']
        formValues.web_form_fields = formValues.web_form_fields.filter(res=>{ return  (res.fieldname == '' ||  res.reqd == 1) })
        this.web_form = formValues
        // console.log(this.web_form);
      }
    })
  }
}
