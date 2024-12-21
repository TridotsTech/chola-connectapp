import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TodayCheckinPageRoutingModule } from './today-checkin-routing.module';
import { TodayCheckinPage } from './today-checkin.page';
import { NgApexchartsModule } from "ng-apexcharts";
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayCheckinPageRoutingModule,
    NgApexchartsModule,
    ComponentsModule
  ],
  declarations: [TodayCheckinPage]
})
export class TodayCheckinPageModule {}
