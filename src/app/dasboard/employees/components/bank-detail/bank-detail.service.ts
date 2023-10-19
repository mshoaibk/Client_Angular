import { Injectable } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankDetailService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  GetEmployeeBankDetail(employeeId: any) {
    let url = this.Constants.urlGetEmployeeBankDetail + '/' + employeeId;
    return this.Common.get(url);
  }
  DeleteBankDetail(employeeId: any): Observable<any> {
    let url = this.Constants.urlDeleteDepartmentSetup;
    return this.Common.post(url, employeeId);
  }
}
