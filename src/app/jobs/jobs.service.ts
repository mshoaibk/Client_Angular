import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { ConstantsService } from '../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }
  getCountries(): Observable<any> {
    let url = this.Constants.urlGetCounties;
    return this.Common.get(url);
  }

  GetPostedJob(jobComposeRqstModel: any): Observable<any> {
    let url = this.Constants.urlGetPostedJob;
    return this.Common.post(url, jobComposeRqstModel);
  }
}
