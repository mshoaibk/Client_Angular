import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class PositionHierarchyManagementService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  GetPositionHierarchy(companyID: any): Observable<any> {
    let url = this.Constants.urlGetPositionHierarchy + '/' + companyID;
    return this.Common.get(url);
  }

  UpdatePositionHierarchy(lst: any): Observable<any> {
    let url = this.Constants.urlUpdatePositionHierarchy;
    return this.Common.post(url, lst);
  }
}
