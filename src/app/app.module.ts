import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SteeringComponent } from './components/steering/steering.component';
import { StreamComponent } from './components/stream/stream.component';
import { VirtualGamepadComponent } from './components/steering/virtual-gamepad/virtual-gamepad.component';
import { JoystickComponent } from './components/steering/virtual-gamepad/joystick/joystick.component';
import {
  SteeringService,
  GamepadService,
  StreamService
} from './services';

import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
  declarations: [
    AppComponent,
    SteeringComponent,
    StreamComponent,
    VirtualGamepadComponent,
    JoystickComponent
  ],
  imports: [
    BrowserModule,
    NgxGaugeModule
  ],
  providers: [
    SteeringService,
    GamepadService,
    StreamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
