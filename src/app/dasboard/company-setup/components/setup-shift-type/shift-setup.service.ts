import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftSetupService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }
  
  shiftSetup(model: any): Observable<any> {
    let url = this.Constants.urlCreateShift;
    return this.Common.post(url, model);
  }
  GetShiftList(model: any): Observable<any> {
    let url = this.Constants.urlGetShiftList;
    return this.Common.post(url, model);
  }
  DeleteShift(shiftId: any): Observable<any> {
    let url = this.Constants.urlDeleteShiftList + "/" + shiftId;
    return this.Common.get(url);
  }
}
