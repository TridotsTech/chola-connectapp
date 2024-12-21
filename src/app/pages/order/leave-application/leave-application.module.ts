import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LeaveApplicationPageRoutingModule } from './leave-application-routing.module';

import { LeaveApplicationPage } from './leave-application.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveApplicationPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [LeaveApplicationPage]
})
export class LeaveApplicationPageModule {}
