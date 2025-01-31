import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buyback-form',
  templateUrl: './buyback-form.component.html',
  styleUrls: ['./buyback-form.component.scss'],
})
export class BuybackFormComponent  implements OnInit {

  buyback_form: any = FormGroup;
  assetsType:any=[];
  rates:any=[];
  assets_list:any=[]; 
  @Input() title; 
  constructor(public modalCtrl:ModalController,public db: DbService,private formBuilder: FormBuilder) { }

  ngOnInit() {
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
      life_of_the_car: new FormControl(''),
      perk_tax: new FormControl(''),
      buyback_amount: new FormControl(''),
      gst_amount: new FormControl(''),
      amount_payable_to_company: new FormControl(''),
      perk_amount: new FormControl(''),
      tax_on_perk_amount: new FormControl(''),
      // bank: new FormControl(''),
      paid_amount: new FormControl(''),
      // account_no: new FormControl(''),
      utr_no: new FormControl(''),
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

  datePickerChange(fieldname,event){
    if(fieldname == 'buyback_date'){
      let data ={
        "asset":this.buyback_form.value.asset,
        "buyback_date":event.value
      }
      this.db.buyback_calculator_asset(data).subscribe(res => {
        if(res && res.message && res.message.status == 'success'){
          this.buyback_form.get('total_capitalized_value').setValue(this.formatCurrencyString(res.message.data.amount))
          this.buyback_form.get('life_of_the_car').setValue(res.message.data.car_life)
          this.buyback_form.get('amount_payable_to_company').setValue(this.formatCurrencyString(res.message.data.amount_payable_to_company))
          this.buyback_form.get('gst_amount').setValue(this.formatCurrencyString(res.message.data.gst_amount))
          this.buyback_form.get('perk_amount').setValue(this.formatCurrencyString(res.message.data.perk_amount))
          this.buyback_form.get('tax_on_perk_amount').setValue(this.formatCurrencyString(res.message.data.tax_on_perk_amount))
          this.buyback_form.get('buyback_amount').setValue(this.formatCurrencyString(res.message.data.amount))
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      })
      this.buyback_form.get('buyback_date').setValue(event.value)
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

  convertCurrencyToNumber(currency: string): number {
    // Remove the ₹ symbol and commas
    if (typeof currency === 'number') {
      return currency;
    }
    else if(typeof currency === 'string'){
      const numericValue = currency.replace(/[^\d.]/g, '');
      return parseFloat(numericValue);
    }
    else
      return 0
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
          this.buyback_form.get('baz_ticket_no').setValue(res.message.data.baz_ticket_no)
          this.buyback_form.get('ex_showroom_cost').setValue(this.formatCurrencyString(res.message.data.showroom_cost))
          this.buyback_form.get('road_tax_and_registration_charges').setValue(this.formatCurrencyString(res.message.data.road_tax_registration_charges))
        }
      }else{
        this.db.sendErrorMessage(res.message.message)
      }
    })
  }

  submit(){
    this.buyback_form.value.amount_payable_to_company =  this.convertCurrencyToNumber(this.buyback_form.value.amount_payable_to_company)
    this.buyback_form.value.buyback_amount =  this.convertCurrencyToNumber(this.buyback_form.value.buyback_amount)
    this.buyback_form.value.ex_showroom_cost =  this.convertCurrencyToNumber(this.buyback_form.value.ex_showroom_cost)
    this.buyback_form.value.gst_amount =  this.convertCurrencyToNumber(this.buyback_form.value.gst_amount)
    this.buyback_form.value.road_tax_and_registration_charges =  this.convertCurrencyToNumber(this.buyback_form.value.road_tax_and_registration_charges)
    this.buyback_form.value.total_capitalized_value =  this.convertCurrencyToNumber(this.buyback_form.value.total_capitalized_value)
    this.buyback_form.value.tax_on_perk_amount =  this.convertCurrencyToNumber(this.buyback_form.value.tax_on_perk_amount)
    this.buyback_form.value.perk_amount =  this.convertCurrencyToNumber(this.buyback_form.value.perk_amount)
    let data:any={};
    data = this.buyback_form.value
    data.doctype = 'Buyback'
    this.db.inset_docs({ data: data }).subscribe(res => {
      if (res && res.message && res.message.status == 'Success') {  
        if(res.message.data && res.message.data.name)
          this.db.sendSuccessMessage("Buyback created successfully!")
          setTimeout(() => {
            this.modalCtrl.dismiss(res)
          }, 500);
      }else{
        if(res._server_messages){
          let d = JSON.parse(res._server_messages)
          let f = JSON.parse(d[0])
          this.db.sendErrorMessage(f.message)
        }else{
          this.db.sendErrorMessage(res.message.message)
        }
      }
    }, error => {
      if(error.error){
        let d = JSON.parse(error.error._server_messages)
        let f = JSON.parse(d[0])
        this.db.sendErrorMessage(f.message)
      }
    })
  }

}
