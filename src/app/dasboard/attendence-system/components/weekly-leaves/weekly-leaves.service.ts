import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class WeeklyLeavesService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  GetWeeklyHolidaysByCompId(companyID: any): Observable<any> {
    let url = this.Constants.urlGetWeeklyHolidaysByCompId + '/' + companyID;
    return this.Common.get(url);
  }

  DeleteWeeklyHoliday(compId: any): Observable<any> {
    let url = this.Constants.urlDeleteWeeklyHoliday + '/' + compId;
    return this.Common.delete(url);
  }
}
