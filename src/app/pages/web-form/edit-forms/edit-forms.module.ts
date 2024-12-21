import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditFormsPageRoutingModule } from './edit-forms-routing.module';

import { EditFormsPage } from './edit-forms.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFormsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EditFormsPage]
})
export class EditFormsPageModule {}
