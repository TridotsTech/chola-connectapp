import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFormsPage } from './edit-forms.page';

const routes: Routes = [
  {
    path: '',
    component: EditFormsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFormsPageRoutingModule {}
