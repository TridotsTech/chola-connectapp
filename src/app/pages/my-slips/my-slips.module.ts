import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MySlipsPageRoutingModule } from './my-slips-routing.module';

import { MySlipsPage } from './my-slips.page';

import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MySlipsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MySlipsPage]
})
export class MySlipsPageModule {}
