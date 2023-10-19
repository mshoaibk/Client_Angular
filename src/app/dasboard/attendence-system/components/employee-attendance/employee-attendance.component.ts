import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { AttendenceSystemService } from '../../attendence-system.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { RouteStateService } from '../../../../services/route-state.service';
import { UserContextService } from '../../../../services/user-context.service';
import { EmployeeAttendanceHistoryComponent } from '../../../../common/employee-attendance-history/employee-attendance-history.component';
import { Methods } from '../../../../services/constants.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent {
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
  @ViewChild('attendanceHistoryContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;

  constructor(private attendenceSystemService: AttendenceSystemService, private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService, private userContextService: UserContextService,
    private common: CommonService, private routeStateService: RouteStateService, private injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver) {
    this.searchEmployeesRqst.location = '';
    this.searchEmployeesRqst.employmentType = '';
    this.searchEmployeesRqst.department = '';
    this.searchEmployeesRqst.position = '';
    this.searchEmployeesRqst.employeeName = '';
    this.searchEmployeesRqst.filterStatus = 'all';
  }

  ngOnInit(): void {
    this.getEmployeeAttendanceRecord();
  }

  getEmployeeAttendanceRecord() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "location": this.searchEmployeesRqst.location,
      "employmentType": this.searchEmployeesRqst.employmentType,
      "department": this.searchEmployeesRqst.department,
      "position": this.searchEmployeesRqst.position,
      "fullName": this.searchEmployeesRqst.employeeName,
      "filterStatus": this.searchEmployeesRqst.filterStatus,
      "pageIndex": 1,
      "pageSize": -1,
    };
    this.spinnerService.show();
    this.attendenceSystemService.getEmployeeAttendanceRecord(model).subscribe(data => {
      if (data.status) {
        this.employeelist = data.employeelist;
        this.config_pgEmployeeList.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }

  openAttendanceHistoryPopup(emp:any) {
    const factory = this._componentFactoryResolver.resolveComponentFactory(EmployeeAttendanceHistoryComponent);
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

  navigationToEmployeeAttendence(emp: any) {
    let model = {
      employeeId: emp.employeeId,
      employeeName: emp.employeeName
    }
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    this.routeStateService.add("attendence", '/dashboard/attendance-system/' + encodedModel, encodedModel, true);
  }

  filterChange(param:any='all') {
    this.searchEmployeesRqst.filterStatus = param;
    this.getEmployeeAttendanceRecord();
  }
}
