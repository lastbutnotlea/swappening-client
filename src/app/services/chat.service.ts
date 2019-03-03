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
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject([]);
  private _idToUsers: BehaviorSubject<Map<number, User>> = new BehaviorSubject<Map<number, User>>(new Map);

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
  }

  public initChatAfterLogin(myId: string) {
    this._myId = myId;
    this.apiService.getAllChats().subscribe(res => {
        this._chats.next(res); // This probably will not work
        this._chats.value.forEach((chat) => {
          this.apiService.getMessageOfChat(chat.id).subscribe(messageRes => {
            chat.messages = messageRes;
          });
          const otherUserId = +this._myId === chat.userId ? chat.ownerId : chat.userId;
          this.apiService.getUserDetails(otherUserId).subscribe(res => {
            this._idToUsers.next(this._idToUsers.value.set(otherUserId, res));
          });
        });
      }
    );
    this.socketConnect();
  }

  public addMessageToChat(chatId: number, isMessageOfOwner: boolean, message: string, date: Date) {
    const foundChat = this._chats.value.find(chat => chat.id === chatId);
    if (foundChat) {
      foundChat.messages.push({isMessageOfOwner, message: message, createdAt: date});
      console.log("added following message ->" + message + "<- to own chat");
    }
  }

  public addNewChat(eventId: number, userId: number): Observable<any> {
    return new Observable<Chat>( fn => this.apiService.createChat(eventId, userId).subscribe( chat => {
      this._chats.next(this._chats.value.concat([chat]));
      const otherUserId = +this._myId === chat.userId ? chat.ownerId : chat.userId;
      this.apiService.getUserDetails(otherUserId).subscribe(res => {
        this._idToUsers.next(this._idToUsers.value.set(otherUserId, res));
      });
      return chat;
    }));
  }

  private socketConnect() {
    this._chatSocket = io.connect("http://vmkemper14.informatik.tu-muenchen.de:8085");
    this._chatSocket.on("connect", () => {
      console.log("connected");
      this._chatSocket.emit("userAuth", this.apiService.getToken());
      this._chatSocket.on("message", (chatId: number, isMessageOfOwner: boolean, message: string) => {
        const foundChat = this._chats.value.find(chat => chat.id === chatId);
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

  get chats(): Observable<Chat[]> {
    return new Observable<Chat[]>(fn => this._chats.subscribe(fn));
  }

  chat(chatId: number): Observable<Chat> {
    return new Observable<Chat[]>(fn =>
      this._chats.subscribe(fn)).pipe(map((chats: Chat[]) => {
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

  private updateAllChat() {

  }
}
