import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmployeeFormComponent } from './employee-form.component';

@NgModule({
  declarations: [EmployeeFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [EmployeeFormComponent]
})
export class EmployeeFormModule { } 