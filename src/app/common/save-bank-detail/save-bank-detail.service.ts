import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SaveBankDetailService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  SaveEmployeeBankDetail(employeeBankDetail: any): Observable<any> {
    let url = this.Constants.urlSaveEmployeeBankDetail;
    return this.Common.post(url, employeeBankDetail);
  }
}
