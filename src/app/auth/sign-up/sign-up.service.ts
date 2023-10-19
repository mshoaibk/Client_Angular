import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantsService, Methods } from '../../services/constants.service';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  constructor(private Common: CommonService, private Constants: ConstantsService) { }

//  RegisterCompanyDetail(companyRegisterRqst: any, fileUpload:File): Observable<any> {
//    const model:any = {
//      "companyID": companyRegisterRqst.companyID,
//      "companyName": companyRegisterRqst.companyName,
//      "companyLogo": companyRegisterRqst.companyLogo,
//      "owner": '',
//      "industry": companyRegisterRqst.industry,
//      "streetAddress": '',
//      "city": '',
//      "state": '',
//      "country": '',
//      "zipCode": '',
//      "emailAddress": companyRegisterRqst.emailAddress,
//      "phoneNumber": companyRegisterRqst.phoneNumber,
//      "description": companyRegisterRqst.description,
//      "isDeleted": false,
//      "createdBy": '',
//      "noOfEmployees": companyRegisterRqst.noOfEmployees,
//      "companyAddress": companyRegisterRqst.companyAddress,
//      "website": companyRegisterRqst.website,
//      "linkedIn": companyRegisterRqst.linkedIn,
//      "registerDate": companyRegisterRqst.registerDate,
//      "Status": 'p',
//      "action": 'save'
//    };
//    const formData: FormData = new FormData();
//    formData.append("companyID", companyRegisterRqst.companyID);
//formData.append("companyName", companyRegisterRqst.companyName);
//formData.append("companyLogo", companyRegisterRqst.companyLogo);
//formData.append("owner", '');
//formData.append("industry", companyRegisterRqst.industry);
//formData.append("streetAddress", '');
//formData.append("city", '');
//formData.append("state", '');
//formData.append("country", '');
//formData.append("zipCode", '');
//formData.append("emailAddress", companyRegisterRqst.emailAddress);
//formData.append("phoneNumber", companyRegisterRqst.phoneNumber);
//formData.append("description", companyRegisterRqst.description);
//formData.append("isDeleted", false.toString());
//formData.append("createdBy", '');
//formData.append("noOfEmployees", companyRegisterRqst.noOfEmployees);
//formData.append("companyAddress", companyRegisterRqst.companyAddress);
//formData.append("website", companyRegisterRqst.website);
//formData.append("linkedIn", companyRegisterRqst.linkedIn);
//formData.append("registerDate", companyRegisterRqst.registerDate);
//formData.append("Status", 'p');
//formData.append("action", 'save');

//// Append the file input
//formData.append("File", this.FileUpload);
//    let url = this.Constants.urlRegisterCompanyDetail;
//    return this.Common.post_encoded(url, formData);
//  }

  registerUsers(companyRegisterRqst: any): Observable<any> {
    let model = {
      "Email": companyRegisterRqst.emailAddress,
      "Password": companyRegisterRqst.password,
      "CompanyName": companyRegisterRqst.companyName,
      "PhoneNumber": companyRegisterRqst.phoneNumber && companyRegisterRqst.phoneNumber.internationalNumber
        ? companyRegisterRqst.phoneNumber.internationalNumber : ''
    };
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    let url = this.Constants.urlRegisterCompany + "/" + encodedModel;
    return this.Common.get(url);
  }
}
