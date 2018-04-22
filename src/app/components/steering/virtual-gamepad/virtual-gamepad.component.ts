import { Gamepad, JoystickValues } from './../../../interfaces/interfaces';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { GamepadService } from '../../../services/gamepad.service';

@Component({
  selector: 'app-virtual-gamepad',
  templateUrl: './virtual-gamepad.component.html',
  styleUrls: ['./virtual-gamepad.component.scss']
})
export class VirtualGamepadComponent implements OnInit, Gamepad {

  boostButtonPressed = false;
  brakeButtonPressed = false;
  joystickValues: JoystickValues = {
      x: 0,
      y: 0
  };

  changeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private gamepadService: GamepadService) {}

  ngOnInit() {
      this.gamepadService.registerVirtualGamepad(this);
  }

  joystickMoved(event: JoystickValues) {
      this.joystickValues = event;
      this.emitChanges();
  }

  boostButtonEvent(event: string) {
      this.boostButtonPressed = (event === 'pressed') ? true : false;
      this.emitChanges();
  }

  brakeButtonEvent(event: string) {
      this.brakeButtonPressed = (event === 'pressed') ? true : false;
      this.emitChanges();
  }

  emitChanges () {
      this.changeEmitter.emit({
          boostButtonPressed: this.boostButtonPressed,
          brakeButtonPressed: this.brakeButtonPressed,
          joystickValues: this.joystickValues
      });
  }
}
