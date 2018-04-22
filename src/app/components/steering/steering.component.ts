import { Component, OnInit } from '@angular/core';
import { SteeringService } from '../../services/steering.service';
import { GamepadService, CONTROL_MODE } from '../../services/gamepad.service';

@Component({
  selector: 'app-steering',
  templateUrl: './steering.component.html',
  styleUrls: ['./steering.component.scss']
})
export class SteeringComponent implements OnInit {

  gaugeSize: number;
  gaugeMotorthresholdsConfig = {
    '0': { color: 'green' },
    '75': { color: 'orange' },
    '90': { color: 'red' }
  };

  constructor(
    private steeringService: SteeringService,
    private gamepadService: GamepadService
  ) {}

  ngOnInit() {
    this.steeringService.connect();
  }

  displayVirtualGamepad() {
    return this.gamepadService.mode === CONTROL_MODE.VIRTUAL_GAMEPAD;
  }

}
