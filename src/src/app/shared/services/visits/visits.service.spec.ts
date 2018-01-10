import { TestBed, inject } from '@angular/core/testing';

import { VisitsService } from './visits.service';

describe('VisitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitsService]
    });
  });

  it('should be created', inject([VisitsService], (service: VisitsService) => {
    expect(service).toBeTruthy();
  }));
});
