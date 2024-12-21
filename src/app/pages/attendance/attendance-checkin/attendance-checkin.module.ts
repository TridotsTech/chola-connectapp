import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceCheckinPageRoutingModule } from './attendance-checkin-routing.module';

import { AttendanceCheckinPage } from './attendance-checkin.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceCheckinPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AttendanceCheckinPage]
})
export class AttendanceCheckinPageModule {}
