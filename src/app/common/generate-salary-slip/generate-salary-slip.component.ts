import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { GenerateSalarySlipService } from './generate-salary-slip.service';

@Component({
  selector: 'app-generate-salary-slip',
  templateUrl: './generate-salary-slip.component.html',
  styleUrls: ['./generate-salary-slip.component.scss']
})
export class GenerateSalarySlipComponent {
  @Output() closed = new EventEmitter();
  employeeSalarySlip: any = {};
  years: number[] = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  constructor(private generateSalarySlipService: GenerateSalarySlipService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    @Inject('data') public data: any, private injector: Injector) {
    this.setGenerateSalarySlip();
  }

  closeSalaryForm() {
    this.closed.emit(false);
  }

  saveEmployeeSalarySlip() {
    if (!this.employeeSalarySlip.year) {
      this.toastrService.error("Please select year.");
    }
    else if (!this.employeeSalarySlip.month) {
      this.toastrService.error("Please select month.");
    }
    else {
      this.spinnerService.show();
      this.generateSalarySlipService.SaveEmployeeSalarySlip(this.employeeSalarySlip).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Salary Slip Updated Successfully.", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
      });
    }
  }

  calculateNetSalary() {
    const basicPay = this.employeeSalarySlip.basicPay;
    const allowances = this.employeeSalarySlip.allowances;
    const deductions = this.employeeSalarySlip.deductions;
    this.employeeSalarySlip.netSalary = basicPay + allowances - deductions;
  }

  setGenerateSalarySlip() {
    this.employeeSalarySlip.month = '';
    this.employeeSalarySlip.deductions = 0;
    this.employeeSalarySlip.allowances = 0;
    this.employeeSalarySlip.netSalary = 0;
    this.employeeSalarySlip.employeeID = this.data.salaryObj.employeeID;
    this.employeeSalarySlip.employeeSalaryID = this.data.salaryObj.employeeSalaryID;
    this.employeeSalarySlip.year = 0;
    this.employeeSalarySlip.currency = this.data.salaryObj.currency;
    this.employeeSalarySlip.basicPay = 0;
    if (this.data.salaryObj.payType == 'monthly') {
      this.employeeSalarySlip.basicPay = this.data.salaryObj.monthlyPay;
    }
    else if (this.data.salaryObj.payType == 'hourly') {
      this.employeeSalarySlip.basicPay = this.data.salaryObj.hourlyPay;
    }
    else if (this.data.salaryObj.payType == 'daily') {
      this.employeeSalarySlip.basicPay = this.data.salaryObj.dailyPay;
    }
    else if (this.data.salaryObj.payType == 'weekly') {
      this.employeeSalarySlip.basicPay = this.data.salaryObj.weeklyPay;
    }
  }
}
