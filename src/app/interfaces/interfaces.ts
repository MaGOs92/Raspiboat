import { EventEmitter } from '@angular/core';

export interface Gamepad {
    boostButtonPressed: boolean;
    brakeButtonPressed: boolean;
    joystickValues: JoystickValues;
    changeEmitter: EventEmitter<any>;
}

export interface JoystickValues {
    x: number;
    y: number;
}
