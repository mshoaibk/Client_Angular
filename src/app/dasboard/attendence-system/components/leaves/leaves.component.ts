import { Component } from '@angular/core';
@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {
  showView: number = 0;
  constructor() { }

  switchViewTab() {
    if (this.showView == 0) {
      this.showView = 1
    }
    else {
      this.showView = 0
    }
  }
}


