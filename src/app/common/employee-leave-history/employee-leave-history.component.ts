import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { AttendenceSystemService } from '../../dasboard/attendence-system/attendence-system.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';

@Component({
  selector: 'app-employee-leave-history',
  templateUrl: './employee-leave-history.component.html',
  styleUrls: ['./employee-leave-history.component.scss']
})
export class EmployeeLeaveHistoryComponent {
  @Output() closed = new EventEmitter();
  employeeData: any = {};
  employeelist: any = [];
  config_pgEmployeeList = {
    id: "pg_EmployeeList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private attendenceSystemService: AttendenceSystemService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    @Inject('data') public data: any, private injector: Injector) {
    this.employeeData = data;
    this.getEmployeeLeaveRecordByEmployeeId();
  }

  closeForm() {
    this.closed.emit(false);
  }

  getEmployeeLeaveRecordByEmployeeId() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "employeeId": this.employeeData.employeeId,
      "pageIndex": 1,
      "pageSize": -1,
    };
    this.spinnerService.show();
    this.attendenceSystemService.getEmployeeLeaveRecordByEmployeeId(model).subscribe(data => {
      if (data.status) {
        this.employeelist = data.employeelist;
        this.config_pgEmployeeList.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }
}
