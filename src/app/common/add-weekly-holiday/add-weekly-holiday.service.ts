import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService } from '../../services/constants.service';
import { UserContextService } from '../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class AddWeeklyHolidayService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService) { }

  SaveWeekly(model: any): Observable<any> {
    let url = this.Constants.urlSaveWeekly;
    return this.Common.post(url, model);
  }
}
