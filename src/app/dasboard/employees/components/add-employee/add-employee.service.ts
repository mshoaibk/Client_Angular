import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService, Methods } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class AddEmployeeService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  SaveEmployee(employeeObj: any): Observable<any> {
    let url = this.Constants.urlSaveEmployee;
    employeeObj.companyID = this.userContextService.user$._value.companyID;
    return this.Common.post(url, employeeObj);
  }

  registerUsers(employeeObj: any): Observable<any> {
    let model = {
      "Email": employeeObj.email,
      "Password": employeeObj.password,
      "Username": employeeObj.email
    };
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    let url = this.Constants.urlRegisterEmployee + "/" + encodedModel;
    return this.Common.get(url);
  }

  CheckEmployeeRegisterValidation(model: any): Observable<any> {
    let url = this.Constants.urlCheckEmployeeRegisterValidation;
    return this.Common.post(url, model);
  }

  GetSetupLookUpData(model: any): Observable<any> {
    let url = this.Constants.urlGetSetupLookUpData;
    return this.Common.post(url, model);
  }

  GetDepartmentByOfficeLocation(companyId: any, selectedValue: any): Observable<any> {
    let url = this.Constants.urlGetDepartmentByOfficeLocation +"/"+ companyId + "/" + selectedValue;
    return this.Common.get(url);
  }

  GetTeamByDepartment(companyId: any, selectedValue: any): Observable<any> {
    let url = this.Constants.urlGetTeamByDepartment + "/" + companyId + "/" + selectedValue;
    return this.Common.get(url);
  }

  GetPositionByTeam(companyId: any, selectedValue: any): Observable<any> {
    let url = this.Constants.urlGetPositionByTeam + "/" + companyId + "/" + selectedValue;
    return this.Common.get(url);
  }

  GetPositionHierarchyEmployees(companyId: any, positionId: any) {
    let url = this.Constants.urlGetPositionHierarchyEmployees + "/" + companyId + "/" + positionId;
    return this.Common.get(url);
  }
}
