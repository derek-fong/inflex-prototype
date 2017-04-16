import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../auth/shared/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    class MockAuthService {
      call$(): Observable<any> { return Observable.of(undefined); }
    }

    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
