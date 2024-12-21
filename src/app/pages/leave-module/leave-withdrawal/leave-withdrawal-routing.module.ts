import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveWithdrawalPage } from './leave-withdrawal.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveWithdrawalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveWithdrawalPageRoutingModule {}
