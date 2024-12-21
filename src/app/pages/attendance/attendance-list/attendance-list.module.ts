import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceListPageRoutingModule } from './attendance-list-routing.module';

import { AttendanceListPage } from './attendance-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AttendanceListPage]
})
export class AttendanceListPageModule {}
