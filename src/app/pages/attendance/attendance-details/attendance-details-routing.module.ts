import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendanceDetailsPage } from './attendance-details.page';

const routes: Routes = [
  {
    path: '',
    component: AttendanceDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceDetailsPageRoutingModule {}
