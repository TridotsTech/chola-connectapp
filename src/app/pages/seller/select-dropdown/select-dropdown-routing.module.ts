import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectDropdownPage } from './select-dropdown.page';

const routes: Routes = [
  {
    path: '',
    component: SelectDropdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectDropdownPageRoutingModule {}
