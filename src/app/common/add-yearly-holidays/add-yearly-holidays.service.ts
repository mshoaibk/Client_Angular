import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AddYearlyHolidaysService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { } 
  SaveYearlyHolidays(model: any): Observable<any> {
    let url = this.Constants.urlSaveYearlyHolidays;
    return this.Common.post(url, model);
  }
  GetYearlyHolidays(model: any): Observable<any> {
    let url = this.Constants.urlGetYearlyHolidays;
    return this.Common.post(url, model);
  }
  DeleteYearlyHolidays(compId: any): Observable<any> {
    let url = this.Constants.urlDeleteYearlyHolidays + '/'+ compId;
    return this.Common.delete(url);
  }
}
