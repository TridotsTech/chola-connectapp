import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResignationPageRoutingModule } from './resignation-routing.module';

import { ResignationPage } from './resignation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResignationPageRoutingModule
  ],
  declarations: [ResignationPage]
})
export class ResignationPageModule {}
