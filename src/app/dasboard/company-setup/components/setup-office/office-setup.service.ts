import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeSetupService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }
  officeSetup(candidateJobApplication: any): Observable<any> {
    let url = this.Constants.urlCreateOffice;
    return this.Common.post(url, candidateJobApplication);
  }

  GetOfficeLocationList(officeLocationRequest: any): Observable<any> {
    let url = this.Constants.urlGetOfficeLocationList;
    return this.Common.post(url, officeLocationRequest);
  }

  DeleteOfficeSetup(model: any): Observable<any> {
    let url = this.Constants.urlDeleteOfficeSetup;
    return this.Common.post(url, model);
  }

  saveLocation(model: any): Observable<any> {
    let url = this.Constants.urlSaveLocation;
    return this.Common.post(url, model);
  }

  GetLocation(model: any): Observable<any> {
    let url = this.Constants.urlGetLocation;
    return this.Common.post(url, model);
  }
}
