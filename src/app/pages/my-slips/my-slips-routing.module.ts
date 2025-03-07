import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MySlipsPage } from './my-slips.page';

const routes: Routes = [
  {
    path: '',
    component: MySlipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MySlipsPageRoutingModule {}
