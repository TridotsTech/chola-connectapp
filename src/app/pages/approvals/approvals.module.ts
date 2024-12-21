import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalsPageRoutingModule } from './approvals-routing.module';

import { ApprovalsPage } from './approvals.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ApprovalsPage]
})
export class ApprovalsPageModule {}
