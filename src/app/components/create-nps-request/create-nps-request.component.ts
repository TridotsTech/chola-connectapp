import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-nps-request',
  templateUrl: './create-nps-request.component.html',
  styleUrls: ['./create-nps-request.component.scss'],
})
export class CreateNpsRequestComponent  implements OnInit {
  @Input() title;
  employeeForm: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) { 

    this.employeeForm = this.formBuilder.group({
      employee: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      additional: [false]
    });
  }

  ngOnInit() {}

  get formControls() {
    return this.employeeForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }

}
