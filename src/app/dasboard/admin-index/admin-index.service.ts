import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AdminIndexService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  getCompanyProfile(companyID: any): Observable<any> {
    let url = this.Constants.urlGetCompanyProfile + '/' + companyID;
    return this.Common.get(url);
  }

  GetCompanyDashboardCount(companyID: any, requiredCount:any=''): Observable<any> {
    let url = this.Constants.urlGetCompanyDashboardCount + '/' + companyID + '/' + requiredCount;
    return this.Common.get(url);
  }
}
