import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewResignationPage } from './new-resignation.page';

const routes: Routes = [
  {
    path: '',
    component: NewResignationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewResignationPageRoutingModule {}
