import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalaryslipPageRoutingModule } from './salaryslip-routing.module';

import { SalaryslipPage } from './salaryslip.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalaryslipPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SalaryslipPage]
})
export class SalaryslipPageModule {}
