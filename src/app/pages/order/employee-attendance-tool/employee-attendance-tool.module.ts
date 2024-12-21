import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeAttendanceToolPageRoutingModule } from './employee-attendance-tool-routing.module';

import { EmployeeAttendanceToolPage } from './employee-attendance-tool.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeAttendanceToolPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmployeeAttendanceToolPage]
})
export class EmployeeAttendanceToolPageModule {}
