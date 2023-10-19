import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  GetEmployeeSalaries(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeSalaries;
    return this.Common.post(url, searchEmployeesRqst);
  }
  DeleteEmployeeSalaries(employeeSalarySlipID: any): Observable<any> {
    const url = this.Constants.urlDeleteEmployeeSalaries + "/" + employeeSalarySlipID;
    return this.Common.get(url);
  }
  showEmployeeSalarySlipList(searchEmployeesRqst: any): Observable<any>{
    let url = this.Constants.urlShowEmployeeSalarySlipList;
    return this.Common.post(url, searchEmployeesRqst);
  }
  SalaryPay(employeeSalarySlipID: any): Observable<any>{
    const url = this.Constants.urlSalaryPay + "/" + employeeSalarySlipID;
    return this.Common.post(url ,employeeSalarySlipID);
  }
  UpdateSalaryAllowances( model:any){
    const url = this.Constants.urlUpdateSalaryAllowances;
    return this.Common.post(url ,model);
  }
}
