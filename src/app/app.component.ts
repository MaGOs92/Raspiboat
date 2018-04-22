import { StreamService, SteeringService } from './services';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private steeringService: SteeringService,
    private streamService: StreamService
  ) {}

  tryConnection() {
    if (!this.steeringService.connected) {
      this.steeringService.connect();
    }
    if (!this.streamService.connected) {
      this.streamService.connect();
    }
  }
}
