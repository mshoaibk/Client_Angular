import { Component, ComponentFactoryResolver, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { GeanrateChatComponent } from 'src/app/common/geanrate-chat/geanrate-chat.component';
import { SignalRService } from 'src/app/services/SignalRService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @ViewChild('chatContainer', { read: ViewContainerRef }) dialogContainer?: ViewContainerRef;
  chatall:boolean=true;
  privatechat:boolean=true;
  employees:any
  employeeList:any=[
    {"name": "Ali", "id": 1},
    {"name": "Afan", "id": 2},
    {"name": "Ahmad", "id": 3},
    {"name": "Abdullah", "id": 4},
    {"name": "Umer", "id": 5},
    {"name": "Umair", "id": 6},
    {"name": "Omer", "id": 7},
    {"name": "Laraib", "id": 8},
  ]

  constructor( private componentFactoryResolver: ComponentFactoryResolver,private injector: Injector){
    this.employees=0
  }
  ngOnInit():void{
    this.showAllChat()
  }
  showAllChat(){
  this.chatall=true
  this.privatechat=false
  }
  showPrivateChat(){
    this.chatall=false
    this.privatechat=true
  }
  openChatPopup(action: string = '', model: any = {}) {
    model.action = action;
    // model.openfrom = action == 'save' ? 'add-salary' : '';
    const data: any =
    {
      salaryObj: model
    };

    const factory = this.componentFactoryResolver.resolveComponentFactory(GeanrateChatComponent);
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
