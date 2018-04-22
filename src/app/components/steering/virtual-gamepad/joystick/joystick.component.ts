import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as nipplejs from 'nipplejs';
import { JoystickValues } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-joystick',
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.scss']
})
export class JoystickComponent implements AfterViewInit {

  @Output() move: EventEmitter<any> = new EventEmitter<any>();

  private manager;

  constructor() {}

  ngAfterViewInit(): void {
      this.manager = nipplejs.create({
          zone: document.getElementById('joystick-zone'),
          color: 'blue',
          mode: 'static',
          position: {
              top: '75px',
              left: '70px'
          }
      });
      this.manager.on('move', (event, data) => {
          const xAxisLength = (event.target.box.x + (event.target.box.width / 2));
          const x = (data.position.x - xAxisLength) / (event.target.box.width / 4);

          const yAxisLength = (event.target.box.y + (event.target.box.height / 2));
          const y = (data.position.y - yAxisLength) / (event.target.box.height / 4);

          const joystickValues: JoystickValues = {
              x,
              y
          };
          this.move.emit(joystickValues);
      });
      this.manager.on('end', (event, data) => {
          const joystickValues: JoystickValues = {
              x: 0,
              y: 0
          };
          this.move.emit(joystickValues);
      });
  }
}
