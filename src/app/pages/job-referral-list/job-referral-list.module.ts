import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobReferralListPageRoutingModule } from './job-referral-list-routing.module';

import { JobReferralListPage } from './job-referral-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobReferralListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [JobReferralListPage]
})
export class JobReferralListPageModule {}
