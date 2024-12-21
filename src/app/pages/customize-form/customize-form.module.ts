import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomizeFormPageRoutingModule } from './customize-form-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CustomizeFormPage } from './customize-form.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomizeFormPageRoutingModule,
    ComponentsModule,
    DragDropModule
    
  ],
  declarations: [CustomizeFormPage]
})
export class CustomizeFormPageModule {}
