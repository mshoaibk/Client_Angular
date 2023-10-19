import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceDetailService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  GetAttendanceCalendarView(attendanceModel: any): Observable<any> {
    let url = this.Constants.urlGetAttendanceCalendarView;
    return this.Common.post(url, attendanceModel);
  }

  GetEmployeeLeaveCalendarView(model: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeLeaveCalendarView;
    return this.Common.post(url, model);
  }

  DeleteAttendanceLeaveRecord(model: any): Observable<any> {
    let url = this.Constants.urlDeleteAttendanceLeaveRecord;
    return this.Common.post(url, model);
  }
}
