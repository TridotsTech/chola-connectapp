import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobReferralListPage } from './job-referral-list.page';

const routes: Routes = [
  {
    path: '',
    component: JobReferralListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobReferralListPageRoutingModule {}
