import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class PositionSetupService {
  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  CreatePosition(model: any): Observable<any> {
    let url = this.Constants.urlCreatePosition;
    return this.Common.post(url, model);
  }

  GetPositionList(model: any): Observable<any> {
    let url = this.Constants.urlGetPositionList;
    return this.Common.post(url, model);
  }

  DeletePositionSetup(model: any): Observable<any> {
    let url = this.Constants.urlDeletePositionSetup;
    return this.Common.post(url, model);
  }
}
