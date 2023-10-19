import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }
  getEmployeeBasicDetailForChat(searchEmployeesRqst: any): Observable<any> {
    let url = this.Constants.urlGetEmployeeBasicDetailForCompany;
    return this.Common.post(url, searchEmployeesRqst);
  }
}
