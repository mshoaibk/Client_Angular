import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAttendanceService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  updateEmployeeAttendanceStatus(updateEmployeeAttendanceStatusRqst: any): Observable<any> {
    let url = this.Constants.urlupdateEmployeeLeaveStatus;
    return this.Common.post(url, updateEmployeeAttendanceStatusRqst);
  }
}
