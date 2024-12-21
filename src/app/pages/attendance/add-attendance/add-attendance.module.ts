import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAttendancePageRoutingModule } from './add-attendance-routing.module';

import { AddAttendancePage } from './add-attendance.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAttendancePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddAttendancePage]
})
export class AddAttendancePageModule {}
