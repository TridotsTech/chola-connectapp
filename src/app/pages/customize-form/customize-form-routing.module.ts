import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomizeFormPage } from './customize-form.page';

const routes: Routes = [
  {
    path: '',
    component: CustomizeFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomizeFormPageRoutingModule {}
