import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-leave-grid',
  templateUrl: './employee-leave-grid.component.html',
  styleUrls: ['./employee-leave-grid.component.scss'],
})
export class EmployeeLeaveGridComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  keyData = [
    "Employee Name",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  employeeList = [
    {
      'employee_name': 'Kalai Selvam',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Ranjith Kesavan',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Ravikumar',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'John Fedrick',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Kartheek',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Chandirasekar',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Abishek',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    },
    {
      'employee_name': 'Ramanathan',
      'employee_id': 'E001',

      leaveLists : [
        {
          month: 'January',
          leave_days: 5,
        },
        {
          month: 'Febraury',
          leave_days: 5,
        },
        {
          month: 'March',
          leave_days: 5,
        },
        {
          month: 'April',
          leave_days: 5,
        },
        {
          month: 'May',
          leave_days: 5,
        },
        {
          month: 'June',
          leave_days: 5,
        },
        {
          month: 'July',
          leave_days: 5,
        },
        {
          month: 'August',
          leave_days: 5,
        },
        {
          month: 'September',
          leave_days: 5,
        },
        {
          month: 'October',
          leave_days: 5,
        },
        {
          month: 'November',
          leave_days: 5,
        },
        {
          month: 'December',
          leave_days: 5,
        },
      ]
    }
  ]

}
