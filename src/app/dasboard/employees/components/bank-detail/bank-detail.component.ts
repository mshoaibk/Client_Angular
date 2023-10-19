import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../../services/user-context.service';
import { BankDetailService } from './bank-detail.service';
import { SaveBankDetailComponent } from '../../../../common/save-bank-detail/save-bank-detail.component';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent {
  @ViewChild('bankDetailContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  employeeId: any = '';
  employeeBankDetail: any = {};

  constructor(private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService, private bankDetailService: BankDetailService,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
    });
  }

  ngOnInit() {
    this.getEmployeeBankDetail()
  }

  addBankDetailPopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(SaveBankDetailComponent);
    const data: any =
    {
      employeeBankDetail: this.employeeBankDetail
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status)
        this.getEmployeeBankDetail();
    });
  }
  deleteBankDetail(){
    this.spinnerService.show();
    this.bankDetailService.DeleteBankDetail(this.employeeId).subscribe((res)=>{
      if(res){
        confirm("are you sure...!")
      }
    })
  }

  getEmployeeBankDetail() {
    this.spinnerService.show();
    this.bankDetailService.GetEmployeeBankDetail(this.employeeId).subscribe(data => {
      if (data.status && data.employeeBankDetail) {
        this.employeeBankDetail = data.employeeBankDetail;
        this.employeeBankDetail.action = 'update';
        this.employeeBankDetail.modifiedBy = this.userContextService.user$._value.id;
      }
      else {
        this.employeeBankDetail.action = 'save';
        this.employeeBankDetail.bankName = '';
        this.employeeBankDetail.bankBranch = '';
        this.employeeBankDetail.accountHolder = '';
        this.employeeBankDetail.accountNumber = '';
        this.employeeBankDetail.ifscCode = '';
        this.employeeBankDetail.EmployeeID = this.employeeId;
        this.employeeBankDetail.employeeBankDetailId = 0;
        this.employeeBankDetail.createdBy = this.userContextService.user$._value.id;
        this.employeeBankDetail.modifiedBy = '';
      }
      this.spinnerService.hide();
    });
  }
}
