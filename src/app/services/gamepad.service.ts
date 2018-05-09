import { SteeringService } from './steering.service';
import { Gamepad } from './../interfaces/interfaces';
import { Injectable } from '@angular/core';
import { VirtualGamepadComponent } from '../components/steering/virtual-gamepad/virtual-gamepad.component';
import { PhysicalGamepad } from '../classes/physical-gamepad';

export enum CONTROL_MODE {
    VIRTUAL_GAMEPAD,
    PHYSICAL_GAMEPAD
}

@Injectable()
export class GamepadService {

    mode: CONTROL_MODE = CONTROL_MODE.VIRTUAL_GAMEPAD;
    vGamepad: VirtualGamepadComponent;
    pGamepad: PhysicalGamepad;
    curGamepad: Gamepad;
    subscription;

    constructor(private steeringService: SteeringService) {
        this.addListeners();
    }

    addListeners() {
        window.addEventListener('gamepadconnected', (event: any) => {
            console.log('Gamepad connected');
            this.mode = CONTROL_MODE.PHYSICAL_GAMEPAD;
            this.pGamepad = new PhysicalGamepad();
            this.setCurrentGamepad(this.pGamepad);
        });
        window.addEventListener('gamepaddisconnected', (event: any) => {
            console.log('Gamepad disconnected');
            if (this.vGamepad) {
                this.mode = CONTROL_MODE.VIRTUAL_GAMEPAD;
                this.setCurrentGamepad(this.vGamepad);
            }
        });
    }

    registerVirtualGamepad(vGamepad: VirtualGamepadComponent) {
        this.vGamepad = vGamepad;
        if (!this.curGamepad) {
            this.mode = CONTROL_MODE.VIRTUAL_GAMEPAD;
            this.setCurrentGamepad(this.vGamepad);
        }
    }

    setCurrentGamepad(gamepad: Gamepad) {
        if (this.subscription) {
            console.log('Désabo');
            this.subscription.unsubscribe();
        }
        this.curGamepad = gamepad;
        this.subscription = this.curGamepad.changeEmitter.subscribe((event) => this.gamepadEventHandler(event));
    }

    gamepadEventHandler(event: any) {

        // Joystick Y axis
        const yAxis =  -event.joystickValues.y;
        const halfMaxSpeed = Math.abs(this.steeringService.MAX_SPEED - this.steeringService.DEFAULT_SPEED) / 2;
        const halfMinSpeed = Math.abs(this.steeringService.MIN_SPEED - this.steeringService.DEFAULT_SPEED) / 2;
        const speedToApply = (yAxis > 0) ? halfMaxSpeed : halfMinSpeed;
        this.steeringService.curSpeed = this.steeringService.DEFAULT_SPEED + (speedToApply * yAxis);

        // Joystick X axis
        const xAxis = event.joystickValues.x;
        const directionDelta = this.steeringService.MAX_DIRECTION - this.steeringService.DEFAULT_DIRECTION;
        this.steeringService.curDirection = this.steeringService.DEFAULT_DIRECTION - (directionDelta * xAxis);

        // Buttons
        if (event.boostButtonPressed && event.brakeButtonPressed) {
            this.steeringService.curSpeed = this.steeringService.DEFAULT_SPEED;
        } else if (event.boostButtonPressed) {
            this.steeringService.curSpeed = this.steeringService.MAX_SPEED;
        } else if (event.brakeButtonPressed) {
            this.steeringService.curSpeed = this.steeringService.MIN_SPEED;
        }

        if (this.steeringService.connected) {
            this.steeringService.sendCommand();
        }
    }
}
