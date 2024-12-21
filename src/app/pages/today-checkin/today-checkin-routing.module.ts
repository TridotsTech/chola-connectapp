import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayCheckinPage } from './today-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: TodayCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayCheckinPageRoutingModule {}
