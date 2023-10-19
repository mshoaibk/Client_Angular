import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ConstantsService } from '../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyAnnouncementService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  GetCompanyAnnouncementList(model: any): Observable<any> {
    let url = this.Constants.urlGetCompanyAnnouncementList;
    return this.Common.post(url, model);
  }

  DeleteCompanyAnnouncement(id: any): Observable<any> {
    let url = this.Constants.urlDeleteCompanyAnnouncement + "/" + id;
    return this.Common.get(url);
  }
}
