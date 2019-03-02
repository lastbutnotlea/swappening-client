import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {Observable} from "rxjs/Rx";
import {Chat} from "../../shared/chat-model";
import {DataService} from "../../services/data.service";
import {User} from "../../shared/user-model";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  chat$: Observable<Chat>;
  me: Observable<User>;
  partnerUserId: number;
  ownerName;
  notOwnerName;
  chatId: number;
  isEventOwner;
  // chatMessages = [];
  messageToSend;
  chatSocket;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private dataService: DataService) {
    this.chatId = +this.route.snapshot.paramMap.get("chatId");
    this.me = this.dataService.me;
    this.partnerUserId = +this.route.snapshot.paramMap.get("partnerUserId");
    this.isEventOwner = this.route.snapshot.paramMap.get("isEventOwner");
    const myName = this.apiService.getMyDetails().subscribe( me => me.nickname);
    const userName = this.apiService.getUserDetails(this.partnerUserId).subscribe( user => user.nickname);
    this.ownerName = this.isEventOwner ? myName : userName;
    this.notOwnerName = !(this.isEventOwner) ? userName : myName;
    console.log("partnerUserId = " + this.partnerUserId + ", chatId = " + this.chatId + ", isEventOwner = " + this.isEventOwner);
    // chatService.chats.subscribe(chats => {
    //   const myChat = chats.find(chat => chat.id === +this.chatId);
    //   if ( myChat !== undefined) {
    //     this.chatMessages = myChat.messages;
    //   }
    // });
    this.chatSocket = chatService.getChatSocket();
  }

  ngOnInit() {
    this.chat$ = this.chatService.chat(this.chatId);
    this.chat$.subscribe(chat => console.log(chat));
  }

  sendMessage() {
    this.chatSocket.emit("message", 1, this.partnerUserId, this.isEventOwner, this.messageToSend);
    this.chatService.addMessageToChat(1, this.isEventOwner, this.messageToSend, new Date());
    console.log("pressed send");
    this.messageToSend = "";
  }

}
