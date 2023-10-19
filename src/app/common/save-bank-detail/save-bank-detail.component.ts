import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { SaveBankDetailService } from './save-bank-detail.service';

@Component({
  selector: 'app-save-bank-detail',
  templateUrl: './save-bank-detail.component.html',
  styleUrls: ['./save-bank-detail.component.scss']
})
export class SaveBankDetailComponent {
  employeeBankDetail: any = {};
  @Output() closed = new EventEmitter();

  constructor(private saveBankDetailService: SaveBankDetailService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    @Inject('data') public data: any, private injector: Injector) {
    this.setEmployeeBankDetail();
  }

  closeBankDetail() {
    this.closed.emit(false);
  }

  saveEmployeeBankDetail() {
    if (this.validateBankInfo()) {
      this.spinnerService.show();
      this.saveBankDetailService.SaveEmployeeBankDetail(this.employeeBankDetail).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Employee Bank Details saved successfully.", 'Success');
          this.closed.emit(true);
        }
        this.spinnerService.hide();
      });
    }
  }
  validateBankInfo() {
    if (!this.employeeBankDetail.bankName) {
      this.toastrService.error("Enter bank name.");
      return false;
    }
    else if (!this.employeeBankDetail.bankBranch) {
      this.toastrService.error("Enter bank branch name.");
      return false;
    }
    else if (!this.employeeBankDetail.accountHolder) {
      this.toastrService.error("Enter account holder name.");
      return false;
    }
    else if (!this.employeeBankDetail.accountNumber) {
      this.toastrService.error("Enter account number.");
      return false;
    }
    return true;
  }

  setEmployeeBankDetail() {
    this.employeeBankDetail.bankName = this.data.employeeBankDetail.bankName;
    this.employeeBankDetail.bankBranch = this.data.employeeBankDetail.bankBranch ;
    this.employeeBankDetail.accountHolder = this.data.employeeBankDetail.accountHolder;
    this.employeeBankDetail.accountNumber = this.data.employeeBankDetail.accountNumber;
    this.employeeBankDetail.ifscCode = this.data.employeeBankDetail.ifscCode;
    this.employeeBankDetail.EmployeeID = this.data.employeeBankDetail.EmployeeID ? this.data.employeeBankDetail.EmployeeID : this.data.employeeBankDetail.employeeID;
    this.employeeBankDetail.EmployeeBankDetailId = this.data.employeeBankDetail.employeeBankDetailId;
    this.employeeBankDetail.createdBy = this.data.employeeBankDetail.createdBy;
    this.employeeBankDetail.createdBy = this.data.employeeBankDetail.createdBy;
    this.employeeBankDetail.modifiedBy = this.data.employeeBankDetail.modifiedBy;
    this.employeeBankDetail.action = this.data.employeeBankDetail.action;
  }
}
