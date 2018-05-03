import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { WebsocketService } from '../classes/websocket-service';

@Injectable()
export class SteeringService extends WebsocketService {

    MIN_DIRECTION = 115;
    MAX_DIRECTION = 185;
    DEFAULT_DIRECTION = 150;

    MIN_SPEED = 180;
    MAX_SPEED = 100;
    DEFAULT_SPEED = 150;

    private _curSpeed: number;

    get curSpeed(): number {
        return this._curSpeed;
    }

    set curSpeed(speed: number) {
        if (speed < this.MAX_SPEED) {
            speed = this.MAX_SPEED;
        } else if (speed > this.MIN_SPEED) {
            speed = this.MIN_SPEED;
        }
        this._curSpeed = speed;
    }

    private _curDirection: number;

    get curDirection(): number {
        return this._curDirection;
    }

    set curDirection(direction: number) {
        if (direction > this.MAX_DIRECTION) {
            direction = this.MAX_DIRECTION;
        } else if (direction < this.MIN_DIRECTION) {
            direction = this.MIN_DIRECTION;
        }
        this._curDirection = direction;
    }

    constructor() {
      super();
      this.curDirection = this.DEFAULT_DIRECTION;
      this.curSpeed = this.DEFAULT_SPEED;
    }

    connect(): void {
        if (this.ws) {
            this.ws.close();
        }

        this.ws = new WebSocket(environment.steeringUrl);

        this.ws.onopen = () => {
            console.log('Motors websocket : connection opened');
            this.connected = true;
        };

        this.ws.onmessage = (msg: MessageEvent) => {};

        this.ws.onclose = () => {
            console.log('Motors websocket : connection closed');
            this.connected = false;
        };
    }

    reset(): void {
        this.curDirection = this.DEFAULT_DIRECTION;
        this.curSpeed = this.DEFAULT_SPEED;
    }

    sendCommand(): void {
        this.ws.send(JSON.stringify({
            speed: this.curSpeed,
            direction: this.curDirection
        }));
    }

    getCurSpeedInPercent(): number {
        return Math.round((Math.abs(this.curSpeed - this.DEFAULT_SPEED) / Math.abs(this.MAX_SPEED - this.DEFAULT_SPEED)) * 100);
    }
}
