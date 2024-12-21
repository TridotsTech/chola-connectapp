import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavigationLinkPage } from './navigation-link.page';

const routes: Routes = [
  {
    path: '',
    component: NavigationLinkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavigationLinkPageRoutingModule {}
