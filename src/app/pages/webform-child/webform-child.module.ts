import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebformChildPageRoutingModule } from './webform-child-routing.module';
import { WebformChildPage } from './webform-child.page';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebformChildPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgSelectModule,
    QuillModule
  ],
  declarations: [WebformChildPage]
})
export class WebformChildPageModule { }
