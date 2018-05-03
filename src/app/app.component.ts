import { StreamService, SteeringService } from './services';
import { Component, ViewChild } from '@angular/core';
import fscreen from 'fscreen';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('appWrapper') appWrapperRef;
  isFullscreen = false;

  constructor(
    private steeringService: SteeringService,
    private streamService: StreamService
  ) {
    fscreen.onfullscreenchange = () => this.isFullscreen = !this.isFullscreen;
  }

  tryConnection() {
    if (!this.steeringService.connected) {
      this.steeringService.connect();
    }
    if (!this.streamService.connected) {
      this.streamService.connect();
    }
  }
  isStreamingConnected() {
    return this.streamService.connected;
  }
  isSteeringConnected() {
    return this.steeringService.connected;
  }
  toggleFullScreen() {
    if (!fscreen.fullscreenEnabled) {
      return;
    }
    fscreen.fullscreenElement ?
      fscreen.exitFullscreen() :
      fscreen.requestFullscreen(this.appWrapperRef.nativeElement);
  }
}
