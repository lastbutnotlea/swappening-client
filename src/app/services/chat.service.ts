import * as io from "socket.io-client";
import {Message} from "../shared/messages-model";
import {Chat} from "../shared/chat-model";
import {Injectable, OnInit} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs/Rx";
import {ApiService} from "./api.service";
import {map} from "rxjs/operators";
import {Event} from "../shared/event-model";
import {User} from "../shared/user-model";
import {DataService} from "./data.service";


@Injectable({
  providedIn: "root"
})
export class ChatService implements OnInit {
  private _myId: string;
  private _chatSocket;
  private _chatsOfMyEvents: BehaviorSubject<Chat[]> = new BehaviorSubject([]);
  private _chatsOfLikedEvents: BehaviorSubject<Chat[]> = new BehaviorSubject([]);
  private _idToUsers: BehaviorSubject<Map<number, User>> = new BehaviorSubject<Map<number, User>>(new Map);

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  public initChatAfterLogin(myId: string) {
    this._myId = myId;
    this.apiService.getAllChats().subscribe(chats => {
        chats.forEach((chat) => {
          const isMyEvent: boolean = +this._myId === chat.userId;
          if (isMyEvent) {
            this._chatsOfMyEvents.next(this._chatsOfMyEvents.value.concat([chat]));
          } else {
            this._chatsOfLikedEvents.next(this._chatsOfLikedEvents.value.concat([chat]));
          }

          this.apiService.getMessageOfChat(chat.id).subscribe(messageRes => {
            chat.messages = messageRes;
          });

          const otherUserId = isMyEvent ? chat.ownerId : chat.userId;
          this.apiService.getUserDetails(otherUserId).subscribe(res => {
            this._idToUsers.next(this._idToUsers.value.set(otherUserId, res));
          });
        });
      }
    );
    this.socketConnect();
  }

  public addMessageToChat(chatId: number, isMessageOfOwner: boolean, message: string, date: Date) {
    const foundChat = this.findRightChat(chatId);
    if (foundChat) {
      foundChat.messages.push({isMessageOfOwner, message: message, createdAt: date});
      console.log("added following message ->" + message + "<- to own chat");
    }
  }

  public addNewChat(eventId: number, userId: number): Observable<any> {
    return new Observable<Chat>(fn =>
      this.apiService.createChat(eventId, userId).subscribe(fn)).pipe(map((chat: Chat) => {
      if (!chat) {
        return;
      } else {
        const existingChat = this.findRightChat(chat.id);
        if (existingChat) {
          return existingChat;
        } else {
          const isMyEvent: boolean = +this._myId === chat.userId;
          if (isMyEvent) {
            this._chatsOfMyEvents.next(this._chatsOfMyEvents.value.concat([chat]));
          } else {
            this._chatsOfLikedEvents.next(this._chatsOfLikedEvents.value.concat([chat]));
          }

          const otherUserId = isMyEvent ? chat.ownerId : chat.userId;
          this.apiService.getUserDetails(otherUserId).subscribe(res => {
            this._idToUsers.next(this._idToUsers.value.set(otherUserId, res));
          });
          return chat;
        }
      }
    }));
  }

  private socketConnect() {
    this._chatSocket = io.connect("http://vmkemper14.informatik.tu-muenchen.de:8085");
    this._chatSocket.on("connect", () => {
      console.log("connected");
      this._chatSocket.emit("userAuth", this.apiService.getToken());
      this._chatSocket.on("message", (chatId: number, isMessageOfOwner: boolean, message: string) => {
        const foundChat = this.findRightChat(chatId);
        if (foundChat) {
          foundChat.messages.push({isMessageOfOwner, message: message, createdAt: new Date()});
          console.log("added following message to chat");
        } else {

        }
        console.log(message);
      });
    });
  }

  public getChatSocket() {
    return this._chatSocket;
  }

  get chatsOfMyEvents(): Observable<Chat[]> {
    return new Observable<Chat[]>(fn => this._chatsOfMyEvents.subscribe(fn));
  }

  get chatsOfLikedEvents(): Observable<Chat[]> {
    return new Observable<Chat[]>(fn => this._chatsOfLikedEvents.subscribe(fn));
  }

  chat(chatId: number): Observable<Chat> {
    return new Observable<Chat[]>(fn =>
      this._chatsOfMyEvents.concat(this._chatsOfLikedEvents).subscribe(fn)).pipe(map((chats: Chat[]) => {
      if (!chats) {
        return;
      } else {
        return chats.find(chat => chat.id === +chatId);
      }
    }));
  }

  partnerUser(userId: number): Observable<any> {
    return new Observable<any>(fn =>
      this._idToUsers.subscribe(fn)).pipe(map((map: Map<number, User>) => {
      if (!map) {
        return;
      } else {
        return map.get(userId);
      }
    }));
  }

  public filterLikedEventsByChatsOfLikedEvents(likedEvents: BehaviorSubject<Event[]>): Observable<Event[]> {
    return new Observable<Event[]>(fn =>
      likedEvents.subscribe(fn)).pipe(map((likedEventsInPipe: Event[]) =>
      likedEventsInPipe.filter( event => this._chatsOfLikedEvents.value.find( chat => chat.eventId === event.id))
    ));
  }

  private findRightChat(chatId: number): (Chat | undefined) {
    const foundChat = this._chatsOfMyEvents.value.find(chat => chat.id === chatId);
    if (foundChat) {
      return foundChat;
    } else {
      return this._chatsOfLikedEvents.value.find(chat => chat.id === chatId);
    }
  }

  private updateAllChat() {
    // ToDo: update all chats
  }
}
