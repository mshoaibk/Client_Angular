import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from '../../../services/user-context.service';
import { CompanyAnnouncementService } from './company-announcement.service';
import { AddAnnouncementComponent } from '../../../common/add-announcement/add-announcement.component';
import { DeleteConfirmationComponent } from '../../../common/delete-confirmation/delete-confirmation.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-company-announcement',
  templateUrl: './company-announcement.component.html',
  styleUrls: ['./company-announcement.component.scss']
})
export class CompanyAnnouncementComponent {
  formattedTime: string='';
  searchCompanyAnnouncement: any = {};
  getCompanyAnnouncement: any = [];
  config_pgShowAnnouncement = {
    id: "pg_announcement",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  @ViewChild('addCompanyAnnouncementContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  @ViewChild('deleteCompanyAnnouncementContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;

  constructor(private companyAnnouncementService: CompanyAnnouncementService,
    private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService,
    private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
    this.setSearchCompanyAnnouncement();
    this.getCompanyAnnouncementList();
  }

  setSearchCompanyAnnouncement() {
    this.searchCompanyAnnouncement.evenTitle = '';
  }

  addAnnouncementPopoup(announce: any = {}){
    const factory = this.componentFactoryResolver.resolveComponentFactory(AddAnnouncementComponent);
    const data: any =
    {
      getCompanyAnnouncement: announce
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status) {
        this.getCompanyAnnouncementList();
      }
    });
  }

  getCompanyAnnouncementList() {
    let model = {
      "companyId": this.userContextService.user$._value.companyID,
      "evenTitle": this.searchCompanyAnnouncement.evenTitle,
      "pageIndex": this.config_pgShowAnnouncement.currentPage - 1,
      "pageSize": this.config_pgShowAnnouncement.itemsPerPage,
    };
    this.spinnerService.show();
    this.companyAnnouncementService.GetCompanyAnnouncementList(model).subscribe(data => {
      if (data.status) {
        this.getCompanyAnnouncement = data.getCompanyAnnouncement;
        this.config_pgShowAnnouncement.totalItems = data.totalRecords;
      }
      this.spinnerService.hide();
    });
  }

  deleteCompanyAnnouncementPopup(id:any) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(DeleteConfirmationComponent);
    const data: any =
    {
      Id: id
    };
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });
    const popupRef = factory.create(popupInjector);
    this.dialogDeleteContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((id: any) => {
      popupRef.destroy();
      if (id) {
        this.deleteCompanyAnnouncement(id)
      }
    });
  }

  deleteCompanyAnnouncement(id:any) {
    this.spinnerService.show();
    this.companyAnnouncementService.DeleteCompanyAnnouncement(id).subscribe(data => {
      if (data.status) {
        this.getCompanyAnnouncementList();
      }
      this.spinnerService.hide();
    });
  }

  createImgPath(employeePhoto: any) {
    if (!employeePhoto)
      return 'assets/images/projz/avatar.png';
    else
      return environment.ApiUrl + '/' + employeePhoto;
  }
}
