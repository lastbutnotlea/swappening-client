import {AfterViewChecked, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {Chat} from "../../shared/chat-model";
import {DataService} from "../../services/data.service";
import {User} from "../../shared/user-model";
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild("chatcontainer") chatContainer;

  chat$: Observable<Chat>;
  me$: Observable<User>;
  chatPartner$: Observable<User>;
  chatId: number;
  messageToSend;
  apiUrl: string = "";
  scrollToBottom = false;
  isMeChatOwner;
  partnerUserId;

  private chatSubscription: Subscription;

  constructor(private apiService: ApiService,
              private route: ActivatedRoute,
              private dataService: DataService) {
    this.chatId = +this.route.snapshot.paramMap.get("chatId");
    this.me$ = this.dataService.me;
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.chat$ = this.dataService.chat(this.chatId);
    this.chatPartner$ = this.dataService.chatPartner(this.chatId);
    this.chatSubscription = this.chat$.subscribe((chat) => {
      if (!chat) return;
      else {
        this.isMeChatOwner = chat.isMeOwner;
        this.partnerUserId = chat.isMeOwner ? chat.userId : chat.ownerId;
        this.scrollToBottom = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.scrollToBottom) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      this.scrollToBottom = false;
    }
  }

  sendMessage() {
    this.dataService.addMessageToChat(this.chatId, this.partnerUserId, this.isMeChatOwner, this.messageToSend, new Date());
    this.messageToSend = "";
  }

  chatDirection1 = isSelf => isSelf ? "chatMsgRight" : "chatMsgLeft";
  chatDirection2 = isSelf => isSelf ? "bubble-right" : "bubble-left";
}
