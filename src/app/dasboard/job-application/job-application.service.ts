import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  showAppliedApplication(jobComposeRqstModel: any): Observable<any> {
    let url = this.Constants.urlShowAppliedApplication;
    return this.Common.post(url, jobComposeRqstModel);
  }

  DeletePostedJob(postJobId: any): Observable<any> {
    let url = this.Constants.urlDeletePostedJob + '/' + postJobId;
    return this.Common.get(url);
  }
}
