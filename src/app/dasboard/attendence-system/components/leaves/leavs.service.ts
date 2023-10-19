import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';
@Injectable({
  providedIn: 'root'
})
export class LeavsService {

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
