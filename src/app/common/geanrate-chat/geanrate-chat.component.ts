import { Component, EventEmitter, Inject, Injector, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserContextService } from 'src/app/services/user-context.service';
import { ChatService } from './chat.service';
import { SignalRService } from 'src/app/services/SignalRService';

@Component({
  selector: 'app-geanrate-chat',
  templateUrl: './geanrate-chat.component.html',
  styleUrls: ['./geanrate-chat.component.scss']
})
export class GeanrateChatComponent {
  @Output() closed = new EventEmitter();
  searchEmployeesRqst: any = {};
  employeeList:any;
  MessageBody:any
  employeeLists:any=[]
  config_pgEmployeeList = {
    id: "pg_EmployeeList",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
constructor( @Inject('data') public data: any, private injector: Injector,private userContextService: UserContextService, private spinnerService: NgxSpinnerService,private employeeChatService: ChatService,private signalRService:SignalRService,
){
  this.employeeList=0
  this.searchEmployeesRqst.location = '';
    this.searchEmployeesRqst.employmentType = '';
    this.searchEmployeesRqst.department = '';
    this.searchEmployeesRqst.position = '';
    this.searchEmployeesRqst.employeeName = '';
    this.searchEmployeesRqst.employmentStatus = '';
}
ngOnInit():void{
this.getEmployeeBasicDetailForChat()
}
saveEmployeeChatInfo() {

  // if (!this.Validate()) {
  //   return;
  // }
  // debugger
const employeData = {
"companyId": this.userContextService.user$._value.companyID,
// "employeeIds": this.selectedEmployeeIds,
"employeeList":this.employeeList,
"MessageBody":this.MessageBody,

}
    this.spinnerService.show();
    //this.signalRService.sendPrivateMessage(this.employeeList,this.MessageBody).subscribe((res:any)=>{
      //console.log(res)
  
// this.employeeChatService.GenarateEmployeeSalary(employeData).subscribe(data => {
//   console.log("hello",data)
//       if (data.status) {
//         this.toastrService.success("Salary Generated Successfully.", 'Success');
//         this.closed.emit(true);
//       }
      // this.spinnerService.hide();
//       // this.closeSalaryForm()
//     });
}
getEmployeeBasicDetailForChat() {
  let model = {
    "companyID": this.userContextService.user$._value.companyID,
    "location": this.searchEmployeesRqst.location,
    "employmentType": this.searchEmployeesRqst.employmentType,
    "department": this.searchEmployeesRqst.department,
    "position": this.searchEmployeesRqst.position,
    "employeeName": this.searchEmployeesRqst.employeeName,
    "employmentStatus": this.searchEmployeesRqst.employmentStatus,
    "pageIndex": this.config_pgEmployeeList.currentPage - 1,
    "pageSize": this.config_pgEmployeeList.itemsPerPage,
  };
  this.spinnerService.show();
  this.employeeChatService.getEmployeeBasicDetailForChat(model).subscribe(data => {
    console.log(data)
    if (data.status) {
      this.employeeLists = data.employeelist;
      console.log("emp",this.employeeLists)
      this.config_pgEmployeeList.totalItems = data.totalRecords;
    }
    this.spinnerService.hide();
  });
}


saveEmployeeSalary(){
  console.log("ans",this.employeeList)
}
closeSalaryForm() {
  this.closed.emit(false);
}
}
