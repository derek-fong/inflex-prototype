import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';

@Injectable()
export class SidenavService {
  toggle$: Observable<boolean>;
  private toggleSource: BehaviorSubject<boolean>;

  constructor() {
    this.toggleSource = new BehaviorSubject<boolean>(undefined);
    this.toggle$ = this.toggleSource.asObservable();
  }

  /**
   * Trigger toggle.
   */
  triggerToggle(): void {
    this.toggleSource.next(true);
  }
}
