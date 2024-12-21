import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // {
      //   path: 'category',
      //   loadChildren: () => import('../../pages/category/category.module').then(m => m.CategoryPageModule)
      // },
      {
        path: 'home',
        loadChildren: () => import('../../pages/home/home.module').then(m => m.HomePageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../../pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
      },
      {
        path: 'sales-order-list',
        loadChildren: () => import('../../pages/order/sales-order-list/sales-order-list.module').then(m => m.SalesOrderListPageModule),
      },
      {
        path: 'my-profile',
        loadChildren: () => import('../../pages/CRM/my-profile/my-profile.module').then(m => m.MyProfilePageModule)
      },
      // {
      //   path: 'kanban-lead',
      //   loadChildren: () => import('../../pages/CRM/kanban-lead/kanban-lead.module').then(m => m.KanbanLeadPageModule)
      // },
      // {
      //   path: 'messages',
      //   loadChildren: () => import('../../pages/CRM/messages/messages.module').then(m => m.MessagesPageModule)
      // },
      // {
      //   path: 'customer',
      //   loadChildren: () => import('../../pages/customer/customer.module').then(m => m.CustomerPageModule),
      // },
      {
        path: 'leave-application-detail',
        loadChildren: () => import('../../pages/order/leave-application-detail/leave-application-detail.module').then( m => m.LeaveApplicationDetailPageModule)
      },
      // {
      //   path: 'list',
      //   loadChildren: () => import('../../pages/order/sales-order-list/sales-order-list.module').then(m => m.SalesOrderListPageModule),
      // },
      {
        path: 'list/:route_1',
        loadChildren: () => import('../../pages/order/sales-order-list/sales-order-list.module').then(m => m.SalesOrderListPageModule),
      },
      // {
      //   path: 'timesheet-detail',
      //   loadChildren: () => import('../../pages/timesheet-detail/timesheet-detail.module').then( m => m.TimesheetDetailPageModule)
      // },
      // {
      //   path: 'timesheet-detail/:id',
      //   loadChildren: () => import('../../pages/timesheet-detail/timesheet-detail.module').then( m => m.TimesheetDetailPageModule)
      // },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
