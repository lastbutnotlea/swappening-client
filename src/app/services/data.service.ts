import {Injectable, OnInit} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../shared/event-model";
import {map} from "rxjs/operators";
import {ChatService} from "./chat.service";
import {User} from "../shared/user-model";
import {environment} from "../../environments/environment";
import {Chat} from "../shared/chat-model";


@Injectable({
  providedIn: "root"
})
export class DataService implements OnInit {

  // ################# EVENTS ####################

  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _swipeEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _acceptedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _swipeEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _eventCounter = 0;
  private _allTags: BehaviorSubject<String[]> = new BehaviorSubject([]);
  private _currentlySelectedTags: BehaviorSubject<String[]> = new BehaviorSubject([]);

  // ################# USERS ####################

  private _me: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _myId: string;
  private _interestedUsers: BehaviorSubject<Map<number, User[]>> = new BehaviorSubject<Map<number, User[]>>(new Map);
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  // ################# INITIALISATION ####################

  constructor(private apiService: ApiService, private chatService: ChatService) {
    if (environment.autoLogin) this.apiService.login("test1234@beispiel.de", "password123").then(
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
      this.apiService.getHostedEvents(this._myId).subscribe(myHostedEvents => {
        this._hostedEvents.next(myHostedEvents);
        const myMap = new Map();
        const hostedEvents: Event[] = this._hostedEvents.value;
        hostedEvents.forEach(hostedEvent => {
          this.apiService.getInterestedUsers(hostedEvent.id).subscribe(userRes => {
            myMap.set(hostedEvent.id, userRes);
            this._interestedUsers.next(myMap);
          });
        });
      });
      this.apiService.getLikedEvents(this._myId).subscribe(likedEvents => {
        this._likedEvents.next(likedEvents);
        this._likedEventsLoaded.next(true);
      });
      this.apiService.getAcceptedEvents(this._myId).subscribe(acceptedEvents => {
        this._acceptedEvents.next(acceptedEvents);
      });
      this.apiService.getFirstSwipeEvents(this._myId, []).subscribe(firstSwipeEvents => {
        this._swipeEvents.next(firstSwipeEvents);
        this._swipeEventsLoaded.next(true);
      });
      this.apiService.getAllTags().subscribe(tags => {
        this._allTags.next(tags.map(tag => tag.tagName));
      });
      this.chatService.initChatAfterLogin(this._myId);
    });
  }

  ngOnInit() {
  }

  // ################# GETTER EVENTS ####################

  get hostedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._hostedEvents.subscribe(fn));
  }

  hostedEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._hostedEvents.subscribe(fn)).pipe(map((hostedEvents: Event[]) => hostedEvents.find(event => event.id === id)));
  }

  get likedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._likedEvents.subscribe(fn));
  }

  likedEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._likedEvents.subscribe(fn)).pipe(map((likedEvents: Event[]) => likedEvents.find(event => event.id === id)));
  }

  get likedEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._likedEventsLoaded.subscribe(fn));
  }

  get acceptedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._acceptedEvents.subscribe(fn));
  }

  get swipeEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._swipeEvents.subscribe(fn));
  }

  swipeEvent(id: number): Observable<Event> {
    return new Observable<Event[]>(fn =>
      this._swipeEvents.subscribe(fn)).pipe(map((swipeEvents: Event[]) => swipeEvents.find(event => event.id === id)));
  }

  get swipeEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._swipeEventsLoaded.subscribe(fn));
  }

  get eventCounter(): number {
    return this._eventCounter;
  }

  get allTags(): Observable<string[]> {
    return new Observable<string[]>(fn => this._allTags.subscribe(fn));
  }

  get currentlySelectedTags(): Observable<string[]> {
    return new Observable<string[]>(fn => this._currentlySelectedTags.subscribe(fn));
  }

  // ################# GETTER USERS ####################

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

  user(userId: number): Observable<User> {
    this.apiService.getUserDetails(userId).subscribe(res => {
      this._currentUser.next(res);
    });
    return new Observable<User>(fn => this._currentUser.subscribe(fn));
  }

  // ################# MANIPULATE EVENTS ####################

  refreshLikedEvents() {
    this._likedEventsLoaded.next(false);
    if (this._myId && this._myId !== '') {
      this.apiService.getLikedEvents(this._myId).subscribe(likedEvents => {
        this._likedEvents.next(likedEvents);
        this._likedEventsLoaded.next(true);
      });
    }
  }

  refreshAcceptedEvents() {
    if (this._myId && this._myId !== '') {
      this.apiService.getAcceptedEvents(this._myId).subscribe(acceptedEvents => {
        this._acceptedEvents.next(acceptedEvents);
      });
    }
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
    const deletedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    newEventsArray.splice(deletedEventIndex, 1);
    this._hostedEvents.next(newEventsArray);
  }

  public updateHostedEvent(newEvent: Event) {
    this.apiService.updateHostedEvent(newEvent).subscribe(res => {
      const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === newEvent.id);
      const newEventsArray = this._hostedEvents.value;
      newEventsArray[editedEventIndex] = res;
      this._hostedEvents.next(newEventsArray);
    });
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

  public fetchNewSwipeEvents(tags: string[]) {
    this._swipeEventsLoaded.next(false);
    this._currentlySelectedTags.next(tags);
    this.apiService.getSwipeEvents(this._myId, tags).subscribe(res => {
      this._swipeEvents.next(this._swipeEvents.value.concat(res));
      this._swipeEventsLoaded.next(true);
    });
  }

  public swipeAnEvent(swipeDirection: string) {
    switch (swipeDirection) {
      case "left":
        this.apiService.swipeAnEvent(true, this._swipeEvents.value[0].id).subscribe(() => undefined);
        break;
      case "right":
        this.apiService.swipeAnEvent(false, this._swipeEvents.value[0].id).subscribe(() => undefined);
        if (this._swipeEvents.value[0].isPrivate) {
          this.chatService.addNewChat(this._swipeEvents.value[0].id, +this._myId).subscribe(() => undefined)
        }
        break;
    }
    this._swipeEvents.next(this._swipeEvents.value.slice(1));
  }

  public fetchInitialSwipeEvents(tags: string[]) {
    this._swipeEventsLoaded.next(false);
    this._currentlySelectedTags.next(tags);
    this.apiService.getFirstSwipeEvents(this._myId, tags).subscribe(res => {
      this._swipeEvents.next(res);
      this._swipeEventsLoaded.next(true);
    });
  }

  increaseEventCounter() {
    this._eventCounter++;
  }

  resetEventCounter() {
    this._eventCounter = 0;
  }

  // ################# MANIPULATE USERS ####################

  public updateUserDetails(updatedUser: User, selectedFile: File) {
    this.apiService.updateUserDetails(updatedUser, selectedFile).subscribe(res => {
      this._me.next(res);
    });
  }

  public swipeUser(isLeft: boolean, userId: number, eventId: number) {
    this.apiService.swipeUser(isLeft, userId, eventId).subscribe(() => undefined);
  }

  // ################# CHAT ####################

  // Object = {chat: someChat, event: relatedEvent}
  public getChatsOfLikedEventsWithEvent(): Observable<Object[]> {
    return this.chatService.getChatsOfLikedEventsWithEvent(this._likedEvents);
  }

  // object = {chat: someChat, event: theEventConnectToTheChat partnerUser: thePartnerChatUser}
  public getChatOfMyEventsWithPartnerUserAndEvent(): Observable<Object[]> {
    return this.chatService.getChatOfMyEventsWithPartnerUserAndEvent(this._hostedEvents);
  }
}
