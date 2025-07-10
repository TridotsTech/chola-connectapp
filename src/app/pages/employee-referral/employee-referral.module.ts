import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeReferralPageRoutingModule } from './employee-referral-routing.module';

import { EmployeeReferralPage } from './employee-referral.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeReferralPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmployeeReferralPage]
})
export class EmployeeReferralPageModule {}
