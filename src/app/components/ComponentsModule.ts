import { DropdownComponent } from './Timesheet/dropdown/dropdown.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MobileHeaderComponent } from './headers/mobile-header/mobile-header.component';
import { FiltersComponent } from './categories/filters/filters.component';
import { TabsButtonComponent } from './tabs-button/tabs-button.component';
import { ForgetComponent } from './auth/forget/forget.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { MailOtpComponent } from './auth/mail-otp/mail-otp.component';
import { NewSignupComponent } from './auth/new-signup/new-signup.component';
import { NormalLoginComponent } from './auth/normal-login/normal-login.component';
import { OtpLoginComponent } from './auth/otp-login/otp-login.component';
import { RegisteRComponent } from './auth/registe-r/registe-r.component';
import { OrdersComponent } from './customer-details/orders/orders.component';
import { NoRecordFoundComponent } from './no-record-found/no-record-found.component';
import { WizardFormsComponent } from './forms/wizard-forms/wizard-forms.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { QuillModule } from 'ngx-quill';
import { CommonDetailComponent } from './common-detail/common-detail.component'; //
import { AttachmentsComponent } from './customer-details/attachments/attachments.component'; //
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CheckinCheckoutComponent } from './checkin-checkout/checkin-checkout.component';
import { TimerComponent } from './Timesheet/timer/timer.component';
import { ShowImageComponent } from './show-image/show-image.component';
import { SideTabsComponent } from './side-menu/side-tabs/side-tabs.component'; //Web
import { SidemenuHeaderComponent } from './headers/sidemenu-header/sidemenu-header.component'; //Web
import { WebsiteFormsComponent } from './forms/website-forms/website-forms.component';
import { TagsComponent } from './CRM/tags/tags.component';
import { EditWebsiteFormsComponent } from './forms/edit-website-forms/edit-website-forms.component';
import { DetailComponent } from './customer-details/detail/detail.component';
import { EmployeeAttendanceFilterComponent } from './customer-details/employee-attendance-filter/employee-attendance-filter.component';
import { PayrollDetailComponent } from './customer-details/payroll-detail/payroll-detail.component';
import { WebsiteFormHeaderComponent } from './headers/website-form-header/website-form-header.component';
import { QuickFormsComponent } from './forms/quick-forms/quick-forms.component';
import { YearPopupComponent } from './year-popup/year-popup.component';
import { NewWizardFormComponent } from './forms/new-wizard-form/new-wizard-form.component';
import { CheckinMultipleComponent } from './checkin-multiple/checkin-multiple.component';
import { AssignToComponent } from './assign-to/assign-to.component';
import { CommonSearchComponent } from './common-search/common-search.component';
import { ApexChartComponent } from './apex-chart/apex-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { StatusComponent } from './CRM/status/status.component';
import { RevoGridTableComponent } from './revo-grid-table/revo-grid-table.component';
import { ReportFilterComponent } from './report-filter/report-filter.component';
import { EmployeeListComponent } from './customer-details/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './customer-details/employee-detail/employee-detail.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { EmployeeDepartmentComponent } from './customer-details/employee-department/employee-department.component';
import { CalendarModule } from 'angular-calendar';
import { CreateFormsComponent } from './customer-details/create-forms/create-forms.component';
import { LeaveApplicationListComponent } from './customer-details/leave-application-list/leave-application-list.component';
import { TabFilterComponent } from './customer-details/tab-filter/tab-filter.component';
import { CommonDashboardComponent } from './common-dashboard/common-dashboard.component';
import { SalarySlipDetailComponent } from './customer-details/salary-slip-detail/salary-slip-detail.component';
import { DetailComponentComponent } from './customer-details/detail-component/detail-component.component';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { ExpenseClaimListComponent } from './customer-details/expense-claim-list/expense-claim-list.component';
import { HolidayListsComponent } from './customer-details/holiday-lists/holiday-lists.component';
import { MonthFilterComponent } from './customer-details/month-filter/month-filter.component';
import { LeaveDetailComponent } from './customer-details/leave-detail/leave-detail.component';
import { DepartmentDropdownComponent } from './customer-details/department-dropdown/department-dropdown.component'; //
import { AttendanceListComponent } from './customer-details/attendance-list/attendance-list.component'; //Web
import { AssigneesComponent } from './task/assignees/assignees.component';
import { MobileAttendanceComponent } from './customer-details/mobile-attendance/mobile-attendance.component';
import { AttendanceSummaryComponent } from './customer-details/attendance-summary/attendance-summary.component';
import { DetailDirectoryComponent } from './customer-details/detail-directory/detail-directory.component';
import { JobApplicantComponent } from './customer-details/job-applicant/job-applicant.component';
import { MobileHrAttendanceComponent } from './customer-details/mobile-hr-attendance/mobile-hr-attendance.component';
import { MobileTodayCheckinComponent } from './customer-details/mobile-today-checkin/mobile-today-checkin.component';
import { QuickviewdragComponent } from './quickviewdrag/quickviewdrag.component';
import { ApexChartDashboardComponent } from './apex-chart-dashboard/apex-chart-dashboard.component';
import { FreezeColumnComponent } from './freeze-column/freeze-column.component';
import { EmployeeReadonlyScreenComponent } from './employee-readonly-screen/employee-readonly-screen.component';
import { CommonGridTableComponent } from './common-grid-table/common-grid-table.component';
import { GridAttendanceComponent } from './grid-attendance/grid-attendance.component';
import { JobOpeningListComponent } from './customer-details/job-opening-list/job-opening-list.component';
import { EmployeeLeaveGridComponent } from './employee-leave-grid/employee-leave-grid.component';
import { LightgalleryModule } from 'lightgallery/angular';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { CustomCalendarComponent } from './custom-calendar/custom-calendar.component'
import { MonthCalendarComponent } from './month-calendar/month-calendar.component'
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component'
import { CommonTextBoxComponent } from './common-text-box/common-text-box.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { LeavePreviewWithdrawFormComponent } from './leaves-module/leave-preview-withdraw-form/leave-preview-withdraw-form.component';
import { RegularizationFormComponent } from './leaves-module/regularization-form/regularization-form.component';
import { RegularizationDetailComponent } from './regularization-detail/regularization-detail.component';
import { LetterRequestDetailComponent } from './letter-request-detail/letter-request-detail.component';
import { CreateLetterRequestComponent } from './create-letter-request/create-letter-request.component';
import { JobReferralDetailComponent } from './job-referral-detail/job-referral-detail.component';
import { ReferFriendFormComponent } from './refer-friend-form/refer-friend-form.component';
import { LeaveTypeComponent } from './leaves-module/leave-type/leave-type.component';
import { BuybackFormComponent } from './customer-details/buyback-form/buyback-form.component';
import { TicketListComponent } from './customer-details/ticket-list/ticket-list.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { ShowTicketDetailComponent } from './show-ticket-detail/show-ticket-detail.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MobileHeaderComponent,
    FiltersComponent,
    TabsButtonComponent,
    ForgetComponent,
    LogInComponent,
    MailOtpComponent,
    NewSignupComponent,
    NormalLoginComponent,
    OtpLoginComponent,
    RegisteRComponent,
    OrdersComponent,
    NoRecordFoundComponent,
    WizardFormsComponent,
    MobileMenuComponent,
    CommonDetailComponent,
    CheckinCheckoutComponent,
    TimerComponent,
    DropdownComponent,
    AttachmentsComponent,
    ShowImageComponent,
    SideTabsComponent,
    SidemenuHeaderComponent,
    WebsiteFormsComponent,
    TagsComponent,
    EditWebsiteFormsComponent,
    DetailComponent,
    EmployeeAttendanceFilterComponent,
    PayrollDetailComponent,
    WebsiteFormHeaderComponent,
    QuickFormsComponent,
    YearPopupComponent,
    NewWizardFormComponent,
    CheckinMultipleComponent,
    AssignToComponent,
    CommonSearchComponent,
    ApexChartComponent,
    StatusComponent,
    RevoGridTableComponent,
    ReportFilterComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    MarkAttendanceComponent,
    EmployeeDepartmentComponent,
    CreateFormsComponent,
    LeaveApplicationListComponent,
    TabFilterComponent,
    CommonDashboardComponent,
    SalarySlipDetailComponent,
    DetailComponentComponent,
    SkeletonLoaderComponent,
    ExpenseClaimListComponent,
    HolidayListsComponent,
    MonthFilterComponent,
    LeaveDetailComponent,
    DepartmentDropdownComponent,
    AttendanceListComponent,
    AssigneesComponent,
    MobileAttendanceComponent,
    AttendanceSummaryComponent,
    DetailDirectoryComponent,
    JobApplicantComponent,
    MobileHrAttendanceComponent,
    MobileTodayCheckinComponent,
    QuickviewdragComponent,
    ApexChartDashboardComponent,
    FreezeColumnComponent,
    EmployeeReadonlyScreenComponent,
    CommonGridTableComponent,
    GridAttendanceComponent,
    JobOpeningListComponent,
    EmployeeLeaveGridComponent,
    DateTimePickerComponent,
    CustomCalendarComponent,
    MonthCalendarComponent,
    MonthYearPickerComponent,
    CommonTextBoxComponent,
    TimePickerComponent,
    LeavePreviewWithdrawFormComponent,
    RegularizationFormComponent,
    RegularizationDetailComponent,
    LetterRequestDetailComponent,
    CreateLetterRequestComponent,
    JobReferralDetailComponent,
    ReferFriendFormComponent,
    LeaveTypeComponent,
    BuybackFormComponent,
    TicketListComponent,
    TicketDetailsComponent,
    ShowTicketDetailComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    QuillModule.forRoot(),
    DragDropModule,
    NgApexchartsModule,
    CalendarModule,
    LightgalleryModule
  ],
  exports: [
    HeaderComponent,
    MobileHeaderComponent,
    FiltersComponent,
    TabsButtonComponent,
    ForgetComponent,
    LogInComponent,
    MailOtpComponent,
    NewSignupComponent,
    NormalLoginComponent,
    OtpLoginComponent,
    RegisteRComponent,
    OrdersComponent,
    NoRecordFoundComponent,
    WizardFormsComponent,
    MobileMenuComponent,
    CommonDetailComponent,
    CheckinCheckoutComponent,
    TimerComponent,
    DropdownComponent,
    AttachmentsComponent,
    ShowImageComponent,
    SideTabsComponent,
    SidemenuHeaderComponent,
    WebsiteFormsComponent,
    TagsComponent,
    EditWebsiteFormsComponent,
    DetailComponent,
    EmployeeAttendanceFilterComponent,
    PayrollDetailComponent,
    WebsiteFormHeaderComponent,
    QuickFormsComponent,
    YearPopupComponent,
    NewWizardFormComponent,
    CheckinMultipleComponent,
    AssignToComponent,
    CommonSearchComponent,
    ApexChartComponent,
    StatusComponent,
    RevoGridTableComponent,
    ReportFilterComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
    MarkAttendanceComponent,
    EmployeeDepartmentComponent,
    CreateFormsComponent,
    LeaveApplicationListComponent,
    TabFilterComponent,
    CommonDashboardComponent,
    SalarySlipDetailComponent,
    DetailComponentComponent,
    SkeletonLoaderComponent,
    ExpenseClaimListComponent,
    HolidayListsComponent,
    MonthFilterComponent,
    LeaveDetailComponent,
    DepartmentDropdownComponent,
    AttendanceListComponent,
    AssigneesComponent,
    MobileAttendanceComponent,
    AttendanceSummaryComponent,
    DetailDirectoryComponent,
    JobApplicantComponent,
    MobileHrAttendanceComponent,
    MobileTodayCheckinComponent,
    QuickviewdragComponent,
    ApexChartDashboardComponent,
    FreezeColumnComponent,
    EmployeeReadonlyScreenComponent,
    CommonGridTableComponent,
    GridAttendanceComponent,
    JobOpeningListComponent,
    EmployeeLeaveGridComponent,
    DateTimePickerComponent,
    CustomCalendarComponent,
    MonthCalendarComponent,
    MonthYearPickerComponent,
    CommonTextBoxComponent,
    TimePickerComponent,
    LeavePreviewWithdrawFormComponent,
    RegularizationFormComponent,
    RegularizationDetailComponent,
    LetterRequestDetailComponent,
    CreateLetterRequestComponent, 
    JobReferralDetailComponent,
    ReferFriendFormComponent,
    LeaveTypeComponent,
    BuybackFormComponent,
    TicketListComponent,
    TicketDetailsComponent,
    ShowTicketDetailComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ComponentsModule {
}

