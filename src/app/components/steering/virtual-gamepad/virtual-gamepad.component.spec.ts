import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualGamepadComponent } from './virtual-gamepad.component';

describe('VirtualGamepadComponent', () => {
  let component: VirtualGamepadComponent;
  let fixture: ComponentFixture<VirtualGamepadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualGamepadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualGamepadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
