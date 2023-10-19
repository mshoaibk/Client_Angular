import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { AddTicketComponent } from 'src/app/common/add-ticket/add-ticket.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  @ViewChild('ticketContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  isOpenInfo:boolean=false;
  info:boolean=true
  descriptionBody:any
  constructor( private componentFactoryResolver: ComponentFactoryResolver,private injector: Injector){}

  ngOnInit():void{

  }

  infoToggle(){
    this.isOpenInfo=true
    this.info=true

  }
  infoToggles(){
    this.isOpenInfo=false
    this.info=false
  }
  openChatPopup(action: string = '', model: any = {}) {
    model.action = action;
    // model.openfrom = action == 'save' ? 'add-salary' : '';
    const data: any =
    {
      salaryObj: model
    };

    const factory = this.componentFactoryResolver.resolveComponentFactory(AddTicketComponent);
    const popupInjector = Injector.create({
      providers: [{ provide: 'data', useValue: data }],
      parent: this.injector,
    });


    const popupRef = factory.create(popupInjector);
    this.dialogContainer?.insert(popupRef.hostView);
    popupRef.instance.closed.subscribe((status: any) => {
      popupRef.destroy();
      if (status){
        // this.showEmployeeSalarySlipList();
      }
      
    });
  }
}
