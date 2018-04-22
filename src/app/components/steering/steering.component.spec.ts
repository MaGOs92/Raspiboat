import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteeringComponent } from './steering.component';

describe('SteeringComponent', () => {
  let component: SteeringComponent;
  let fixture: ComponentFixture<SteeringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteeringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteeringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
