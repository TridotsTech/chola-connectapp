import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobApplicantListPageRoutingModule } from './job-applicant-list-routing.module';

import { JobApplicantListPage } from './job-applicant-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    JobApplicantListPageRoutingModule
  ],
  declarations: [JobApplicantListPage]
})
export class JobApplicantListPageModule {}
