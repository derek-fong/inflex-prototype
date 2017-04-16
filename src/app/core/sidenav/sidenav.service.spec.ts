import { TestBed, inject } from '@angular/core/testing';

import { SidenavService } from './sidenav.service';

describe('SidenavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidenavService]
    });
  });

  it('should create', inject([SidenavService], (service: SidenavService) => {
    expect(service).toBeTruthy();
  }));

  describe('triggerToggle()', () => {
    it('should trigger toggle', inject([SidenavService], (sideNavService: SidenavService) => {
      sideNavService.triggerToggle();

      sideNavService.toggle$.subscribe((status: Boolean) => {
        expect(status).toBeTruthy();
      });
    }));
  });
});
