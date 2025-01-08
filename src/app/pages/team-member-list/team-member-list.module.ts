import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamMemberListPageRoutingModule } from './team-member-list-routing.module';

import { TeamMemberListPage } from './team-member-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamMemberListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TeamMemberListPage]
})
export class TeamMemberListPageModule {}
