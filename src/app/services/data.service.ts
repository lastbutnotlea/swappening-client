import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Event} from '../shared/event-model'
import {User} from '../shared/user-model'
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  // Events
  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _swipeEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _hostedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _likedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _swipeEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Users
  private _me: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  //private _interestedUsers: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private _interestedUsers: BehaviorSubject<Map<number,User[]>> = new BehaviorSubject<Map<number,User[]>>(new Map)
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);


  constructor(private apiService: ApiService) {
    this.apiService.login().then(() => {
        this.apiService.getHostedEvents('1213').subscribe(res => {
          this._hostedEvents.next(res);
          this._hostedEventsLoaded.next(true);
          let myMap = new Map();
          let hostedEvents: Event[] = this._hostedEvents.value;
          hostedEvents.forEach(hostedEvent => {
            this.apiService.getInterestedUsers(hostedEvent.id).subscribe(userRes => {
              myMap.set(hostedEvent.id, userRes);
              this._interestedUsers.next(myMap);
            });
          });
/*          for (let hostedEvent in hostedEvents) {
            this.apiService.getInterestedUsers(hostedEvent.id).subscribe(userRes => {
              myMap.set(hostedEvent.id, userRes);
              this._interestedUsers.next(myMap);
            });
          }*/
        });
        this.apiService.getLikedEvents('1213').subscribe(res => {
          this._likedEvents.next(res);
          this._likedEventsLoaded.next(true);
        });
        this.apiService.getFirstSwipeEvents('1213').subscribe(res => {
          this._swipeEvents.next(res);
          this._swipeEventsLoaded.next(true);
        });
        this.apiService.getMyDetails().subscribe(res => {
          this._me.next(res);
        });
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

  /*get interestedUsers(): Observable<User[]> {
    return new Observable<User[]>(fn =>
       this._interestedUsers.subscribe(fn));
  }*/
  get interestedUsers(): Observable<Map<number,User[]>> {
    return new Observable<Map<number,User[]>>(fn =>
       this._interestedUsers.subscribe(fn));
  }

  get me(): Observable<User> {
    return new Observable<User>(fn => this._me.subscribe(fn));
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

  // We might want to use this at some point
  /*user(id: number): Observable<User> {
    let findUser = new Observable<User[]>(fn =>
      this._interestedUsers.subscribe(fn)).pipe(map((interestedUsers: User[]) => interestedUsers.find(user => user.id === id)));
    return findUser;
  }*/
  public user(userId: number): Observable<User> {
    this.apiService.getUserDetails(userId).subscribe(res => {this._currentUser.next(res);})
    return new Observable<User>(fn => this._currentUser.subscribe(fn))
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

  public deletePicture(pictureStorageName: string, eventId: number) {
    this.apiService.deletePicture(pictureStorageName).subscribe(res => console.log(res));
    let editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    let newEventsArray = this._hostedEvents.value;
    newEventsArray[editedEventIndex].pictures_events = newEventsArray[editedEventIndex].pictures_events.filter(
      pic => pic.pictureStorageName !== pictureStorageName
    );
    this._hostedEvents.next(newEventsArray);
  }

  public makeFirstPicture(pictureOrdering, eventId: number) {
    if(pictureOrdering.length === 0) return;
    let firstPictureStorageName = pictureOrdering.find(picture => picture.order === 1).pictureStorageName;
    let editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    let newEventsArray = this._hostedEvents.value;
    let newFirstPictureIndex = newEventsArray[editedEventIndex].pictures_events.findIndex(picture => picture.pictureStorageName === firstPictureStorageName);
    newEventsArray[editedEventIndex].pictures_events.splice(0, 0, newEventsArray[editedEventIndex].pictures_events.splice(newFirstPictureIndex, 1)[0]);
    this._hostedEvents.next(newEventsArray);
    this.apiService.makeFirstPicture(pictureOrdering, eventId).subscribe(res => {
      newEventsArray[editedEventIndex].pictures_events = res;
      this._hostedEvents.next(newEventsArray);
    });
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
    this.apiService.getSwipeEvents('1213').subscribe(res => this._swipeEvents.next(this._swipeEvents.value.slice(10, 15).concat(res)));
  }
}
