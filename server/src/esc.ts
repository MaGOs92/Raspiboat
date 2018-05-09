import MotorManager from './motor';
import * as servoblaster from 'servoblaster';
import { WriteStream } from 'fs';

export default class ESCController implements MotorManager {

    ESC_PIN = 2;
    escStream: WriteStream;
    isWriting = false;

    curSpeed = 150;

    constructor() {
        console.log('Creating esc controller');
        this.escStream = servoblaster.createWriteStream(this.ESC_PIN);
    }

    calibrate() {
        console.log('ESC : calibrate()');
        if (!this.isWriting) {
            this.curSpeed = 150;
            this.isWriting = true;
            this.escStream.write(this.curSpeed, () => {
              this.isWriting = false;
            });
        } else {
            console.log('Error : stream is in use');
        }
    }

    setPwm(speed: number) {
        console.log('setPwm()', speed);
        if (speed === this.curSpeed) {
            return;
        }
        if (!this.isWriting) {
            this.isWriting = true;
            this.escStream.write(speed, () => {
                this.isWriting = false;
                this.curSpeed = speed;
            });
        }
    }
}
