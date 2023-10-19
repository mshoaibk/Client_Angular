import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { RouteStateService } from '../../../../services/route-state.service';
import { UserContextService } from '../../../../services/user-context.service';
import { AttendenceSystemService } from '../../attendence-system.service';
import { EmployeeLeaveHistoryComponent } from '../../../../common/employee-leave-history/employee-leave-history.component';
import { EmployeeLeaveService } from '../employee-leave/employee-leave.service';
import { Methods } from '../../../../services/constants.service';

@Component({
  selector: 'app-employee-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.scss']
})
export class EmployeeLeaveComponent {
  searchEmployeesRqst: any = {};
  employeelist: any = [];
  SelectedPageSize: number = 10;
  userInfo: any = {};
  config_pgEmployeeList = {
    id: "pg_EmployeeList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  showView: string = 'a';
  @ViewChild('leaveHistoryContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;

  constructor(private attendenceSystemService: AttendenceSystemService, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService, private userContextService: UserContextService,
    private common: CommonService, private routeStateService: RouteStateService, private injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver, private employeeLeaveService: EmployeeLeaveService) {
    this.searchEmployeesRqst.location = '';
    this.searchEmployeesRqst.employmentType = '';
    this.searchEmployeesRqst.department = '';
    this.searchEmployeesRqst.position = '';
    this.searchEmployeesRqst.employeeName = '';
    this.searchEmployeesRqst.filterStatus = 'all';
  }

  ngOnInit(): void {
    this.getEmployeeLeaveRequest();
  }

  getEmployeeLeaveRequest() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "fullName": this.searchEmployeesRqst.employeeName,
      "pageIndex": 1,
      "pageSize": -1,
      "filterStatus": this.searchEmployeesRqst.filterStatus
    };
    this.spinnerService.show();
    this.attendenceSystemService.getEmployeeLeaveRequest(model).subscribe(data => {
      if (data.status) {
        this.employeelist = data.employeelist;
        this.config_pgEmployeeList.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }

  navigationToEmployeeAttendence(emp: any) {
    let model = {
      employeeId: emp.employeeId,
      employeeName: emp.employeeName
    }
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    this.routeStateService.add("attendence", '/dashboard/attendance-system/' + encodedModel, encodedModel, true);
  }

  leaveHistory(emp: any = {}) {
    const factory = this._componentFactoryResolver.resolveComponentFactory(EmployeeLeaveHistoryComponent);
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: emp }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      //if (status)
      //  this.getEmployeeSalaryById();
    });
  }

  updateEmployeeLeaveStatus(status = '', emp: any = {}) {
    let model = {
      "status": status,
      "employeeLeaveRequestId": emp.employeeLeaveRequestId
    };
    this.spinnerService.show();
    this.employeeLeaveService.updateEmployeeLeaveStatus(model).subscribe(data => {
      if (data.status) {
        this.getEmployeeLeaveRequest();
      }
      this.spinnerService.hide();
    });
  }

  filterChange(param: any = 'all') {
    this.searchEmployeesRqst.filterStatus = param;
    this.getEmployeeLeaveRequest();
  }
}
