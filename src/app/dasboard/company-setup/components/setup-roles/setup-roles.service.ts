import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SetupRolesService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  GetRoles(model: any): Observable<any> {
    let url = this.Constants.urlGetRoles;
    return this.Common.post(url, model);
  }

  deleteEmployeeSetupRoles(roleId: any) {
    let url = this.Constants.urldeleteEmployeeSetupRoles + '/' + roleId;
    return this.Common.get(url);
  }
}
