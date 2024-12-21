import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveApplicationPage } from './leave-application.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveApplicationPageRoutingModule {}
