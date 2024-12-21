import { Component, OnInit, Output, EventEmitter,Input, OnChanges, SimpleChanges } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-common-text-box',
  templateUrl: './common-text-box.component.html',
  styleUrls: ['./common-text-box.component.scss'],
})
export class CommonTextBoxComponent  implements OnInit, OnChanges {
  message_data: any;
  toolbarShow = false;
  @Input() placeholder:any= "Type a Notes..."
  @Input() edit_value:any;
  @Output() submitCommonText = new EventEmitter();

  modules = {
    formula: false,
    toolbar: this.db.ismobile ? [
      ['bold', 'italic', 'underline'],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
    ] : [
      ['bold', 'italic', 'underline'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
    ],
    keyboard: {
      bindings: {
        enter: {
          key: 13, // Keycode for Enter
          handler: () => {
            return false;
          },
        },
      }
    }
  };

  constructor(public db: DbService) { }

  ngOnInit() {
    if(this.edit_value){
      this.message_data = this.edit_value
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['edit_value'] && changes['edit_value'].currentValue) {
      // console.log(changes['edit_value'].currentValue)
      this.message_data = changes['edit_value'].currentValue;
    }
  }

  enableEditor(){
    // console.log('Open Editor');
    this.toolbarShow =! this.toolbarShow;
  }

  handlePropo(eve) {
    eve.stopPropagation();
  }

  onsubmit(){
    this.submitCommonText.emit(this.message_data);
    setTimeout(() => {
      this.message_data = '';
    },500)
  }

}
