import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAttendancePage } from './add-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: AddAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAttendancePageRoutingModule {}
