import { Component, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../services/user-context.service';
import { AttendenceSystemService } from '../../dasboard/attendence-system/attendence-system.service';
import { CommonService } from '../../services/common.service';
import { RouteStateService } from '../../services/route-state.service';
import { EmployeeLeaveComponent } from '../attendence-system/components/employee-leave/employee-leave.component';
import { Methods } from '../../services/constants.service';

@Component({
  selector: 'app-attendence-system',
  templateUrl: './attendence-system.component.html',
  styleUrls: ['./attendence-system.component.scss'],
})
export class AttendenceSystemComponent {
  searchEmployeesRqst: any = {};
  SelectedPageSize: number = 10;
  userInfo: any = {};
  showView: string = 'a';
  @ViewChild(EmployeeLeaveComponent) empLeave: any;

  constructor(
    private attendenceSystemService: AttendenceSystemService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    private common: CommonService,
    private routeStateService: RouteStateService
  ) {
    this.searchEmployeesRqst.location = '';
    this.searchEmployeesRqst.employmentType = '';
    this.searchEmployeesRqst.department = '';
    this.searchEmployeesRqst.position = '';
    this.searchEmployeesRqst.employeeName = '';
  }
  ngOnInit(): void {}

  navigationToEmployeeAttendence(emp: any) {
    let model = {
      employeeId: emp.employeeId,
      employeeName: emp.employeeName,
    };
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    this.routeStateService.add(
      'attendence',
      '/dashboard/attendance-system/' + encodedModel,
      encodedModel,
      true
    );
  }

  switchViewTab(param: any = 'a') {
    this.showView = param;
  }

  getEmployeeLeaveRequest() {
    this.empLeave.getEmployeeLeaveRequest(this.searchEmployeesRqst);
  }
}
