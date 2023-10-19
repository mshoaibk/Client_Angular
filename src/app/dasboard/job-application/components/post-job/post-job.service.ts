import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class PostJobService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService  ) { }

  getCountries(): Observable<any> {
    let url = this.Constants.urlGetCounties;
    return this.Common.get(url);
  }

  SavePostJob(jobComposeRqstModel: any): Observable<any> {
    let model = {
      "PostJobId": jobComposeRqstModel.postJobId,
      "jobAddedBy": 'Company',
      "companyId": this.userContextService.user$._value.companyID,
      "companyName": this.userContextService.user$._value.companyName,
      "jobTitle": jobComposeRqstModel.jobTitle,
      "country": jobComposeRqstModel.country,
      "jobTypeLoc": jobComposeRqstModel.jobTypeLoc,
      "jobLocation": jobComposeRqstModel.jobTypeLoc,
      "noOfHiring": jobComposeRqstModel.noOfHiring,
      "qualification": jobComposeRqstModel.qualification,
      "noOfExperience": jobComposeRqstModel.noOfExperience,
      "experienceLevel": jobComposeRqstModel.experienceLevel,
      "jobType": jobComposeRqstModel.jobType,
      "jobBenefit": jobComposeRqstModel.jobBenefit,
      "keyResponsibilities": jobComposeRqstModel.keyResponsibilities,
      "requiredSkill": [],
      "jobSalaryRangeFrom": jobComposeRqstModel.salaryRangeFrom.toString(),
      "jobSalaryRangeTo": jobComposeRqstModel.salaryRangeTo.toString(),
      "jobDescription": jobComposeRqstModel.description,
      "isDeleted": false,
      "createdBy": this.userContextService.user$._value.id,
      "action": jobComposeRqstModel.action
    };
    let url = this.Constants.urlSavePostJob;
    return this.Common.post(url, model);
  }
}
