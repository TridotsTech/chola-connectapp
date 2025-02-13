import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoluntaryPfPage } from './voluntary-pf.page';

const routes: Routes = [
  {
    path: '',
    component: VoluntaryPfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoluntaryPfPageRoutingModule {}
