import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { ConstantsService } from '../../../../services/constants.service';
import { UserContextService } from '../../../../services/user-context.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDetailsService {

  constructor(private Common: CommonService, private Constants: ConstantsService,
    private userContextService: UserContextService, private http: HttpClient) { }

  ShowCandidatesApplication(showCandidatesApplicationModel: any): Observable<any> {
    let url = this.Constants.urlShowCandidatesApplication;
    return this.Common.post(url, showCandidatesApplicationModel);
  }

  UpdateCandidatesApplication(updateCandidatesApplicationModel: any): Observable<any> {
    let url = this.Constants.urlUpdateCandidatesApplication;
    return this.Common.post(url, updateCandidatesApplicationModel);
  }

  downloadFile(filename: string) {    
    const url = this.Constants.urlDownload + `?filename=${filename}`; // Replace with your API URL
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Accept': 'application/octet-stream'
    });
    this.http.get(url, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
      const downloadLink = document.createElement('a');
      const fileURL = URL.createObjectURL(data);
      downloadLink.href = fileURL;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }
}
