import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class TeamSetupService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  CreateTeam(model: any): Observable<any> {
    let url = this.Constants.urlCreateTeam;
    return this.Common.post(url, model);
  }

  GetTeamList(model: any): Observable<any> {
    let url = this.Constants.urlGetTeamList;
    return this.Common.post(url, model);
  }

  DeleteTeamSetup(model: any): Observable<any> {
    let url = this.Constants.urlDeleteTeamSetup;
    return this.Common.post(url, model);
  }
}
