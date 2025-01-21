import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApprovalListPageRoutingModule } from './approval-list-routing.module';

import { ApprovalListPage } from './approval-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApprovalListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ApprovalListPage]
})
export class ApprovalListPageModule {}
