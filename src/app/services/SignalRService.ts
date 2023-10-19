
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private companyId: string;
  private hubConnection: signalR.HubConnection;
  private connectionId: string = "";
  constructor(
    private toastrService: ToastrService,
    private userContextService: UserContextService,
  ) {
    this.companyId = this.userContextService.user$._value.companyID;
    //establish THe Connection For Service
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:44398/chatHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();

    //Get Connection Id for EveryPage If u want to Store
    this.hubConnection.on('Connected', (connectionId: string) => {
      this.connectionId = connectionId
      this.toastrService.success(connectionId)

      //console.log('Connection ID:', connectionId);
    });
    this.hubConnection.on('SetsingalRId', (UserSignalRId: string) => {

      this.storeIdInLocalStorage(UserSignalRId);
      //console.log('Connection ID:', connectionId);
    });
    //notification Recive 
    this.hubConnection.on('SendMeasseNotifayMe', (notifying: string) => {
      this.toastrService.success(notifying);

    });

    this.hubConnection.on('ReceivePrivateMessage', (chatID: string, message: string) => {
      //from chatId it is actually user id or sender so just open the chat of this person between u
      console.log("From chat:" + chatID);
      console.log(message)
    });
    this.startConnection()
  }
  storeIdInLocalStorage(id: string): void {
    localStorage.removeItem('SinalRuserId');
    localStorage.setItem('SinalRuserId', id.toString());
    console.log('SinalRuserId:' + id.toString())
  }
  startConnection() {
    if (this.hubConnection.state === 'Disconnected') {
      this.hubConnection
        .start()
        .then(() => {
          console.log('SignalR connection started successfully.');
          console.log("ConnectionId :" + this.connectionId);
          // Implement any logic you need after a successful connection
        })
        .catch((error) => {
          console.error('Error starting SignalR connection:', error);
          // You may choose to handle connection startup errors here
        });
    } else {
      console.warn('SignalR connection is already in a connected or connecting state.');

    }
  }
  openNewPage(currentUserId: string, userName: string): void {
    const brwserInfo = navigator.userAgent;
    // console.log('User-Agent:', userAgent);
    if (this.hubConnection.state === 'Connected') {
      this.hubConnection.invoke('OpenNewPage', currentUserId, userName, "1", brwserInfo.toString()).catch((error) => {
        console.error('Error JoinPrivateChat:', error);
      });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }
  }
  leavePage(currentUserId: string, name: string): void {
    const brwserInfo = navigator.userAgent;
    // console.log('User-Agent:', userAgent);
    this.hubConnection.invoke('LeavePage', currentUserId, name, "1", brwserInfo.toString());
  }
  sendPrivateMessage(recipientUserId: string, message: string, ReceptType: string): void {
    // Ensure that the connection is in the 'Connected' state before sending the message
    if (this.hubConnection.state === 'Connected') {
      // Call a server-side hub method to send the private message
      this.hubConnection.invoke('SendPrivateMessage', this.companyId.toString(), recipientUserId, "1", ReceptType, message)
        .catch((error) => {
          console.error('Error sending private message:', error);
        });
    } else {
      console.error('SignalR connection is not in the "Connected" state.');
    }

  }
  receivePrivateMessage() {

    this.hubConnection.on('ReceivePrivateMessage', (fromUserId: string, message: string) => {
      //from chatId it is actually user id or sender so just open the chat of this person between u
      console.log("ChatID:" + fromUserId);
      console.log(message)
      //this.messages.push(message)
      //this.message = message
    });
  }
}
