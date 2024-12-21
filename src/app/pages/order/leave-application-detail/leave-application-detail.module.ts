import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveApplicationDetailPageRoutingModule } from './leave-application-detail-routing.module';

import { LeaveApplicationDetailPage } from './leave-application-detail.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveApplicationDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LeaveApplicationDetailPage]
})
export class LeaveApplicationDetailPageModule {}
