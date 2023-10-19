import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class EditCompanyProfileService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  UpdateCompanyRegisteration(model: any): Observable<any> {
    let url = this.Constants.urlUpdateCompanyRegisteration;
    return this.Common.post(url, model);
  }

  RegisterCompanyDetail(companyRegisterRqst: any): Observable<any> {
    let model = {
      "companyID": companyRegisterRqst.companyID,
      "companyName": companyRegisterRqst.companyName,
      "companyLogo": companyRegisterRqst.companyLogo,
      "owner": '',
      "industry": companyRegisterRqst.industry,
      "streetAddress": '',
      "city": '',
      "state": '',
      "country": '',
      "zipCode": '',
      "emailAddress": companyRegisterRqst.emailAddress,
      "phoneNumber": companyRegisterRqst.phoneNumber,
      "description": companyRegisterRqst.description,
      "isDeleted": false,
      "createdBy": '',
      "noOfEmployees": companyRegisterRqst.noOfEmployees,
      "website": companyRegisterRqst.website,
      "linkedIn": companyRegisterRqst.linkedIn,
      "Status": 'p',
      "action": 'update'
    };
    let url = this.Constants.urlRegisterCompanyDetail;
    return this.Common.post(url, model);
  }
}
