import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
import { NgApexchartsModule } from "ng-apexcharts";
// import { FrappeChartsModule } from 'ngx-frappe-chart';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NgApexchartsModule,
    DashboardPageRoutingModule,
    // FrappeChartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
