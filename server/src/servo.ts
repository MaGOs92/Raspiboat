import MotorManager from './motor';
import * as servoblaster from 'servoblaster';
import { WriteStream } from 'fs';

export default class ServoController implements MotorManager {

    SERVO_PIN = 1;
    servoStream: WriteStream;
    isWriting = false;

    curDirection = 150;

    constructor() {
        console.log('Creating servo controller');
        this.servoStream = servoblaster.createWriteStream(this.SERVO_PIN);
    }

    calibrate() {
        console.log('Servo : calibrate()');
        if (!this.isWriting) {
            this.curDirection = 150;
            this.isWriting = true;
            this.servoStream.write(this.curDirection, () => {
                this.isWriting = false;
            });
        } else {
            console.log('Error : stream is in use');
        }
    }

    setPwm(direction: number) {
        console.log('setPwm()', direction);
        if (direction === this.curDirection) {
            return;
        }
        if (!this.isWriting) {
            this.isWriting = true;
            this.servoStream.write(direction, () => {
                this.isWriting = false;
                this.curDirection = direction;
            });
        }
    }
}
