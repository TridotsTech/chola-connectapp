import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalaryslipPage } from './salaryslip.page';

const routes: Routes = [
  {
    path: '',
    component: SalaryslipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaryslipPageRoutingModule {}
