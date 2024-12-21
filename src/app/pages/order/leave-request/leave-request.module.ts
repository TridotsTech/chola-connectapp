import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveRequestPageRoutingModule } from './leave-request-routing.module';

import { LeaveRequestPage } from './leave-request.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    LeaveRequestPageRoutingModule
  ],
  declarations: [LeaveRequestPage]
})
export class LeaveRequestPageModule {}
