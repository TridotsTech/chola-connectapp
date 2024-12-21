import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditWebformchildPageRoutingModule } from './edit-webformchild-routing.module';

import { EditWebformchildPage } from './edit-webformchild.page';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
import { QuillModule } from 'ngx-quill';


// import { SignaturePadModule } from 'angular2-signaturepad';
// import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EditWebformchildPageRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    QuillModule
  ],
  declarations: [EditWebformchildPage]
})
export class EditWebformchildPageModule { }
