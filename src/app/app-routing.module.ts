import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service-authentication/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages//home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'webform-child',
    loadChildren: () => import('./pages/webform-child/webform-child.module').then(m => m.WebformChildPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-webformchild',
    loadChildren: () => import('./pages/edit-webformchild/edit-webformchild.module').then(m => m.EditWebformchildPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'forms/:id',
    loadChildren: () => import('./pages/forms/forms.module').then( m => m.FormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'forms/:id/:order_id',
    loadChildren: () => import('./pages/forms/forms.module').then( m => m.FormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'forms/:id/:sale_order_id',
    loadChildren: () => import('./pages/forms/forms.module').then( m => m.FormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'item-popup',
    loadChildren: () => import('./pages/seller/item-popup/item-popup.module').then( m => m.ItemPopupPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'select-dropdown',
    loadChildren: () => import('./pages/seller/select-dropdown/select-dropdown.module').then( m => m.SelectDropdownPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'sales-order-list',
    loadChildren: () => import('./pages/order/sales-order-list/sales-order-list.module').then( m => m.SalesOrderListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'list/:route_1',
    loadChildren: () => import('./pages/order/sales-order-list/sales-order-list.module').then( m => m.SalesOrderListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'list/:route_1/:route_2',
    loadChildren: () => import('./pages/order/sales-order-list/sales-order-list.module').then( m => m.SalesOrderListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'list/:route_1/:route_2/:route_3',
    loadChildren: () => import('./pages/order/sales-order-list/sales-order-list.module').then( m => m.SalesOrderListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'list/:route_1/:route_3',
    loadChildren: () => import('./pages/order/sales-order-list/sales-order-list.module').then( m => m.SalesOrderListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'sales-order-details',
    loadChildren: () => import('./pages/order/sales-order-details/sales-order-details.module').then( m => m.SalesOrderDetailsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'sales-order-details/:route_1',
    loadChildren: () => import('./pages/order/sales-order-details/sales-order-details.module').then( m => m.SalesOrderDetailsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'add-attendance',
    loadChildren: () => import('./pages/attendance/add-attendance/add-attendance.module').then( m => m.AddAttendancePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'attendance-list',
    loadChildren: () => import('./pages/attendance/attendance-list/attendance-list.module').then( m => m.AttendanceListPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'attendance-checkin',
    loadChildren: () => import('./pages/attendance/attendance-checkin/attendance-checkin.module').then( m => m.AttendanceCheckinPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-form',
    loadChildren: () => import('./pages/web-form/edit-forms/edit-forms.module').then( m => m.EditFormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-form/:id',
    loadChildren: () => import('./pages/web-form/edit-forms/edit-forms.module').then( m => m.EditFormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'edit-form/:id/:order_id',
    loadChildren: () => import('./pages/web-form/edit-forms/edit-forms.module').then( m => m.EditFormsPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./pages/CRM/my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/order/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'detail/:route_1',
    loadChildren: () => import('./pages/order/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'detail/:route_1/:route_2',
    loadChildren: () => import('./pages/order/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'navigation-link',
    loadChildren: () => import('./pages/order/navigation-link/navigation-link.module').then( m => m.NavigationLinkPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'user-list',
    loadChildren: () => import('./pages/user-list/user-list.module').then( m => m.UserListPageModule)
  },
  {
    path: 'pdf-viewer',
    loadChildren: () => import('./pages/Go1-onsite/pdf-viewer/pdf-viewer.module').then( m => m.PdfViewerPageModule)
  },
  {
    path: 'pdf-viewer/:id',
    loadChildren: () => import('./pages/Go1-onsite/pdf-viewer/pdf-viewer.module').then( m => m.PdfViewerPageModule)
  },
  {
    path: 'employee-attendance-tool',
    loadChildren: () => import('./pages/order/employee-attendance-tool/employee-attendance-tool.module').then( m => m.EmployeeAttendanceToolPageModule)
  },
  {
    path: 'holiday-list',
    loadChildren: () => import('./pages/order/holiday-list/holiday-list.module').then( m => m.HolidayListPageModule)
  },
  {
    path: 'leave-application-detail',
    loadChildren: () => import('./pages/order/leave-application-detail/leave-application-detail.module').then( m => m.LeaveApplicationDetailPageModule)
  },
  {
    path: 'leave-application-detail/:id',
    loadChildren: () => import('./pages/order/leave-application-detail/leave-application-detail.module').then( m => m.LeaveApplicationDetailPageModule)
  },
  {
    path: 'page-settings',
    loadChildren: () => import('./pages/page-settings/page-settings.module').then( m => m.PageSettingsPageModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
  },
  {
    path: 'check-in',
    loadChildren: () => import('./pages/check-in/check-in.module').then( m => m.CheckInPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'report',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'report/:id',
    loadChildren: () => import('./pages/report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'report-detail',
    loadChildren: () => import('./pages/report-detail/report-detail.module').then( m => m.ReportDetailPageModule)
  },
  {
    path: 'web-page',
    loadChildren: () => import('./pages/web-page/web-page.module').then( m => m.WebPagePageModule)
  },
  {
    path: 'web-page/:page_route',
    loadChildren: () => import('./pages/web-page/web-page.module').then( m => m.WebPagePageModule)
  },
  {
    path: 'web-page/:page_route/:page_route_1',
    loadChildren: () => import('./pages/web-page/web-page.module').then( m => m.WebPagePageModule)
  },

  {
    path: 'leave-application',
    loadChildren: () => import('./pages/order/leave-application/leave-application.module').then( m => m.LeaveApplicationPageModule)
  },
  {
    path: 'leave-application/:id',
    loadChildren: () => import('./pages/order/leave-application/leave-application.module').then( m => m.LeaveApplicationPageModule)
  },
  {
    path: 'leave-application/:id/:name',
    loadChildren: () => import('./pages/order/leave-application/leave-application.module').then( m => m.LeaveApplicationPageModule)
  },
  {
    path: 'today-checkin',
    loadChildren: () => import('./pages/today-checkin/today-checkin.module').then( m => m.TodayCheckinPageModule)
  },
  {
    path: 'job-applicant-list',
    loadChildren: () => import('./pages/job-applicant-list/job-applicant-list.module').then( m => m.JobApplicantListPageModule)
  },
  {
    path: 'leave-request',
    loadChildren: () => import('./pages/order/leave-request/leave-request.module').then( m => m.LeaveRequestPageModule)
  },
  {
    path: 'leave-request/:id',
    loadChildren: () => import('./pages/order/leave-request/leave-request.module').then( m => m.LeaveRequestPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'customize',
    loadChildren: () => import('./pages/customize-form/customize-form.module').then( m => m.CustomizeFormPageModule)
  },
  {
    path: 'customize/:id',
    loadChildren: () => import('./pages/customize-form/customize-form.module').then( m => m.CustomizeFormPageModule)
  },
  {
    path: 'leave-withdrawal',
    loadChildren: () => import('./pages/leave-module/leave-withdrawal/leave-withdrawal.module').then( m => m.LeaveWithdrawalPageModule)
  },
  {
    path: 'leave-withdrawal/:id',
    loadChildren: () => import('./pages/leave-module/leave-withdrawal/leave-withdrawal.module').then( m => m.LeaveWithdrawalPageModule)
  },
  {
    path: 'buy-back-calculator',
    loadChildren: () => import('./pages/buy-back-module/buy-back-calculator/buy-back-calculator.module').then( m => m.BuyBackCalculatorPageModule)
  },
  {
    path: 'performance-evaluation',
    loadChildren: () => import('./pages/probation-module/performance-evaluation/performance-evaluation.module').then( m => m.PerformanceEvaluationPageModule)
  },
  {
    path: 'performance-evaluation/:id',
    loadChildren: () => import('./pages/probation-module/performance-evaluation/performance-evaluation.module').then( m => m.PerformanceEvaluationPageModule)
  },
  {
    path: 'approvals',
    loadChildren: () => import('./pages/approvals/approvals.module').then( m => m.ApprovalsPageModule)
  },
  {
    path: 'team-member-list',
    loadChildren: () => import('./pages/team-member-list/team-member-list.module').then( m => m.TeamMemberListPageModule)
  },
  {
    path: 'approval-list',
    loadChildren: () => import('./pages/approval-list/approval-list.module').then( m => m.ApprovalListPageModule)
  },
  {
    path: 'job-referral-list',
    loadChildren: () => import('./pages/job-referral-list/job-referral-list.module').then( m => m.JobReferralListPageModule)
  },
  {
    path: 'salaryslip',
    loadChildren: () => import('./pages/salaryslip/salaryslip.module').then( m => m.SalaryslipPageModule)
  },
  {
    path: 'voluntary-pf',
    loadChildren: () => import('./pages/voluntary-pf/voluntary-pf.module').then( m => m.VoluntaryPfPageModule)
  },
  {
    path: 'documents',
    loadChildren: () => import('./pages/documents/documents.module').then( m => m.DocumentsPageModule)
  },
  {
    path: 'buyback-detail',
    loadChildren: () => import('./pages/buyback-detail/buyback-detail.module').then( m => m.BuybackDetailPageModule)
  },
  {
    path: 'buyback-detail/:id',
    loadChildren: () => import('./pages/buyback-detail/buyback-detail.module').then( m => m.BuybackDetailPageModule)
  },
  {
    path: 'emp-transfer',
    loadChildren: () => import('./pages/order/emp-transfer/emp-transfer.module').then( m => m.EmpTransferPageModule)
  },
  {
    path: 'my-slips',
    loadChildren: () => import('./pages/my-slips/my-slips.module').then( m => m.MySlipsPageModule)
  },
  {
    path: 'new-resignation',
    loadChildren: () => import('./pages/new-resignation/new-resignation.module').then( m => m.NewResignationPageModule)
  },
  {
    path: 'resignation',
    loadChildren: () => import('./pages/resignation/resignation.module').then( m => m.ResignationPageModule)
  },
  {
    path: 'emp-transfer-detail',
    loadChildren: () => import('./pages/emp-transfer-detail/emp-transfer-detail.module').then( m => m.EmpTransferDetailPageModule)
  },
  {
    path: 'emp-transfer-detail/:id',
    loadChildren: () => import('./pages/emp-transfer-detail/emp-transfer-detail.module').then( m => m.EmpTransferDetailPageModule)
  },
  {
    path: 'car-purchase',
    loadChildren: () => import('./pages/car-purchase/car-purchase.module').then( m => m.CarPurchasePageModule)
  },
  {
      path: '**',
      redirectTo: '/page-not-found'
  },
 


 

 

  

 


 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
