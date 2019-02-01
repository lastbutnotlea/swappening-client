import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Event} from '../shared/event-model'
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _swipeEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _hostedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _likedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _swipeEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private apiService: ApiService) {
    this.apiService.login().then(() => {
        this.apiService.getHostedEvents('1213').subscribe(res => {
          this._hostedEvents.next(res);
          this._hostedEventsLoaded.next(true);
          // TODO FIX THIS AS SOON AS ALEX PROVIDES THE CORRECT ENDPOINT
          this._likedEvents.next(res);
          this._likedEventsLoaded.next(true);
        });
        // this.apiService.getLikesEvents();
        this.apiService.getFirstSwipeEvents('1213').subscribe(res => {
          this._swipeEvents.next(res);
          this._swipeEventsLoaded.next(true);
        })
      }
    );
  }

  ngOnInit() {
  }

  get hostedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._hostedEvents.subscribe(fn));
  }

  get hostedEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._hostedEventsLoaded.subscribe(fn));
  }

  get likedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._likedEvents.subscribe(fn));
  }

  get likedEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._likedEventsLoaded.subscribe(fn));
  }

  get swipeEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._swipeEvents.subscribe(fn));
  }

  get swipeEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._swipeEventsLoaded.subscribe(fn));
  }

  event(id: number): Observable<Event> {
    let findEvent = new Observable<Event[]>(fn =>
      this._hostedEvents.subscribe(fn)).pipe(map((hostedEvents: Event[]) => hostedEvents.find(event => event.id === id)));
    if (findEvent) return findEvent;
    findEvent = new Observable<Event[]>(fn =>
      this._likedEvents.subscribe(fn)).pipe(map((likedEvents: Event[]) => likedEvents.find(event => event.id === id)));
    if (findEvent) return findEvent;
    findEvent = new Observable<Event[]>(fn =>
      this._swipeEvents.subscribe(fn)).pipe(map((swipeEvents: Event[]) => swipeEvents.find(event => event.id === id)));
    return findEvent;
  }

  async createNewHostedEvent(newEvent: Event): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let newEventId;
      this.apiService.createNewHostedEvent(newEvent).subscribe(res => {
        newEventId = res.id;
        this._hostedEvents.next([res].concat(this._hostedEvents.value));
        resolve(newEventId);
      });
    });
  }

  public uploadPicture(selectedFile: File, eventId: number) {
    this.apiService.uploadPicture(selectedFile, eventId).subscribe(res => {
      let editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
      let newEventsArray = this._hostedEvents.value;
      newEventsArray[editedEventIndex].pictures_events = res;
      this._hostedEvents.next(newEventsArray);
    })
  }

  public updateHostedEvent(newEvent: Event) {
    this.apiService.updateHostedEvent(newEvent).subscribe(res => {
      let editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === newEvent.id);
      let newEventsArray = this._hostedEvents.value;
      newEventsArray[editedEventIndex] = res;
      this._hostedEvents.next(newEventsArray);
    })
  }

  public fetchNewSwipeEvents() {
    this.apiService.getSwipeEvents('1213').subscribe(res => this._swipeEvents.next(this._swipeEvents.value.slice(10,15).concat(res)));
  }
}
