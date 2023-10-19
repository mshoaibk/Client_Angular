import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class ApplyJobService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  applyJob(candidateJobApplication: any): Observable<any> {    
    let url = this.Constants.urlApplyJob;
    return this.Common.post(url, candidateJobApplication);
  }
}
