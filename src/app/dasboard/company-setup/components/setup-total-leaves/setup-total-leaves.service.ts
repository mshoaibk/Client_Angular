import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class SetupTotalLeavesService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  departmentSetup(model: any): Observable<any> {
    let url = this.Constants.urlCreateDepartment;
    return this.Common.post(url, model);
  }

  GetDepartmentList(model: any): Observable<any> {
    let url = this.Constants.urlGetDepartmentList;
    return this.Common.post(url, model);
  }

  DeleteDepartmentSetup(model: any): Observable<any> {
    let url = this.Constants.urlDeleteDepartmentSetup;
    return this.Common.post(url, model);
  }
}
