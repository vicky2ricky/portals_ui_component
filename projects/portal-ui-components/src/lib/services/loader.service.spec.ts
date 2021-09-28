import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReplaySubject } from 'rxjs';
import { NavigationStart, Router, RouterEvent } from '@angular/router';

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routeMock = {
  navigate: jasmine.createSpy('navigate'),
  events: eventSubject.asObservable(),
  url: 'dummy'
};

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [LoaderService,
        {
          provide: Router,
          useValue: routeMock
        }]
    });
    // Returns a service with the MockBackend so we can test with dummy responses
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    eventSubject.next(new NavigationStart(1, ''));
    expect(service).toBeTruthy();
  });

  it('active: should set keepAfterNavigationChange', fakeAsync(() => {
    const sub = service.getState().subscribe(resp => {
      expect(resp).toEqual(true);
      sub.unsubscribe();
    });
    service.active(true);
    tick();
  }));

  it('inactive: should set keepAfterNavigationChange', fakeAsync(() => {
    const sub = service.getState().subscribe(resp => {
      expect(resp).toEqual(false);
      sub.unsubscribe();
    });
    service.inactive(false);
    tick();
  }));
});


