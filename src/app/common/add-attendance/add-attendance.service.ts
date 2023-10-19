import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AddAttendanceService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  AddAttendance(attendanceModel: any): Observable<any> {
    let url = this.Constants.urlAddAttendance;
    return this.Common.post(url, attendanceModel);
  }

  AddLeaveRequest(employeeLeaveModel: any): Observable<any> {
    let url = this.Constants.urlAddLeaveRequest;
    return this.Common.post(url, employeeLeaveModel);
  }

  CheckAlreadyAddedAttendance(attendanceModel: any): Observable<any> {
    let url = this.Constants.urlCheckAlreadyAddedAttendance;
    return this.Common.post(url, attendanceModel);
  }
}
