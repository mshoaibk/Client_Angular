import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class AddSalaryService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  SaveEmployeeSalary(employeeSalary: any): Observable<any> {
    let url = this.Constants.urlSaveEmployeeSalary;
    return this.Common.post(url, employeeSalary);
  }
  GenarateEmployeeSalary(Data: any): Observable<any> {
    let url = this.Constants.urlGenarateEmployeeSalary;
    return this.Common.post(url, Data);
  }
  fillEmployeeDDLByCompany(companyId: any, requiredAll:any=''): Observable<any> {
    let url = this.Constants.urlFillEmployeeDDLByCompany + '/' + companyId + '/' + requiredAll;
    return this.Common.get(url);
  }

  CheckGetEmployeeSalaryById(employeeID: any): Observable<any> {
    let url = this.Constants.urlCheckGetEmployeeSalaryById + '/' + employeeID;
    return this.Common.get(url);
  }
  GetEmployeeSalariesList(model:any): Observable<any>{
    let url = this.Constants.urlCheckGetEmployeeSalariesList;
    return this.Common.post(url ,model);

  }
  GetSetupLookUpData(model: any): Observable<any> {
    let url = this.Constants.urlGetSetupLookUpData;
    return this.Common.post(url, model);
  }
}
