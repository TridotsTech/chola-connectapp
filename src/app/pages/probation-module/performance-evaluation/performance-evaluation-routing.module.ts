import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerformanceEvaluationPage } from './performance-evaluation.page';

const routes: Routes = [
  {
    path: '',
    component: PerformanceEvaluationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceEvaluationPageRoutingModule {}
