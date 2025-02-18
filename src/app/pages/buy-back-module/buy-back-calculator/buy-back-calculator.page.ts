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
  assetsType:any=[];
  rates:any=[];
  assets_list:any=[]; 
  yearCalculator:any=[]; 
  current_date:any;
  constructor(public db: DbService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    this.current_date = `${year}-${month}-${day}`;
    this.buyback_form = this.formBuilder.group({
      employee_code: new FormControl(localStorage['employee_id']),
      employee_name: new FormControl(localStorage['employee_name']),
      asset_type: new FormControl(''),
      asset: new FormControl(''),
      vehicle_registration_no: new FormControl(''),
      baz_ticket_no: new FormControl(''),
      date_of_purchase: new FormControl(''),
      buyback_date: new FormControl(''),
      ex_showroom_cost: new FormControl(''),
      road_tax_and_registration_charges: new FormControl(''),
      total_capitalized_value: new FormControl(''),
      year1: new FormControl(''),
      year0: new FormControl(''),
      year2: new FormControl(''),
      year3: new FormControl(''),
      year4: new FormControl(''),
      life_of_the_car: new FormControl(''),
      perk_tax: new FormControl(''),
      buyback_amount: new FormControl(''),
      gst_amount: new FormControl(''),
      amount_payable_to_company: new FormControl(''),
      insurance_amount: new FormControl(''),
      perk_amount: new FormControl(''),
      tax_on_perk_amount: new FormControl(''),
    });

    let data ={
      "employee":localStorage['employee_id']
    }
    this.db.permission_fields(data).subscribe(res => {
      if(res && res.message && res.message.message == 'Success'){
        if(res.message.asset_types.length > 0){
          res.message.asset_types.map((res)=>{
            this.assetsType.push({name:res})
          }) 
        }
      }else{
        this.db.sendErrorMessage(res.message.message)
      }
    })
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

  get baz_ticket_no(){
    return this.buyback_form.get('baz_ticket_no');
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

  get insurance_amount(){
    return this.buyback_form.get('insurance_amount');
  }

  get perk_amount(){
    return this.buyback_form.get('perk_amount');
  }

  get tax_on_perk_amount(){
    return this.buyback_form.get('tax_on_perk_amount');
  }

  datePickerChange(fieldname,event){
    if(fieldname == 'buyback_date'){
      let data ={
        "asset":this.buyback_form.value.asset,
        "buyback_date":event.value
      }
      this.db.buyback_calculator_asset(data).subscribe(res => {
        if(res && res.message && res.message.status == 'success'){
          console.log(res.message.data)
          this.buyback_form.get('total_capitalized_value').setValue(this.formatCurrencyString(res.message.data.amount))
          this.buyback_form.get('life_of_the_car').setValue(res.message.data.car_life)
          this.buyback_form.get('amount_payable_to_company').setValue(this.formatCurrencyString(res.message.data.amount_payable_to_company))
          this.buyback_form.get('insurance_amount').setValue(this.formatCurrencyString(res.message.data.insurance_amount))
          this.buyback_form.get('gst_amount').setValue(this.formatCurrencyString(res.message.data.gst_amount))
          this.buyback_form.get('perk_amount').setValue(this.formatCurrencyString(res.message.data.perk_amount))
          this.buyback_form.get('tax_on_perk_amount').setValue(this.formatCurrencyString(res.message.data.tax_on_perk_amount))
          this.buyback_form.get('buyback_amount').setValue(res.message.data.amount)
          this.yearCalculator = res.message.data.table
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      })
    }
    this.buyback_form.value[fieldname] = event.value;
  }

  formatCurrencyString(value: string): string {
    if (value) {
      return new Intl.NumberFormat('en-IN', { // Locale 'en-IN' for Indian formatting
        style: 'currency',
        currency: 'INR'// Indian Rupee
      }).format(parseFloat(value));
    }
    return '0.00';
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

  onassettypeChange(eve){
    this.assets_list = []
    let data ={
      "employee":localStorage['employee_id'],
      "asset_type":eve.detail.value
    }
    this.db.validate_asset(data).subscribe(res => {
      if(res && res.message && res.message.status == 'success'){
        res.message.data.map((res)=>{
          this.assets_list.push({name:res})
        }) 
        if(this.assets_list.length == 1){
          this.buyback_form.get('asset').setValue(this.assets_list[0].name)
          this.onassetChange('',this.assets_list[0].name)
        }
      }else{
        this.db.sendErrorMessage(res.message.message)
      }
    })
     let year_data ={
      "asset_type":eve.detail.value
    }
    this.db.fetch_buyback_years(year_data).subscribe(res => {
      if(res && res.message){
        this.buyback_form.get('perk_tax').setValue(res.message.perk_tax)
        this.rates = res.message.rates
      }else{
        this.db.sendErrorMessage(res.message.message)
      }
    })
  }

  onassetChange(eve,asset){
    let data ={
      "asset":asset == '' ? eve.detail.value :asset
    }
    this.db.get_asset_detail(data).subscribe(res => {
      if(res && res.message && res.message.status == 'success'){
        if(res.message.data){
          this.buyback_form.get('date_of_purchase').setValue(res.message.data.asset_capitalization_date)
          this.buyback_form.get('vehicle_registration_no').setValue(res.message.data.registration_no)
          this.buyback_form.get('ex_showroom_cost').setValue(this.formatCurrencyString(res.message.data.showroom_cost))
          this.buyback_form.get('road_tax_and_registration_charges').setValue(this.formatCurrencyString(res.message.data.road_tax_registration_charges))
        }
      }else{
        this.db.sendErrorMessage(res.message.message)
      }
    })
  }

}
