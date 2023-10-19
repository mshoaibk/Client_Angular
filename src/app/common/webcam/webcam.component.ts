import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent {
  private trigger = new Subject<void>();
  public webcamImage!: WebcamImage;
  private nextWebcam = new Subject();
  captureImage:any = '';
  @Input() data: any;
  @Output() closeDialog: EventEmitter<any>= new EventEmitter();

  public triggerSnapshot(flag: boolean): void {
    if (flag){
      this.trigger.next(this.captureImage);
      this.closeDialog.emit(this.captureImage);
    }
    else {
      this.closeDialog.emit('');
    }
  }
  
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.captureImage = webcamImage!.imageAsDataUrl;
  }

  public get triggerObservable() {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable() {
    return this.nextWebcam.asObservable();
  }
}
