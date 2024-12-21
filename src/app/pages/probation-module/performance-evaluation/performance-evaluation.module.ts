import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerformanceEvaluationPageRoutingModule } from './performance-evaluation-routing.module';

import { PerformanceEvaluationPage } from './performance-evaluation.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerformanceEvaluationPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [PerformanceEvaluationPage]
})
export class PerformanceEvaluationPageModule {}
