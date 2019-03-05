import {AfterViewChecked, Component, OnInit, ViewChild} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatService} from "../../services/chat.service";
import {Observable} from "rxjs/Rx";
import {Chat} from "../../shared/chat-model";
import {DataService} from "../../services/data.service";
import {User} from "../../shared/user-model";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild("chatcontainer") chatContainer;

  chat$: Observable<Chat>;
  me$: Observable<User>;
  partnerUser$: Observable<User>;
  chatId: number;
  partnerUserId: number;
  isEventOwner: boolean;
  messageToSend;
  apiUrl: string = "";
  scrollToBottom = false;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private dataService: DataService) {
    this.chatId = +this.route.snapshot.paramMap.get("chatId");
    this.me$ = this.dataService.me;
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.chat$ = this.chatService.chat(this.chatId);
    this.chat$.subscribe((chat) => {
      if (!chat) return;
      this.isEventOwner = chat.ownerId === +this.dataService.myId;
      this.partnerUserId = this.isEventOwner ? chat.userId : chat.ownerId;
      this.partnerUser$ = this.chatService.partnerUser(this.partnerUserId);
      this.scrollToBottom = true;
    });
    console.log(", chatId = " + this.chatId + ", isEventOwner = " + this.isEventOwner);
  }

  ngAfterViewChecked() {
    if (this.scrollToBottom) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      this.scrollToBottom = false;
    }
  }

  sendMessage() {
    this.chatService.addMessageToChat(this.chatId, this.partnerUserId, this.isEventOwner, this.messageToSend, new Date());
    this.messageToSend = "";
  }

  chatDirection1 = isSelf => isSelf ? "chatMsgRight" : "chatMsgLeft";
  chatDirection2 = isSelf => isSelf ? "bubble-right" : "bubble-left";
}
