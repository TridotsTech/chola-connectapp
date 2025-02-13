import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoluntaryPfPageRoutingModule } from './voluntary-pf-routing.module';

import { VoluntaryPfPage } from './voluntary-pf.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoluntaryPfPageRoutingModule,
    ComponentsModule
  ],
  declarations: [VoluntaryPfPage]
})
export class VoluntaryPfPageModule {}
