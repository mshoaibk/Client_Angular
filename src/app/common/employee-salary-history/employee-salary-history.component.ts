import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AttendenceSystemService } from 'src/app/dasboard/attendence-system/attendence-system.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-employee-salary-history',
  templateUrl: './employee-salary-history.component.html',
  styleUrls: ['./employee-salary-history.component.scss']
})
export class EmployeeSalaryHistoryComponent {
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
    this.getEmployeeAttendanceRecordByEmployeeId();
  }

  closeSalaryForm() {
    this.closed.emit(false);
  }
  getEmployeeAttendanceRecordByEmployeeId() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "employeeId": this.employeeData.employeeId,
      "pageIndex": 1,
      "pageSize": -1,
    };
    this.spinnerService.show();
    this.attendenceSystemService.getEmployeeAttendanceRecordByEmployeeId(model).subscribe(data => {
      if (data.status) {
        this.employeelist = data.employeelist;
        console.log("employeelist",this.employeelist)
        this.config_pgEmployeeList.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }
}
