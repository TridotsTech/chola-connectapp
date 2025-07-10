import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeReferralPage } from './employee-referral.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeReferralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeReferralPageRoutingModule {}
