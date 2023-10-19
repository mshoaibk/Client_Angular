import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { UserContextService } from '../../../../services/user-context.service';
import { EmployeeDetailService } from '../employee-detail/employee-detail.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent {
  tabNumber: number = 1;
  employeeId: any = '';
  employeeDetail: any = {};

  constructor(private route: ActivatedRoute, private currentRoute: Router, private employeeDetailService: EmployeeDetailService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.ShowCompleteEmployeeDetail();
    });
  }

  ShowCompleteEmployeeDetail() {
    let model = {
      "employeeID": this.employeeId
    };
    this.spinnerService.show();
    this.employeeDetailService.ShowCompleteEmployeeDetail(model).subscribe(data => {
      if (data.status) {
        this.employeeDetail = data.employeeDetail;
      }
      this.spinnerService.hide();
    });
  }

  createImgPath(employeePhoto: any, photoType: any) {
    if (photoType == 'uploadedurl')
      return environment.ApiUrl + '/' + employeePhoto;
    else
      return employeePhoto;
  }

  gobackToEmployees() {
    this.currentRoute.navigate(['/dashboard/employees'])
  }
}
