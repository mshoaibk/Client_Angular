import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { ConstantsService } from '../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class CarrerService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }
  getCountries(): Observable<any> {
    let url = this.Constants.urlGetCounties;
    return this.Common.get(url);
  }

  GetCarrerByComapny(encodedModel: any): Observable<any> {
    let url = this.Constants.urlGetCarrerByComapny + "/" + encodedModel;
    return this.Common.get(url);
  }
}
