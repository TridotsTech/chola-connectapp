import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-create-nps-request',
  templateUrl: './create-nps-request.component.html',
  styleUrls: ['./create-nps-request.component.scss'],
})
export class CreateNpsRequestComponent  implements OnInit {
  @Input() title;
  employeeForm: FormGroup;
  isSubmitted = false;

  npsRequestDetail:any;
  save_only:any = false;

  constructor(public modalCtrl: ModalController,private formBuilder: FormBuilder,public loadingCtrl:LoadingController,public db: DbService) { 

    this.employeeForm = this.formBuilder.group({
      employee: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      additional: [false]
    });
  }

  ngOnInit() {}

  get formControls() {
    return this.employeeForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }

  async insert_nps_request(item){
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...' });
    await loader.present();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
      let data:any ={}
      data.doctype = 'National Pension Scheme'
      if(this.npsRequestDetail && this.npsRequestDetail.name){
        data.name = this.npsRequestDetail.name;
      }
      data.letter_type = item.name
      data.remarks = item.remarks
      data.from_date = item.from_date
      data.to_date = item.to_date
      data.employee_id = localStorage['employee_id']
      data.request_date = `${year}-${month}-${day}`;
      this.save_only ? data.workflow_state = 'Awaiting Approval' : data.workflow_state = 'Draft'
      // data.workflow_state = 'Awaiting Approval'

      this.db.inset_docs({data: data}).subscribe(res => {
        setTimeout(() => {
          loader.dismiss()
        }, 1000);
        if (res && res.message && res.message.status == 'Success') {
          this.db.sendSuccessMessage("NPS Request created successfully!")
          this.npsRequestDetail = res.message.data;
          // this.db.inset_docs({data: {name:res.message.data.name,workflow_state:'Pending',doctype:'Employee Letter Request'}}).subscribe(r => {
          //   this.modalCtrl.dismiss(res.message.data);
          // })
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
