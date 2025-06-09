import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesOrderListPageRoutingModule } from './sales-order-list-routing.module';

import { SalesOrderListPage } from './sales-order-list.page';
import { ComponentsModule } from 'src/app/components/ComponentsModule';
// import { AttendanceListPageModule } from '../../attendance/attendance-list/attendance-list.module';
import { AttendanceListPage } from '../../attendance/attendance-list/attendance-list.page';
// import { RevoGridModule } from '@revolist/angular-datagrid'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesOrderListPageRoutingModule,
    ComponentsModule,
    // RevoGridModule
    // IonicPageModule.forChild(AttendanceListPage),
    // AttendanceListPageModule
  ],
  declarations: [SalesOrderListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  // exports : [ AttendanceListPage ]
})
export class SalesOrderListPageModule {}
