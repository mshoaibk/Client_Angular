import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class AddRolesService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  GetSetupLookUpData(model: any): Observable<any> {
    let url = this.Constants.urlGetSetupLookUpData;
    return this.Common.post(url, model);
  }

  GetDepartmentByOfficeLocation(companyId: any, selectedValue: any): Observable<any> {
    let url = this.Constants.urlGetDepartmentByOfficeLocation + "/" + companyId + "/" + selectedValue;
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

  SaveRole(model: any): Observable<any> {
    let url = this.Constants.urlSaveRole;
    return this.Common.post(url, model);
  }

  GetRolesById(roleId: any, office: any, department: any, team: any, position: any, companyID:any): Observable<any> {
    let url = this.Constants.urlGetRolesById + "/" + roleId + "/" + office + "/" + department + "/" + team + "/" + position + "/" + companyID;
    return this.Common.get(url);
  }
}
