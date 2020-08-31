import { TestBed } from '@angular/core/testing';

import { ControlServiceService } from './control-service.service';

describe('ControlServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControlServiceService = TestBed.get(ControlServiceService);
    expect(service).toBeTruthy();
  });
});
