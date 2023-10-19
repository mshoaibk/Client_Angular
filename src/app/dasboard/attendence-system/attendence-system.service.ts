import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AttendenceSystemService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  getEmployeeLeaveRequest(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeLeaveRequest;
    return this.Common.post(url, searchEmployeesRqst);
  }

  getEmployeeAttendanceRecord(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeAttendanceRecord;
    return this.Common.post(url, searchEmployeesRqst);
  }

  getEmployeeAttendanceRecordByEmployeeId(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeAttendanceRecordByEmployeeId;
    return this.Common.post(url, searchEmployeesRqst);
  }

  getEmployeeLeaveRecordByEmployeeId(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeLeaveRecordByEmployeeId;
    return this.Common.post(url, searchEmployeesRqst);
  }
}
