import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from '../../../../common/delete-confirmation/delete-confirmation.component';
import { CommonService } from '../../../../services/common.service';
import { UserContextService } from '../../../../services/user-context.service';
import { WeeklyLeavesService } from './weekly-leaves.service';
import { AddWeeklyHolidayComponent } from 'src/app/common/add-weekly-holiday/add-weekly-holiday.component';

@Component({
  selector: 'app-weekly-leaves',
  templateUrl: './weekly-leaves.component.html',
  styleUrls: ['./weekly-leaves.component.scss']
})
export class WeeklyLeavesComponent {
  showView: number = 0;
  days: any = [];
  @ViewChild('deleteContainer', { read: ViewContainerRef }) dialogDeleteContainer?: ViewContainerRef;
  @ViewChild('dialogAddWeeklyContainer', { read: ViewContainerRef }) dialogAddWeeklyContainer?: ViewContainerRef;

  constructor(private weeklyLeavesService: WeeklyLeavesService, private toastrService: ToastrService, private spinnerService: NgxSpinnerService,
    private userContextService: UserContextService, private common: CommonService, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.GetWeeklyHolidaysByCompId();
  }
  OpenModelPopup() {
      const factory = this.componentFactoryResolver.resolveComponentFactory(AddWeeklyHolidayComponent);
      const data: any = {};
      const popupInjector = Injector.create({
        providers: [{ provide: 'data', useValue: data }],
        parent: this.injector,
      });
      const popupRef = factory.create(popupInjector);
      this.dialogAddWeeklyContainer?.insert(popupRef.hostView);
      popupRef.instance.closed.subscribe(() => {
        popupRef.destroy();
       this.GetWeeklyHolidaysByCompId();

      });
   
  }
  GetWeeklyHolidaysByCompId() {
    this.spinnerService.show();
    this.weeklyLeavesService.GetWeeklyHolidaysByCompId(this.userContextService.user$._value.companyID).subscribe(data => {
      if (data.status) {
        this.days = data.holidaysList.result;
      }
      this.spinnerService.hide();
    });
  }

  deleteConfirmationPopup(id: any) {
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
        this.DeleteWeeklyHoliday(id)
      }
    });
  }

  DeleteWeeklyHoliday(id: any) {
    if (id) {
      this.spinnerService.show();
      this.weeklyLeavesService.DeleteWeeklyHoliday(id).subscribe(data => {
        if (data.status) {
          this.toastrService.success("Record has been deleted.");
          this.GetWeeklyHolidaysByCompId();
        }
        this.spinnerService.hide();
      });
    }
  }
}
