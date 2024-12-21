import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  tags: any = [];
  inputValue: any = '';
  @Input() name: any;
  @Input() doctype: any;
  // @Input() tag_value:any;
  loader = true;
  selected_tags: any = [];
  otherTags: any = [];
  checked_tags:any = [];
  buttonLoader = false;
  constructor(public db: DbService, public modalCtrl: ModalController) {}

  ngOnInit() {
    this.get_tags();
  }

  get_tags() {
    let data = {
      doctype: this.doctype,
      name: this.name,
    };
    this.db.Get_tags(data).subscribe((res) => {
      if (res && res.message) {
        this.loader = false;
        this.tags = res.message;
        this.checked_tags = this.tags.filter(item => item.value == 1);
        this.otherTags = this.tags.filter(item => item.value != 1);
        }
    });
  }

  insert_comment() {
    if (this.inputValue) {
      let datas = {
        doctype: 'Tag',
        __newname: this.inputValue,
      };
      this.db.inset_docs({ data: datas }).subscribe((res) => {
        if (res && res.message && res.message.status == 'Success') {
          this.tags.push({tag:this.inputValue, value: 1});
          this.add_tag(this.inputValue);
          this.inputValue = '';         
        } else {
          var d = JSON.parse(res._server_messages);
          var d1 = JSON.parse(d);
          this.db.sendErrorMessage(this.stripHtmlTags(d1.message));
          this.inputValue = '';
        }
      });
    }
  }

  add_tag(item){
    let data = {
        tag_list:[{ tag:item, value: 1}],
        doctype: this.doctype,
        docname: this.name
    }
    this.db.update_tags(data).subscribe(res => {
      this.get_tags();
    })
  }
  
  // Function to remove HTML tags
  stripHtmlTags(htmlString: string): string {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  }


  // Function to toggle tag selection
  toggleTagSelection(item) {
    item.value = item.value == 1 ? 0 : 1; 
      let data = {
          tag_list:[{ "tag":item.tag, "value":item.value}],
          doctype: this.doctype,
          docname: this.name
      }
      this.db.update_tags(data).subscribe(res => {
        // console.log(res)
        // this.get_tags();
      })
  }

  // Function to dismiss the selected tags
  dismiss() {
    // const dismissedTags = this.tags
    //   .filter((item) => item.value == 1)
    //   .map((item) => item.tag);
    //   dismissedTags
    this.modalCtrl.dismiss('Dismiss Successfully');
  }

  Select_tags() {
    this.buttonLoader = true;
    this.selected_tags = this.tags.filter((item) => item.value == 1).map((item) => item.tag);
    this.modalCtrl.dismiss(this.selected_tags);
    this.buttonLoader = false;
  }

  remove_tags(item: any) {
    let data = {
      tag: item.tag,
      doctype: this.doctype,
      docname: this.name,
    };
    this.db.remove_tags(data).subscribe((res) => {
      if (res && res.status && res.status == 'Success') {
        // console.log(res);
        this.get_tags();
      }
    });
  }
  
  // close_modal(){
  //   this.modalCtrl.dismiss('Closed')
  // }
}
