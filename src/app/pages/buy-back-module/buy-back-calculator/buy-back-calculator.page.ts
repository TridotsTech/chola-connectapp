import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-buy-back-calculator',
  templateUrl: './buy-back-calculator.page.html',
  styleUrls: ['./buy-back-calculator.page.scss'],
})
export class BuyBackCalculatorPage implements OnInit {
  buyback_form: any = FormGroup;
  constructor(public db: DbService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buyback_form = this.formBuilder.group({
      employee_code: new FormControl(localStorage['employee_id']),
      employee_name: new FormControl(localStorage['employee_name']),
      asset_type: new FormControl(''),
      vehicle_registration_no: new FormControl(''),
      date_of_purchase: new FormControl(''),
      buyback_date: new FormControl(''),
      ex_showroom_cost: new FormControl(''),
      road_tax_and_registration_charges: new FormControl(''),
      total_capitalized_value: new FormControl(''),
      year1: new FormControl(''),
      year2: new FormControl(''),
      year3: new FormControl(''),
      year4: new FormControl(''),
      perk_tax: new FormControl(''),
      buyback_amount: new FormControl(''),
      gst_amount: new FormControl(''),
      amount_payable_to_company: new FormControl(''),
      perk_amount: new FormControl(''),
      tax_on_perk_amount: new FormControl(''),
    });

    // this.db.select_drop_down.subscribe((res: any) => {
    //   this.buyback_form.patchValue({
    //     employee_code: res.name
    //   });
    // });
  }

  get employee_code(){
    return this.buyback_form.get('employee_code');
  }

  get employee_name(){
    return this.buyback_form.get('employee_name');
  }

  get asset_type(){
    return this.buyback_form.get('asset_type');
  }

  get vehicle_registration_no(){
    return this.buyback_form.get('vehicle_registration_no');
  }

  get date_of_purchase(){
    return this.buyback_form.get('date_of_purchase');
  }

  get buyback_date(){
    return this.buyback_form.get('buyback_date');
  }

  get ex_showroom_cost(){
    return this.buyback_form.get('ex_showroom_cost');
  }

  get road_tax_and_registration_charges(){
    return this.buyback_form.get('road_tax_and_registration_charges');
  }

  get total_capitalized_value(){
    return this.buyback_form.get('total_capitalized_value');
  }

  get year1(){
    return this.buyback_form.get('year1');
  }

  get year2(){
    return this.buyback_form.get('year2');
  }

  get year3(){
    return this.buyback_form.get('year3');
  }

  get year4(){
    return this.buyback_form.get('year4');
  }

  get perk_tax(){
    return this.buyback_form.get('perk_tax');
  }

  get buyback_amount(){
    return this.buyback_form.get('buyback_amount');
  }

  get gst_amount(){
    return this.buyback_form.get('gst_amount');
  }

  get amount_payable_to_company(){
    return this.buyback_form.get('amount_payable_to_company');
  }

  get perk_amount(){
    return this.buyback_form.get('perk_amount');
  }

  get tax_on_perk_amount(){
    return this.buyback_form.get('tax_on_perk_amount');
  }

  assetsType = [
    {name: 'Vehicle'},
    {name: 'Mobile'},
  ]

  datePickerChange(fieldname,event){
    this.buyback_form.value[fieldname] = event.value;
  }

  submit(){
    console.log(this.buyback_form.value,'this.buyback_form.value')
  }

  open_dropdown() {
    let val = {
      type: 'Employee',
      fieldname: 'employee',
      fieldname_value: '',
      selected_value: this.buyback_form.value.employee_code,
      send_all_value: true
    }

    let selected_value = {
      doctype: "Employee"
    }
    this.db.open_drop_down_options(val.type, val.fieldname, val.fieldname_value, selected_value)
  }

  yearCalculator = [
    {
      year: 1,
      value_of_the_car: 50000,
      depreciation: 10000,
      wdv: 40000
    },
    {
      year: 2,
      value_of_the_car: 40000,
      depreciation: 8000,
      wdv: 32000
    },
    {
      year: 3,
      value_of_the_car: 32000,
      depreciation: 6400,
      wdv: 25600
    },
    {
      year: 4,
      value_of_the_car: 25600,
      depreciation: 5120,
      wdv: 20480
    },
  ]

}
