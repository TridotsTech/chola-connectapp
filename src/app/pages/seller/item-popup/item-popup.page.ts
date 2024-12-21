import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// import { SignaturePad } from 'angular2-signaturepad';
import { DbService } from 'src/app/services/db.service';

import {
  AlertController,
  ModalController,
  LoadingController
} from '@ionic/angular';

@Component({
  selector: 'app-item-popup',
  templateUrl: './item-popup.page.html',
  styleUrls: ['./item-popup.page.scss'],
})
export class ItemPopupPage implements OnInit, OnDestroy  {

  
  @Input() all_data;
  @Input() all_values;
  @Input() index_value;
  @Input() child_table_field_name;
  @Input() component_type;  
  @ViewChild('customInput', { static: false }) customInput!: ElementRef;
  @ViewChild('customInput_1', { static: false }) customInput_1!: ElementRef;
  @ViewChild("nameField") nameField!: ElementRef;
  
  submitted = false;

  // signature pad

  // signatureImg: string;
  signatureImg: any;
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;

  // signaturePadOptions: Object = {
  //   'minWidth': 2,
  //   'canvasWidth': 700,
  //   'canvasHeight': 300
  // };

  //singnature variables

  signature_fieldname = [];
  signature_base64_url = [];

  // image attach variables

  categoryfile: any;
  categoryimagedata: any;

  field_name: any = [];
  base64_url: any = [];
  item;
  file_name: any = [];

  //End 

  info: any = [];
  form_data:any = FormGroup;
  form_ctrl_data: any = {};
  // section_break_data;
  json_data;
  doctype;
  form_tile;
  link_flelds_name:any = [];
  image_field_check = "no uploads";
// prem
  service_type_list =['Business Services','Individual Services'];
  

  constructor(public db: DbService, private formBuilder: FormBuilder, public alertController: AlertController, public modalctrl: ModalController,private loadingCtrl:LoadingController,private renderer: Renderer2, private elementRef: ElementRef) { }
 


  ngOnInit() {
    // this.db.side_menu = true;
    // console.log("pop up data", this.all_data)

    // let field_data = this.all_data.docs[0].fields;
    // this.doctype = this.all_data.docs[0].name;
    // let field_data = this.all_data.message.meta_data.fields;


    let alldatas:any;
    alldatas = JSON.stringify(this.all_data);
    alldatas = JSON.parse(alldatas);

    let field_data = alldatas.meta_data.fields;
    this.doctype = alldatas.meta_data.name;
    this.json_data = field_data

    // Store doctype for api resource method to db

    // this.db.doc_type = this.doctype;
    // this.db.ad_name = this.titleCase(this.form_tile);

    this.store_info()
    this.filter_section_break();
    this.assign_final_data()

    this.form_data = this.formBuilder.group(
      this.form_ctrl_data
    );

    this.sub = this.db.select_drop_down.subscribe((res:any)=>{
      if(res && res.status && res.status == 'success'){
        // console.log(res);
        delete res.status;
        let value = res.fieldname_value
        if(this.form_ctrl_data && this.form_ctrl_data[res.fieldname]){
          this.form_ctrl_data[res.fieldname].setValue(res[value]);
          this.selected_value(res);
        }
      }
    })

  }

  sub:any;

  ngOnDestroy(): void {
    // if(this.sub){
      this.sub.unsubscribe();
    // }
  }

  // Title case the title 

  // titleCase(str) {
  //   return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  // }

  // store form control details
  all_select_values = {};

  store_info() {

    // For Storing filtered data

    this.json_data.map(res => {

      if (res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect" && res.fieldtype != "Section Break") {
        // if (res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
        res.show ? res.show =false : null;
        this.info.push(res);
      }

      // getting link field options

      if (res.fieldtype == "Link") {

        // this.current_gen_links(res.options);

        this.link_flelds_name.push(res.options);
      }
       if(res.fieldtype == "Select"){
        this.all_select_values[res.fieldname]  = res.options.split('\n')
       }

    })

    // console.log("filtered data", this.info)

    // For web form controls

    // this.info.data.web_form_fields.map(res => {

    this.info.map(res => {

      if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table" && res.fieldtype != "Table MultiSelect") {
        // if (res.label && res.fieldtype != "Section Break" && res.fieldtype != "Column Break" && res.fieldtype != "Barcode" && res.fieldtype != "Button" && res.fieldtype != "Color" && res.fieldtype != "Duration" && res.fieldtype != "Dynamic Link" && res.fieldtype != "Fold" && res.fieldtype != "Geolocation" && res.fieldtype != "Heading" && res.fieldtype != "Image" && res.fieldtype != "Markdown Editor" && res.fieldtype != "Percent" && res.fieldtype != "Read Only" && res.fieldtype != "Rating" && res.fieldtype != "Table MultiSelect") {
          res.value = (this.all_values && this.all_values[this.index_value] && this.all_values[this.index_value][res.fieldname]) ? this.all_values[this.index_value][res.fieldname] : '';

        if (res.reqd == 1 && res.options != 'Email' && res.fieldtype != 'Attach') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value ? res.value : ''), Validators.required)
        }else if (res.reqd == 1 && res.options == 'Email') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value ? res.value : ''), [Validators.required, Validators.email])
        }else if (res.options == 'Email') {
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value ? res.value : ''), Validators.email)
        } else if (res.fieldtype == 'Check') {
          this.form_ctrl_data[res.fieldname] = new FormControl(false)
        } else if (res.fieldtype == 'Attach') {
          res.file_url = undefined;
          this.form_ctrl_data[res.fieldname] = new FormControl((res.value ? res.value : ''), Validators.required)
        }else {
          this.form_ctrl_data[res.fieldname] = new FormControl(res.value ? res.value : '')
        }
      }

    })
    // console.log('loop form group data', this.form_ctrl_data)
  }


  // Get link field options


  ref_doc:any = [];

  all_link_opts = {};
  current_gen_links(link_field_array) {

    // console.log("Doc name", link_field_array);

    // each.editValue = 0;

    // if (!this.ref_doc.includes(refdoc)) {

    link_field_array.map(refdoc => {

      this.ref_doc.push(refdoc);

      this.db.ref_doc_type = refdoc;

      // console.log("ref doc type", refdoc)
      // console.log("Doctype", this.db.doc_type)

      // console.log(this.link_opts.length);
      // console.log(this.link_opts);

    if(refdoc == 'Item'){
        if(refdoc == 'Item'){
         this.category_products(refdoc);
        }
     }else{
      this.db.get_link_field_options().subscribe(res => {

        // console.log("link field ", res.data)

        let res_data = res.data

        let link_opts:any = [];

        res_data.map(res => {
      
          link_opts.push(res.name)

        })

        // console.log("link options", refdoc, "=====", link_opts)

        this.all_link_opts[refdoc] = link_opts;
      })
     }



    })
    

  }

  // End


  // Filter the section for section break and if a form having without section breake last if conditon will work

  section_break_data:any = {};
  each_sec_data:any = [];
  section_break_name:any = [];
  test_section_break_data:any = [];
  test_section_break_name:any = [];

  // if api have column break or not column break and not have section breake the value will be sstore here
  no_sec_col:any = [];
  //end

  // Setting margin value for each flex div
  // The css and the below value must be same for apply e:g flex:0 0 calac(%-flex_margin)
  flex_margin: any = "30px";
  // end var
  store_field_type:any = [];
  // Store field name && check it has lable or not

  // store_field_name;
  // count = 0;
  change_data(event,fieldname){
   let value = event.target.value
   if (fieldname == 'client_loc'){
    this.info.map(res=>{
      if(res.depends_on){
        if(value=='Yes'){res.show = true}else{res.show = false}
      }
     })
   }
  }
  filter_section_break() {

    // function call for Getting link field options

    this.current_gen_links(this.link_flelds_name);
    
    this.info.map((res, index) => {
      
      this.store_field_type.push(res.fieldtype);

      if (res.fieldtype == "Section Break") {

        let k = index;
        let count = 0;

        while (k < this.info.length) {

          if (k != index) {

            if (this.info[k].fieldtype != "Section Break" && this.info[k].fieldtype != "Column Break") {
              this.each_sec_data.push(this.info[k]);
            }

            else if (this.info[k].fieldtype == "Section Break") {
              break
            }
          }

          if (this.info[k].fieldtype == "Column Break") {
            count++
          }
          k++
        }

        this.section_break_data[res.fieldname] = this.each_sec_data;
        this.section_break_data[res.fieldname].count = count + 1;
        let p__flex = ((100 / (count + 1)) + '%');
        let flex_out = "0 0 calc(" + p__flex + " " + "-" + " " + this.flex_margin + ")";
        this.section_break_data[res.fieldname].flex = flex_out.toString();
        // this.section_break_data[res.fieldname].label = res.label
        if (res.label || !res.label) {
          if (!res.label) {
            this.section_break_data[res.fieldname].label = undefined;
          }
          else {
            this.section_break_data[res.fieldname].label = res.label
          }
        }
        this.test_section_break_data.push(res.fieldname);
        this.test_section_break_name.push(res.fieldname);
        this.each_sec_data = [];
      }
    });
    // console.log("type", this.store_field_type)
    if (!this.store_field_type.includes("Section Break")) {
      this.info.map(res => {
        // console.log("wsec", res);
        // console.log(this.section_break_name);
        if (res.fieldtype != "Column Break") {
          this.no_sec_col.push(res);
        }

      })
    }
  }

  // End

  // Check and assign a section brake fields into another section break if section comes without label

  label_name;
  section_break_data_2 = undefined;
  count = 0;
  check_assign_sec_break() {

    return new Promise<void>((resolve, reject) => {

      this.test_section_break_name.map((res, index) => {

        if (this.section_break_data[res] && this.section_break_data[res].label) {
          this.label_name = res;
        }
        else if (this.section_break_data[res] && !this.section_break_data[res].label) {
          this.section_break_data[res].map(name => {
            this.section_break_data[this.label_name].push(name);
          })
          delete this.section_break_data[res];
          let index_value = this.test_section_break_data.indexOf(res)
          this.test_section_break_data.splice(index_value, 1);
        }
      })
      resolve();
    })
    // this.section_break_name = this.test_section_break_data
    // this.section_break_data_2 = this.section_break_data;
    // console.log("All section data-2", this.section_break_data)
    //   console.log('sec name', this.section_break_name)
  }

  // Assign final data ref


  async assign_final_data() {

    // console.log('sec data', this.section_break_data);

    await this.check_assign_sec_break();

    this.section_break_name = this.test_section_break_data
    this.section_break_data_2 = this.section_break_data;

    // console.log("section name", this.section_break_name)
    // console.log("All section data-2", this.section_break_data)

  }





  // Save submitted data

  save_details1() {

 

    this.submitted = true;

    // setTimeout(() => {     //Delay the api call for attach and getting image api call response for get the URL of image and attach to image field 

    if (this.image_field_check == "no uploads" || this.image_field_check == "true") {

      // Store empty variables
      this.info.map(res => {
        if (res.fieldtype == 'Check') {
          if (this.form_data.value[res.fieldname]) {
            this.form_data.value[res.fieldname] = 1
          }
          else if (!this.form_data.value[res.fieldname]) {
            this.form_data.value[res.fieldname] = 0
          }
        }

      });

      this.images_array.map(res=>{
        this.info.map(info=>{
          if(res.fieldname == info.fieldname){
            this.form_data.value[res.fieldname] = res.image_url;
          }
        })
      })

      if (this.form_data.status == "VALID") {
        // alert("Valid")
        let data = {};
        this.info.map(res => {

          // console.log(this.form_data.value['title'])

          if (res.fieldtype != "Column Break" && res.fieldtype != "Section Break") {
            data[res.fieldname] = this.form_data.value[res.fieldname]
          }

        })

        // console.log("final sent data", data)

        let input_data = {
          responsedata: data
        }
        
          let vault_data = {
          // file: this.base64_binary(this.categoryimagedata),
          doctype:'User',
          docname:localStorage['email'],
          file_name: this.categoryfile,
          is_private: 1,
          content: this.categoryimagedata,
          document_name:this.form_data.value['document_type'],
          user_id:localStorage['email'],
          file_type:this.file_type,
         }
        //  console.log(vault_data);

        // this.item_name ?  data['item_name'] = this.item_name : null;
        this.item_name ?  data['item_code'] = this.item_name : null;



        this.modalctrl.dismiss({
          form_data: data,
          child_table_field_name: this.child_table_field_name,
          vault_data:vault_data
        });

        this.submitted = false;
        this.image_field_check == "true"
      }else{
        // this.db.alert('Please enter required data')
      }
    }

    else if (this.image_field_check == "false") {
      // this.db.imageAlert();
    }
    // }, 1500);
  }


  //Image attach and Path finder 
  image_count:any = [];

  changeListener($event, each): void {

    this.image_count.push(each.fieldname);
    this.image_field_check = "false";
    // let data = this.form_data.get(fieldname)
    // this.readThis($event.target, fieldname);
    if(this.component_type && this.component_type == 'document-vault'){
      this.readThis1($event.target, each);
    }else{
      this.readThis($event.target, each);
    }

  }

  images_array:any = []

  async readThis(inputValue: any, each): Promise<void> {
    let loader = await this.loadingCtrl.create({ message: 'Please Wait...'});
    await loader.present();

    if (inputValue.files.length > 0) {
      var file: File = inputValue.files[0];
      var file_size = inputValue.files[0].size
      this.categoryfile = file.name
      var myReader: FileReader = new FileReader();

      myReader.onloadend = (e) => {

        this.categoryimagedata = myReader.result;
        // Push file name

        let img_data = {
          file_name: this.categoryfile,
          content: this.categoryimagedata,
          decode: "True",
        }

        if (file_size <= 10000000) {  //10Mb in BYtes

          this.db.upload_image(img_data).subscribe(res => {


            let checks_rep = res ? true : false;

            let unique_name = res.data.name;

            if (checks_rep == true) {

              this.db.upload_image_url(unique_name).subscribe(url => {

                let file_url = url.data.file_url

                if (url) {
                  loader.dismiss()
                  each.file_url = file_url;
                  let value = this.images_array.find(res=>res['fieldname'] == each.fieldname);
                  if(value){
                    this.images_array.map(res=>{
                      if(res['fieldname'] == each.fieldname){
                        res['image_url'] = file_url
                      }
                    })
                  }else{
                    let obj:any = { 'fieldname': each.fieldname , 'image_url': file_url};
                    this.images_array.push(obj);
                  }
                }

                let index_v = this.image_count.indexOf(each.fieldname);
                this.image_count.splice(index_v, 1);
                if (this.image_count.length == 0) {
                  this.image_field_check = "true";
                }

              },error=>{loader.dismiss()})
            }
          },error=>{loader.dismiss()})
        }else if (file_size > 10000000) { //10Mb in bytes
          loader.dismiss()
          this.db.filSizeAlert();
          this.base64_url.splice(this.field_name.indexOf(this.field_name[each.fieldname]), 1);
          this.field_name.splice(this.field_name.indexOf(this.field_name[each.fieldname]), 1);
          // if(this.edit_data_details && this.edit_data_details[each.fieldname]){
          //   this.edit_data_details[each.fieldname]="";
          // }
          let ind_v = this.image_count.indexOf(each.fieldname);
          this.image_count.splice(ind_v, 1);
          if (this.image_count.length == 0) {
            this.image_field_check = "true";
          }

          this.form_data.controls[each.fieldname].reset();

        }else if (file_size == 0) {
          loader.dismiss()
        }

      }
      myReader.readAsDataURL(file);
    }
  }

  file_type;

  readThis1(inputValue: any, each): void {
    // console.log(this.form_ctrl_data);
    var file: File = inputValue.files[0];
    var file_size = inputValue.files[0].size;
    this.file_type = file.name.split('.').pop();

      this.categoryfile = file.name
      var myReader: FileReader = new FileReader();
  
      myReader.onloadend = (e) => {
  
        this.categoryimagedata = myReader.result;
  
        if (file_size <= 10000000) {  //10Mb in BYtes
     
        }else{
          this.db.filSizeAlert();
          this.form_data.controls[each.fieldname].reset();
        }
      }
      myReader.readAsDataURL(file);
  }

  save_details() {
    this.save_details1();
  }

  // Convert base 64 into binary image data

  base64_binary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  category = '';
  c_page_no = 1;
  search_txt:any = '';
  no_products = false;

  category_products(options) {
    let attributes:any  = [];
    let temp_obj:any = {}


    let datas = {
      // "route": this.db.choosed_product_id,
      // "category": this.db.choosed_product_id,
      // "sort_by": this.sort,//sort,
      "item_group": this.category,
      "page_no":this.c_page_no,
      "page_length":20,
      search_text:this.search_txt
    }
    
    this.db.get_items(datas).subscribe((res:any)=>{
      if (res.message && res.message.length != 0) {
          if(this.c_page_no == 1){
            this.all_link_opts[options] =  res.message;
          } else {
            this.all_link_opts[options] = [...this.all_link_opts[options],...res.message as never]
          }
      } else {
        this.no_products = true;
        this.c_page_no == 1 ?  this.all_link_opts[options] = [] : null;
      }
    })

    // console.log(this.all_link_opts[options])
  }

  onSearch(event,options) {
    // console.log(event);
    let term = event.term;
    // console.log(term);

    this.search_txt = term;
    this.c_page_no = 1;
    this.no_products = false;
    this.category_products(options);
    // this.load_search(term,'');
    // this function must to declare
  }


  CustomSearch(term: any, item) {
    // console.log(term);
    
    // this.search_txt = term;
    // this.c_page_no = 1;
    // this.no_products = false;
    // this.category_products('');
    // this.load_search(term,'');
  }


  load_search(term,options){
    // console.log(term);
    this.search_txt = term;
    this.c_page_no = 1;
    this.no_products = false;
    this.category_products(options);
  }


  fetchMore(eve,options){
    this.loadData(eve,options);
  }

  loadData(data:any,options) {
    if(!this.no_products){
      this.c_page_no = this.c_page_no + 1;
      this.category_products(options);
    }
    // setTimeout(()=>{ data.target.complete() },400);
  }

  focusof() {
    // console.log('123456')
    this.customInput?.nativeElement.focus();  
  }

  dynamic_focusof(): void {
    this.nameField.nativeElement.focus();
    // document.getElementById("inputSearch").focus(); 

    // this.customInput_1?.nativeElement.focus();   
  }

 

  item_name:any;

  selected_value(eve){
    let selected_values = eve;
    let qty =  this.info.find(res => res.fieldname == "qty");
    qty.value = 1;
    // this.item_name = selected_values.item_name;
    this.item_name = selected_values.item_code;
    this.info.map(res => {
       if(res.fieldname == "rate"){
        res.value = selected_values.rate;
        res.value = Number(res.value).toFixed(2);
       }else if(res.fieldname == "amount"){
        res.value = selected_values.rate * (qty.value ? qty.value : 1);
        res.value = Number(res.value).toFixed(2);
       }else if(res.fieldname == "qty"){
        res.value = res.value ? res.value : 1;
        // res.value = Number(res.value).toFixed(2);
       }
    })
  }

ion_change(eve){
    
    let quantity = eve.target.value;
    let rate =  this.info.find(res => res.fieldname == "rate");

    // console.log(rate);

    this.info.map(res => {
     if(res.fieldname == "amount"){
       res.value = rate.value * (quantity ? quantity : 1);
       res.value = Number(res.value).toFixed(2);
      }
  })

}

select_value(event:any){
  const inputElement = event.target.querySelector('input') as HTMLInputElement;
  inputElement.select();
}

get_blur(value){
  value = Number(value).toFixed(2);
}

open_drop_down_options(type,fieldname,fieldname_value) {
  let data = this.form_data.value;
  let selected_value = this.item_name;

  if(!this.item_name && this.all_values && this.all_values[this.index_value]){
    selected_value = this.all_values[this.index_value]['item_code']
  }

  this.db.open_drop_down_options(type,fieldname,fieldname_value,selected_value)
}

}
