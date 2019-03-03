import {Injectable, OnInit} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../shared/event-model";
import {map} from "rxjs/operators";
import {ChatService} from "./chat.service";
import {User} from "../shared/user-model";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: "root"
})
export class DataService implements OnInit {

  // Events
  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _swipeEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _hostedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _likedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _swipeEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Tags
  private _allTags: BehaviorSubject<String[]> = new BehaviorSubject([]);
  private _allTagsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Users
  private _me: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _myId: string;
  // private _interestedUsers: BehaviorSubject<User[]> = new BehaviorSubject([]);
  private _interestedUsers: BehaviorSubject<Map<number, User[]>> = new BehaviorSubject<Map<number, User[]>>(new Map);
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  // aux
  private _eventCounter = 0;

  constructor(private apiService: ApiService, private chatService: ChatService) {
    if (environment.autoLogin) this.apiService.login('test123@beispiel.de', 'password123').then(
      () => this.loadInitialData()
    );
    else {
      this.apiService.loggedIn.subscribe(loggedIn => {
        if (!loggedIn) return;
        else this.loadInitialData();
      });
    }
  }

  loadInitialData() {
    this.apiService.getMyDetails().subscribe(res => {
      this._me.next(res);
      this._myId = this._me.value.id.toString();
      this.apiService.getHostedEvents(this._myId).subscribe(res => {
        this._hostedEvents.next(res);
        this._hostedEventsLoaded.next(true);
        const myMap = new Map();
        const hostedEvents: Event[] = this._hostedEvents.value;
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
      this.apiService.getLikedEvents(this._myId).subscribe(res => {
        this._likedEvents.next(res);
        this._likedEventsLoaded.next(true);
      });
      this.apiService.getFirstSwipeEvents(this._myId).subscribe(res => {
        this._swipeEvents.next(res);
        this._swipeEventsLoaded.next(true);
      });
      this.apiService.getAllTags().subscribe(res => {
        this._allTags.next(res.map(tag => tag.tagName));
        this._allTagsLoaded.next(true);
      });
      this.chatService.initChatAfterLogin(this._myId);
    });
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

  get allTags(): Observable<string[]> {
    return new Observable<string[]>(fn => this._allTags.subscribe(fn));
  }

  get allTagsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._allTagsLoaded.subscribe(fn));
  }

  /*get interestedUsers(): Observable<User[]> {
    return new Observable<User[]>(fn =>
       this._interestedUsers.subscribe(fn));
  }*/
  get interestedUsers(): Observable<Map<number, User[]>> {
    return new Observable<Map<number, User[]>>(fn =>
      this._interestedUsers.subscribe(fn));
  }

  get me(): Observable<User> {
    return new Observable<User>(fn => this._me.subscribe(fn));
  }

  get myId(): string {
    return this._myId;
  }

  hostedEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._hostedEvents.subscribe(fn)).pipe(map((hostedEvents: Event[]) => hostedEvents.find(event => event.id === id)));
  }

  likedEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._likedEvents.subscribe(fn)).pipe(map((likedEvents: Event[]) => likedEvents.find(event => event.id === id)));
  }

  swipeEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._swipeEvents.subscribe(fn)).pipe(map((swipeEvents: Event[]) => swipeEvents.find(event => event.id === id)));
  }

  // We might want to use this at some point
  /*user(id: number): Observable<User> {
    let findUser = new Observable<User[]>(fn =>
      this._interestedUsers.subscribe(fn)).pipe(map((interestedUsers: User[]) => interestedUsers.find(user => user.id === id)));
    return findUser;
  }*/
  public user(userId: number): Observable<User> {
    this.apiService.getUserDetails(userId).subscribe(res => {
      this._currentUser.next(res);
    });
    return new Observable<User>(fn => this._currentUser.subscribe(fn));
  }

  public updateUserDetails(updatedUser: User, selectedFile: File) {
    this.apiService.updateUserDetails(updatedUser, selectedFile).subscribe(res => {
      this._me.next(res);
    });
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

  public deleteHostedEvent(eventId: number) {
    this.apiService.deleteHostedEvent(eventId).subscribe();
    // TODO: refactor?
    const deletedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    newEventsArray.splice(deletedEventIndex, 1);
    this._hostedEvents.next(newEventsArray);
  }

  async uploadPicture(selectedFile: File, eventId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.uploadPicture(selectedFile, eventId).subscribe(res => {
        const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
        const newEventsArray = this._hostedEvents.value;
        newEventsArray[editedEventIndex].pictures_events = res;
        this._hostedEvents.next(newEventsArray);
        resolve(true);
      });
    });
  }

  public deletePicture(pictureStorageName: string, eventId: number) {
    this.apiService.deletePicture(pictureStorageName).subscribe();
    const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    newEventsArray[editedEventIndex].pictures_events = newEventsArray[editedEventIndex].pictures_events.filter(
      pic => pic.pictureStorageName !== pictureStorageName
    );
    this._hostedEvents.next(newEventsArray);
  }

  public makeFirstPicture(pictureOrdering, eventId: number) {
    if (pictureOrdering.length === 0) {
      return;
    }
    const firstPictureStorageName = pictureOrdering.find(picture => picture.order === 1).pictureStorageName;
    const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    const newFirstPictureIndex = newEventsArray[editedEventIndex].pictures_events
      .findIndex(picture => picture.pictureStorageName === firstPictureStorageName);
    newEventsArray[editedEventIndex].pictures_events
      .splice(0, 0, newEventsArray[editedEventIndex].pictures_events
        .splice(newFirstPictureIndex, 1)[0]);
    this._hostedEvents.next(newEventsArray);
    this.apiService.makeFirstPicture(pictureOrdering, eventId).subscribe(res => {
      newEventsArray[editedEventIndex].pictures_events = res;
      this._hostedEvents.next(newEventsArray);
    });
  }

  public updateHostedEvent(newEvent: Event) {
    this.apiService.updateHostedEvent(newEvent).subscribe(res => {
      const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === newEvent.id);
      const newEventsArray = this._hostedEvents.value;
      newEventsArray[editedEventIndex] = res;
      this._hostedEvents.next(newEventsArray);
    });
  }

  public fetchNewSwipeEvents() {
    this._swipeEventsLoaded.next(false);
    this.apiService.getSwipeEvents(this._myId).subscribe(res => {
      this._swipeEvents.next(this._swipeEvents.value.concat(res));
      this._swipeEventsLoaded.next(true);
    });
  }

  public swipeAnEvent() {
    this._swipeEvents.next(this._swipeEvents.value.slice(1));
    // TODO: don't forget to do the swipe event backend call
  }

  public fetchInitialSwipeEvents() {
    this._swipeEventsLoaded.next(false);
    this.apiService.getFirstSwipeEvents(this._myId).subscribe(res => {
      this._swipeEvents.next(res);
      this._swipeEventsLoaded.next(true);
    });
  }

  get eventCounter(): number {
    return this._eventCounter;
  }

  increaseEventCounter() {
    this._eventCounter++;
  }

  resetEventCounter() {
    this._eventCounter = 0;
  }
}
