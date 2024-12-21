import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobApplicantListPage } from './job-applicant-list.page';

const routes: Routes = [
  {
    path: '',
    component: JobApplicantListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobApplicantListPageRoutingModule {}
