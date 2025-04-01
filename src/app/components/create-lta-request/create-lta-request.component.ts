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
  lta_form: any = FormGroup;
  submitted = false;
  ltaDetails:any;
  constructor(private formBuilder: FormBuilder,public loadingCtrl:LoadingController,public modalCtrl: ModalController, public db: DbService) {


   }

  ngOnInit() {
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

    this.lta_form.get('employee').setValue(this.db.employee_img.name)
    this.lta_form.get('employee_name').setValue(this.db.employee_img.employee_name)
    this.lta_form.get('grade').setValue(this.db.employee_img.grade)
    this.lta_form.get('date_of_joining').setValue(this.db.employee_img.date_of_joining)
    this.lta_form.get('designation').setValue(this.db.employee_img.designation)
    this.lta_form.get('company').setValue(this.db.employee_img.company)


  }

}
