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
  me$: Observable<User>;
  partnerUser$: Observable<User>;
  chatId: number;
  partnerUserId: number;
  isEventOwner: boolean;
  messageToSend;
  chatSocket;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private dataService: DataService) {
    this.chatId = +this.route.snapshot.paramMap.get("chatId");
    this.me$ = this.dataService.me;
    this.chatSocket = chatService.getChatSocket();
  }

  ngOnInit() {
    this.chat$ = this.chatService.chat(this.chatId);
    this.chat$.subscribe( (chat) => {
      this.isEventOwner = chat.ownerId === +this.dataService.myId;
      this.partnerUserId = this.isEventOwner ? chat.userId : chat.ownerId;
      this.partnerUser$ = this.chatService.partnerUser(this.partnerUserId);
    });
    console.log(", chatId = " + this.chatId + ", isEventOwner = " + this.isEventOwner);
  }

  sendMessage() {
    this.chatSocket.emit("message", this.chatId, this.partnerUserId, this.isEventOwner, this.messageToSend);
    this.chatService.addMessageToChat(this.chatId, this.isEventOwner, this.messageToSend, new Date());
    console.log("pressed send");
    this.messageToSend = "";
  }

}
