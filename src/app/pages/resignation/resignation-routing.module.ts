import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResignationPage } from './resignation.page';

const routes: Routes = [
  {
    path: '',
    component: ResignationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResignationPageRoutingModule {}
