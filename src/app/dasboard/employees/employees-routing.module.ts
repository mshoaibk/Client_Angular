import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component'
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

const routes: Routes = [{ path: '', component: EmployeesComponent },
{ path: 'add-employee', component: AddEmployeeComponent },
{ path: ':id', component: EmployeeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
