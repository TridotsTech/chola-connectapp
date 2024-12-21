import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveWithdrawalPageRoutingModule } from './leave-withdrawal-routing.module';

import { LeaveWithdrawalPage } from './leave-withdrawal.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveWithdrawalPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [LeaveWithdrawalPage]
})
export class LeaveWithdrawalPageModule {}
