import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfViewerPage } from './PdfViewerPage';

const routes: Routes = [
  {
    path: '',
    component: PdfViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfViewerPageRoutingModule {}
