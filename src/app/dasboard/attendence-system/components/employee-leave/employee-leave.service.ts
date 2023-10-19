import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLeaveService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  updateEmployeeLeaveStatus(updateEmployeeLeaveStatusRqst: any): Observable<any> {
    let url = this.Constants.urlupdateEmployeeLeaveStatus;
    return this.Common.post(url, updateEmployeeLeaveStatusRqst);
  }
}
