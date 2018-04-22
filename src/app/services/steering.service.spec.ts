import { TestBed, inject } from '@angular/core/testing';

import { SteeringService } from './steering.service';

describe('SteeringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SteeringService]
    });
  });

  it('should be created', inject([SteeringService], (service: SteeringService) => {
    expect(service).toBeTruthy();
  }));
});
