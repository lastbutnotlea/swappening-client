import {Injectable, OnInit} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Event} from "../shared/event-model";
import {map} from "rxjs/operators";
import {User} from "../shared/user-model";
import {environment} from "../../environments/environment";
import {Chat} from "../shared/chat-model";
import * as io from "socket.io-client";


@Injectable({
  providedIn: "root"
})
export class DataService implements OnInit {

  // ################# EVENTS ####################

  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _idToEvent: BehaviorSubject<Map<number, Event>> = new BehaviorSubject(new Map);
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
  private _idToUser: BehaviorSubject<Map<number, User>> = new BehaviorSubject<Map<number, User>>(new Map);
  private _interestedUsers: BehaviorSubject<Map<number, User[]>> = new BehaviorSubject<Map<number, User[]>>(new Map);

  // ################# CHAT ####################

  private _chatSocket;
  private _myChats: BehaviorSubject<Chat[]> = new BehaviorSubject([]);
  private _doneFetchingChatData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // ################# INITIALISATION ####################

  constructor(private apiService: ApiService) {
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
      this._idToUser.next(this._idToUser.value.set(res.id, res));
      this._me.next(res);
      this._myId = this._me.value.id.toString();
      this.apiService.getHostedEvents(this._myId).subscribe(myHostedEvents => {
        this._hostedEvents.next(myHostedEvents);
        const newInterestedUsers = new Map();
        const newIdToEvent = new Map();
        const hostedEvents = this._hostedEvents.value;

        hostedEvents.forEach((hostedEvent, index) => {
          newIdToEvent.set(hostedEvent.id, hostedEvent);
          if (index === hostedEvents.length - 1) {
            this.apiService.getLikedEvents(this._myId).subscribe(likedEvents => {
              this._likedEvents.next(likedEvents);
              likedEvents.forEach(likedEvent => newIdToEvent.set(likedEvent.id, likedEvent));
              this._idToEvent.next(newIdToEvent);
              this._likedEventsLoaded.next(true);
            });
          }
          this.apiService.getInterestedUsers(hostedEvent.id).subscribe(userRes => {
            newInterestedUsers.set(hostedEvent.id, userRes);
            if (index === hostedEvents.length - 1) this._interestedUsers.next(newInterestedUsers);
          });
        });
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
      this.fetchChatData();
      this.socketConnect();
    });
  }

  fetchChatData() {
    this._doneFetchingChatData.next(false);
    let newMyChats = [];
    let newIdToUsers = this._idToUser.value;
    this.apiService.getAllChats().subscribe(chats => {
        chats.forEach((chat, index) => {
          const isMeOwner = +this._myId === chat.ownerId;
          this.apiService.getMessageOfChat(chat.id).subscribe(res => {
            newMyChats.push({
              ...chat,
              messages: res,
              isMeOwner: isMeOwner
            });
            if (index === chats.length - 1) {
              this._myChats.next(newMyChats);
              this._doneFetchingChatData.next(true);
            }
          });
          const chatPartnerId = isMeOwner ? chat.userId : chat.ownerId;
          this.apiService.getUserDetails(chatPartnerId).subscribe(res => {
            newIdToUsers.set(chatPartnerId, res);
            if (index === chats.length - 1) this._idToUser.next(newIdToUsers);
          })
        });
      }
    );
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

  get idToEvent(): Observable<Map<number, Event>> {
    return new Observable<Map<number, Event>>(fn => this._idToEvent.subscribe(fn));
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

  get me(): Observable<User> {
    return new Observable<User>(fn => this._me.subscribe(fn));
  }

  get myId(): string {
    return this._myId;
  }

  get idToUser(): Observable<Map<number, User>> {
    return new Observable<Map<number, User>>(fn => this._idToUser.subscribe(fn));
  }

  user(userId: number): Observable<any> {
    return new Observable<any>(fn => this._idToUser.subscribe(fn)).pipe(
      map(users => (!users) ? undefined : users.get(userId)));
  }

  chatPartner(chatId: number): Observable<any> {
    const chats = this._myChats.value;
    const foundChat = chats.find(chat => chat.id === chatId);
    if (foundChat) {
      return new Observable<any>(fn => this._idToUser.subscribe(fn)).pipe(
        map(users => users.get(foundChat.isMeOwner ? foundChat.userId : foundChat.ownerId)));
    }
  }

  // ################# GETTER CHATS ####################

  get myChats(): Observable<Chat[]> {
    return new Observable<Chat[]>(fn => this._myChats.subscribe(fn));
  }

  chat(chatId: number): Observable<any> {
    return new Observable<any>(fn => this._myChats.subscribe(fn)).pipe(
      map(chats => chats.find(chat => chat.id === +chatId)));
  }

  // TODO not sure about this
  get doneFetchingChatData(): Observable<boolean> {
    return new Observable<boolean>(fn => this._doneFetchingChatData.subscribe(fn));
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

  deleteHostedEvent(eventId: number) {
    this.apiService.deleteHostedEvent(eventId).subscribe();
    const deletedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    newEventsArray.splice(deletedEventIndex, 1);
    this._hostedEvents.next(newEventsArray);
  }

  updateHostedEvent(newEvent: Event) {
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

  deletePicture(pictureStorageName: string, eventId: number) {
    this.apiService.deletePicture(pictureStorageName).subscribe();
    const editedEventIndex = this._hostedEvents.value.findIndex(event => event.id === eventId);
    const newEventsArray = this._hostedEvents.value;
    newEventsArray[editedEventIndex].pictures_events = newEventsArray[editedEventIndex].pictures_events.filter(
      pic => pic.pictureStorageName !== pictureStorageName
    );
    this._hostedEvents.next(newEventsArray);
  }

  makeFirstPicture(pictureOrdering, eventId: number) {
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

  fetchNewSwipeEvents(tags: string[]) {
    this._swipeEventsLoaded.next(false);
    this._currentlySelectedTags.next(tags);
    this.apiService.getSwipeEvents(this._myId, tags).subscribe(res => {
      this._swipeEvents.next(this._swipeEvents.value.concat(res));
      this._swipeEventsLoaded.next(true);
    });
  }

  swipeAnEvent(swipeDirection: string) {
    switch (swipeDirection) {
      case "left":
        this.apiService.swipeAnEvent(true, this._swipeEvents.value[0].id).subscribe(() => undefined);
        break;
      case "right":
        this.apiService.swipeAnEvent(false, this._swipeEvents.value[0].id).subscribe(() => undefined);
        if (this._swipeEvents.value[0].isPrivate) {
          this.addNewChat(this._swipeEvents.value[0].id, +this._myId).then(() => undefined)
        }
        break;
    }
    this._swipeEvents.next(this._swipeEvents.value.slice(1));
  }

  fetchInitialSwipeEvents(tags: string[]) {
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

  updateUserDetails(updatedUser: User, selectedFile: File) {
    this.apiService.updateUserDetails(updatedUser, selectedFile).subscribe(res => {
      this._me.next(res);
    });
  }

  verifyUser(accepted: boolean, userId: number, eventId: number) {
    this.apiService.verifyUser(accepted, userId, eventId).subscribe(() => undefined);
    if (!accepted) this.deleteChat(eventId, userId);
  }

  // ################# MANIPULATE CHATS ####################

  private socketConnect() {
    this._chatSocket = io.connect("http://vmkemper14.informatik.tu-muenchen.de:8085");
    this._chatSocket.on("connect", () => {
      console.log("connected");
      this._chatSocket.emit("userAuth", this.apiService.getToken());
      this._chatSocket.on("message", (chatId: number, isMessageOfOwner: boolean, message: string) => {
        const foundChat = this._myChats.value.find(chat => chat.id === chatId);
        if (foundChat) {
          foundChat.messages.push({isMessageOfOwner, message: message, createdAt: new Date()});
          console.log("added following message to chat");
        }
        console.log(message);
      });
    });
  }

  // TODO not sure about this
  refreshChats() {
    if (this._myId && this._myId !== '') {
      this.fetchChatData();
    }
  }

  addMessageToChat(chatId: number, partnerUserId: number, isMessageOfOwner: boolean, message: string, date: Date) {
    this._chatSocket.emit("message", chatId, partnerUserId, isMessageOfOwner, message);

    const foundChatIndex = this._myChats.value.findIndex(chat => chat.id === chatId);
    const newMyChats = this._myChats.value;
    newMyChats[foundChatIndex].messages.push({
      isMessageOfOwner: isMessageOfOwner,
      message: message,
      createdAt: date
    });
    this._myChats.next(newMyChats);
  }

  addNewChat(eventId: number, userId: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.apiService.createChat(eventId, userId).subscribe((res: Chat[]) => {
        const newChat = res[0];

        const foundChatIndex = this._myChats.value.findIndex(chat => chat.id === newChat.id);
        if (foundChatIndex < 0) {
          const isMeOwner = +this._myId === newChat.ownerId;
          this._myChats.next(this._myChats.value.concat([{
            ...newChat,
            isMeOwner: isMeOwner
          }]));

          const chatPartnerId = isMeOwner ? newChat.userId : newChat.ownerId;
          this.apiService.getUserDetails(chatPartnerId).subscribe(res => {
            this._idToUser.next(this._idToUser.value.set(chatPartnerId, res));
          })
        }
        resolve(newChat.id);
      })
    });
  }

  deleteChat(eventId: number, userId: number) {
    const chatId = this._myChats.value.find(
      chat => chat.eventId === eventId && chat.userId === userId && chat.ownerId === +this._myId).id;
    if (chatId) this.apiService.deleteChat(chatId).subscribe(res => undefined);
  }

  /*  // Object = {chat: someChat, event: relatedEvent}
    public getChatsOfLikedEventsWithEvent(): Observable<Object[]> {
      return this.chatService.getChatsOfLikedEventsWithEvent(this._likedEvents);
    }

    // object = {chat: someChat, event: theEventConnectToTheChat partnerUser: thePartnerChatUser}
    public getChatOfMyEventsWithPartnerUserAndEvent(): Observable<Object[]> {
      return this.chatService.getChatOfMyEventsWithPartnerUserAndEvent(this._hostedEvents);
    }*/
}
