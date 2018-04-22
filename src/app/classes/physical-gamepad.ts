import { Gamepad, JoystickValues } from '../interfaces/interfaces';
import { EventEmitter } from '@angular/core';

export class PhysicalGamepad implements Gamepad {

    boostButtonPressed = false;
    brakeButtonPressed = false;
    joystickValues: JoystickValues = {
        x: 0,
        y: 0
    };

    changeEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        this.updateLoop();
    }

    updateLoop() {
        if (!navigator.getGamepads) {
            throw new Error('Gamepad API is not available on this browser');
        }
        const gamepad = navigator.getGamepads() && navigator.getGamepads()[0];
        if (!gamepad) {
            return;
        }
        let hasChanged = false;
        if (this.boostButtonPressed !== gamepad.buttons[5].pressed) {
            this.boostButtonPressed = gamepad.buttons[5].pressed;
            hasChanged = true;
        }
        if (this.brakeButtonPressed !== gamepad.buttons[4].pressed) {
            this.brakeButtonPressed = gamepad.buttons[4].pressed;
            hasChanged = true;
        }
        if (this.joystickValues.x !== gamepad.axes[0] || this.joystickValues.y !== gamepad.axes[1]) {
            this.joystickValues = {
                x: gamepad.axes[0],
                y: gamepad.axes[1]
            };
            hasChanged = true;
        }
        if (hasChanged) {
            this.changeEmitter.emit({
                boostButtonPressed: this.boostButtonPressed,
                brakeButtonPressed: this.brakeButtonPressed,
                joystickValues: this.joystickValues
            });
        }
        return setTimeout(() => this.updateLoop(), 30);
    }
}
