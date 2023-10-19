import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { QuillModule } from 'ngx-quill';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { BankDetailComponent } from './components/bank-detail/bank-detail.component';
import { SalaryComponent } from './components/salary/salary.component';
import { WebcamModule } from 'ngx-webcam';
import { WebcamComponent } from '../../common/webcam/webcam.component';
import { SharedModule } from '../../shared/shared.module';
import { EditCompanyProfileComponent } from '../../common/edit-company-profile/edit-company-profile.component';
import { EditEmployeeComponent } from '../../common/edit-employee/edit-employee.component';
import { AddSalaryComponent } from '../../common/add-salary/add-salary.component';
import { GenerateSalarySlipComponent } from '../../common/generate-salary-slip/generate-salary-slip.component';
import { SaveBankDetailComponent } from '../../common/save-bank-detail/save-bank-detail.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    EmployeesComponent,
    AddEmployeeComponent,
    EmployeeDetailComponent,
    PersonalInformationComponent,
    BankDetailComponent,
    SalaryComponent,
    WebcamComponent,
    EditCompanyProfileComponent,
    EditEmployeeComponent,
    AddSalaryComponent,
    GenerateSalarySlipComponent,
    SaveBankDetailComponent
  ],
  imports: [
    CommonModule, FormsModule, WebcamModule,NgxIntlTelInputModule,
    SharedModule, EmployeesRoutingModule, QuillModule.forRoot()
  ],
  entryComponents: [EditCompanyProfileComponent, EditEmployeeComponent, AddSalaryComponent, GenerateSalarySlipComponent, SaveBankDetailComponent]
})
export class EmployeesModule { }
