import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpTransferDetailPageRoutingModule } from './emp-transfer-detail-routing.module';

import { EmpTransferDetailPage } from './emp-transfer-detail.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpTransferDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmpTransferDetailPage]
})
export class EmpTransferDetailPageModule {}
