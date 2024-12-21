import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveApplicationDetailPage } from './leave-application-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveApplicationDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveApplicationDetailPageRoutingModule {}
