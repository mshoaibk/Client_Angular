import { Component, EventEmitter, Output } from '@angular/core';
import { AddTicketService } from './add-ticket.service';

@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent {
  @Output() closed = new EventEmitter();
  dummyImage: boolean = true;
  uplodedFileUrl: string = '';
  ticketname:any;
  email:any;
  gender:any;
  experience:any;
  phoneNumber:any;
  acceptFiles=['.jpg', '.jpeg', '.png', '.gif', '.bmp']

  constructor(private ticketServices:AddTicketService){

  }

  ngOnInit():void{

  }

  saveTicketInfo(){

  }
  openFileUploadModal(event:any) {
    // this.fileUpload = event?.target?.files[0] || new File([], 'default-filename');
    // this.uplodedFileUrl = URL.createObjectURL(event.target.files[0]);
    // this.dummyImage = false;
    // this.employeeRegisterRqst.photoType = 'uploadedurl';
  }
  removeUploadedFile() {
    // this.employeeRegisterRqst.employeePhoto = '';
    // this.uplodedFileUrl = '';
    // this.response.dbPath = '';
    // this.captureImage = '';
    // this.employeeRegisterRqst.photoType = '';
  }

  saveTicketInformation() {
    // if (!this.employeeRegisterRqst.fullName) {
    //   this.toastrService.error('Enter a Full Name.', 'error');
    //   return false;
    // }
    // else if (!this.employeeRegisterRqst.email) {
    //   this.toastrService.error('Enter an employee email.', 'error');
    //   return false;
    // }
    // else if (!this.employeeRegisterRqst.gender) {
    //   this.toastrService.error('Enter an employee gender.', 'error');
    //   return false;
    // }
    // this.tabNumber = 2;
    // return true;
  }

  closeTicketForm() {
    this.closed.emit(false);
  }
}
