import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceDetailsPageRoutingModule } from './attendance-details-routing.module';

import { AttendanceDetailsPage } from './attendance-details.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceDetailsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AttendanceDetailsPage]
})
export class AttendanceDetailsPageModule {}
