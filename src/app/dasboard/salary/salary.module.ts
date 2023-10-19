import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryRoutingModule } from './salary-routing.module';
import { SalaryComponent } from './salary.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SalaryComponent
  ],
  imports: [
    CommonModule, FormsModule,
    SalaryRoutingModule
  ]
})
export class SalaryModule { }
