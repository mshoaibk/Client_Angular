import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class SetupEmploymentTypeService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  CreateEmploymentTypeSetup(model: any): Observable<any> {
    let url = this.Constants.urlCreateEmploymentTypeSetup;
    return this.Common.post(url, model);
  }

  GetEmploymentTypeList(model: any): Observable<any> {
    let url = this.Constants.urlGetEmploymentTypeList;
    return this.Common.post(url, model);
  }

  DeleteEmploymentTypeSetup(model: any): Observable<any> {
    let url = this.Constants.urlDeleteEmploymentTypeSetup;
    return this.Common.post(url, model);
  }
}
