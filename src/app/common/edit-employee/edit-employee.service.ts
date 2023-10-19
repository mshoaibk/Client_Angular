import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class EditEmployeeService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  SaveEmployee(employeeObj: any): Observable<any> {
    let url = this.Constants.urlSaveEmployee;
    employeeObj.companyID = this.userContextService.user$._value.companyID;
    employeeObj.action = 'update';
    return this.Common.post(url, employeeObj);
  }

  ShowCompleteEmployeeDetail(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlShowCompleteEmployeeDetail;
    return this.Common.post(url, searchEmployeesRqst);
  }
}

