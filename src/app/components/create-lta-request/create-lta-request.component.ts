import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-lta-request',
  templateUrl: './create-lta-request.component.html',
  styleUrls: ['./create-lta-request.component.scss'],
})
export class CreateLtaRequestComponent  implements OnInit {
  @Input() title;
  @Input() data;
  lta_form: any = FormGroup;
  submitted = false;
  ltaDetails:any;
  dropdownSettings = {};
  year:any;
  year_list:any=[];
  constructor(private formBuilder: FormBuilder,public loadingCtrl:LoadingController,public modalCtrl: ModalController, public db: DbService) {

    
   }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };
    this.lta_form = this.formBuilder.group({
      employee: new FormControl('',[Validators.required]),
      employee_name: new FormControl('',[Validators.required]),
      date_of_joining: new FormControl(''),
      company: new FormControl('',[Validators.required]),
      designation: new FormControl(''),
      grade: new FormControl(''),
      status: new FormControl(''),
      lta_block_period: new FormControl('',[Validators.required]),
      lta_mode: new FormControl('',[Validators.required]),
      lta_amount_requested: new FormControl(''),
      remarks: new FormControl(''),
      lta_year_detail: new FormControl(''),
    });

    if(this.title == 'Add LTA Request'){
      this.lta_form.get('employee').setValue(this.db.employee_img.name)
      this.lta_form.get('employee_name').setValue(this.db.employee_img.employee_name)
      this.lta_form.get('grade').setValue(this.db.employee_img.grade)
      this.lta_form.get('date_of_joining').setValue(this.db.employee_img.date_of_joining)
      this.lta_form.get('designation').setValue(this.db.employee_img.designation)
      this.lta_form.get('company').setValue(this.db.employee_img.company)
      this.lta_form.get('status').setValue('Pending')
      this.get_info()
    }
    else{
      let data = {
        doctype: "LTA Request",
        name: this.data.name,
      }
      this.db.doc_detail(data).subscribe(res => {
        Object.keys(res.message[1]).forEach(field => {
          const control = this.lta_form.get(field);
          if (control) {
            const value = res.message[1][field];
            if (value && value.length > 0) {
              control.setValue(value);
              if(field == 'lta_year_detail')
              {
                this.get_lta_availeble_years()
                let v:any=[];
                value.map((r:any) =>{
                  v.push(r.lta_year)
                })
                this.year = v
              }
                
            }
          }
        });
      });
    }
  }

  get_info(){
    let data = {
     company:this.lta_form.get('company').value
    };
    this.db.get_lta_block_period(data).subscribe((res: any) => {
    if(res.message.status == 'Success'){
        this.lta_form.get('lta_mode').setValue(res.message.message.lta_mode)
        this.lta_form.get('lta_block_period').setValue(res.message.message.lta_period.name)
        this.get_lta_availeble_years()
      }
      },
      (error) => {
      }
    );
  }

  onYearChange(event: any) {
    if(event != undefined)
      this.get_lta_amount(event)
  }

  get_lta_availeble_years(){
    let data = {
     company:this.lta_form.get('company').value,
    employee: this.lta_form.get('employee').value,
    lta_block_period:this.lta_form.get('lta_block_period').value
    };
    this.db.get_lta_availeble_years(data).subscribe((res: any) => {
    if(res.message){
      this.year_list = res.message
      }
      },
      (error) => {
      }
    );
  }

  get_lta_amount(event){
    let v:any =[];
    event.map(r=>{
      v.push({lta_year:r})
    })
    let data = {
     company:this.lta_form.get('company').value,
     employee:this.lta_form.get('employee').value,
     lta_block_period:this.lta_form.get('lta_block_period').value,
     lta_year_detail:JSON.stringify(v)
    };
    this.db.get_lta_amount(data).subscribe((res: any) => {
    console.log(res)
    this.lta_form.get('lta_amount_requested').setValue(res.message)
    if (res._server_messages) {
      var d = JSON.parse(res._server_messages);
      var d1 = JSON.parse(d);
      this.db.alert(d1.message)
    }
      },
      (error) => {
      }
    );
  }

  save(){
    // console.log(this.lta_form)
    if(this.lta_form.status == 'VALID'){
      this.year ? this.insert_lat_request() : this.db.sendErrorMessage('Pls select the LTA year')
    }
  }

  async insert_lat_request(){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
      let data:any ={}
      data = this.lta_form.value
      data.doctype = 'LTA Request'
      data.date_of_request = `${year}-${month}-${day}`;
      data.status = 'Pending'
      data.lta_year_detail = this.year
      this.db.inset_docs({data: data}).subscribe(res => {
        setTimeout(() => {
          loader.dismiss()
        }, 1000);
        if (res && res.message && res.message.status == 'Success') {
          this.modalCtrl.dismiss();
          this.db.sendSuccessMessage("LTA Request created successfully!")
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

}
