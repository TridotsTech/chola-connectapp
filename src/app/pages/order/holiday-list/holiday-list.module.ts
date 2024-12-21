import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HolidayListPageRoutingModule } from './holiday-list-routing.module';

import { HolidayListPage } from './holiday-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidayListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HolidayListPage]
})
export class HolidayListPageModule {}
