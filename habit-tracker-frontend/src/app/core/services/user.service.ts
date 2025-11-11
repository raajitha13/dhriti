import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, timer } from 'rxjs';
import { debounceTime, mapTo, startWith, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private activity$ = new BehaviorSubject<number>(0); // number of user interactions
  private idle$ = new BehaviorSubject<boolean>(false);
  private mood$ = new BehaviorSubject<'neutral' | 'active' | 'bored' | 'stressed'>('neutral');

  constructor(private zone: NgZone) {
    this.initActivityTracking();
    this.initMoodTracking();
  }

  /** Tracks user actions to infer engagement level */
  private initActivityTracking(): void {
    this.zone.runOutsideAngular(() => {
      const events$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'click'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'scroll')
      );

      events$.pipe(
        debounceTime(300),
        mapTo(Date.now())
      ).subscribe(() => {
        this.zone.run(() => {
          this.activity$.next(this.activity$.value + 1);
          this.idle$.next(false);
        });
      });

      // Detect idle state after 15s of no activity
      timer(0, 1000).pipe(
        switchMap(() => timer(15000).pipe(mapTo(true), startWith(false))),
        distinctUntilChanged()
      ).subscribe(idle => {
        this.zone.run(() => this.idle$.next(idle));
      });
    });
  }

  /** Maps interaction + idle state to approximate mood */
  private initMoodTracking(): void {
    merge(this.activity$, this.idle$)
      .pipe(debounceTime(1000))
      .subscribe(() => {
        const interactions = this.activity$.value;
        const idle = this.idle$.value;

        let mood: 'neutral' | 'active' | 'bored' | 'stressed' = 'neutral';

        if (idle && interactions < 5) mood = 'bored';
        else if (interactions > 50) mood = 'stressed';
        else if (interactions > 20) mood = 'active';

        this.mood$.next(mood);
      });
  }

  /** Expose current mood as observable */
  getMood() {
    return this.mood$.asObservable();
  }

  /** Returns current mood value synchronously */
  get currentMood() {
    return this.mood$.value;
  }

  /** Reset mood + activity (e.g., on logout or reflection complete) */
  resetState(): void {
    this.activity$.next(0);
    this.mood$.next('neutral');
  }
}
