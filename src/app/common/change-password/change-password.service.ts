import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ConstantsService, Methods } from '../../services/constants.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private Common: CommonService, private Constants: ConstantsService) { }

  UpdatePassword(model: any): Observable<any> {
    let modelString = JSON.stringify(model);
    let encodedModel = Methods.EncryptTo64(modelString);
    let url = this.Constants.urlUpdatePassword + "/" + encodedModel;
    return this.Common.get(url);
  }
}
