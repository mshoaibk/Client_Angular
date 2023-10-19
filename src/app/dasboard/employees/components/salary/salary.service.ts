import { Injectable } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  GetEmployeeSalaryById(employeeId: any) {
    let url = this.Constants.urlGetEmployeeSalaryById + '/' + employeeId;
    return this.Common.get(url);
  }

  getEmployeeSalaryByEmployeeIdSlip(model: any) {
    let url = this.Constants.urlGetEmployeeSalaryByEmployeeIdSlip;
    return this.Common.post(url, model);
  }

  changeSalarySlipDownloadStatus(model: any) {
    let url = this.Constants.urlChangeSalarySlipDownloadStatus;
    return this.Common.post(url, model);
  }
}
