import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { UserContextService } from '../../services/user-context.service';
import { AdminIndexService } from '../admin-index/admin-index.service';
import { EditCompanyProfileComponent } from '../../common/edit-company-profile/edit-company-profile.component';
import { ChangePasswordComponent } from '../../common/change-password/change-password.component';
import { CommonService } from '../../services/common.service';
import { Methods } from '../../services/constants.service';

@Component({
  selector: 'app-company-profiles',
  templateUrl: './company-profiles.component.html',
  styleUrls: ['./company-profiles.component.scss']
})
export class CompanyProfilesComponent {
  companyID: any = 0;
  userID: any = 0;
  companyProfile: any = {};
  currentUrl: any = '';
  @ViewChild('profileEditContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('passwordUpdateContainer', { read: ViewContainerRef }) dialogContainerPassword?: ViewContainerRef;

  constructor(private userContextService: UserContextService, private spinnerService: NgxSpinnerService,
    private adminIndexService: AdminIndexService, private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector, private commonService: CommonService) {
    //this.route.params.subscribe(params => {
    //  this.userID = params['user_id'];
    //});
    this.userID = this.userContextService.user$._value.id;
    this.companyID = this.userContextService.user$._value.companyID;
    let encodedModel = Methods.EncryptTo64(this.companyID);
    this.currentUrl = '/carrer/' + encodedModel;
    this.GetCompanyProfile();
  }

  GetCompanyProfile() {
    this.spinnerService.show();
    this.adminIndexService.getCompanyProfile(this.userID).subscribe(data => {
      if (data.status) {
        this.companyProfile = data.companyList;
        this.userContextService.user$._value.companyName = this.companyProfile.companyName;
        this.userContextService.user$._value.companyLogo = this.companyProfile.companyLogo;
      }
      this.spinnerService.hide();
    });
  }

  createImgPath(imgPath: string) {
    if (imgPath)
      return environment.ApiUrl + '/' + imgPath;
    return 'assets/images/projz/avatar.png';
  }

  openEditProfilePopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(EditCompanyProfileComponent);
    const data: any =
    {
      companyName: this.companyProfile.companyName,
      industry: this.companyProfile.companyIndustry,
      noOfEmployees: this.companyProfile.companyNumberOfEmployees.toString(),
      emailAddress: this.companyProfile.companyEmail,
      password: '',
      phoneNumber: this.companyProfile.companyPhone,
      website: this.companyProfile.website,
      linkedIn: this.companyProfile.linkedIn,
      description: this.companyProfile.description,
      companyLogo: this.companyProfile.companyLogo,
      companyID: this.companyProfile.companyID,
      userID: this.companyProfile.userID
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((profile: any) => {
      popupRef.destroy();
      this.GetCompanyProfile();
    });
  }

  openPasswordUpdatePopup() {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChangePasswordComponent);
    const data: any =
    {
      companyID: this.companyProfile.companyID,
      userID: this.companyProfile.userID
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainerPassword?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((profile: any) => {
      popupRef.destroy();
      if (profile)
        this.GetCompanyProfile();
    });
  }
}
