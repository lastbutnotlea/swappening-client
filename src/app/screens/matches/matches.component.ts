import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {User} from "../../shared/user-model";
import {Event} from "../../shared/event-model";
import {environment} from "../../../environments/environment";
import {DataService} from "../../services/data.service";
import {Chat} from "../../shared/chat-model";
import {Router} from "@angular/router";

@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"]
})
export class MatchesComponent implements OnInit {
  private myChats$: Observable<Chat[]>;
  private idToUser$: Observable<Map<number, User>>;
  private idToEvent$: Observable<Map<number, Event>>;
  private isInterestedUserAcceptedToEventMap$:  Observable<Map<any, boolean>>;

  apiUrl: string;

  constructor(private dataService: DataService,
              private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.dataService.refreshLikedEvents();
    this.dataService.refreshChats();
    this.dataService.refreshAcceptedEvents();
    this.myChats$ = this.dataService.myChats;
    this.idToUser$ = this.dataService.idToUser;
    this.idToEvent$ = this.dataService.idToEvent;
    this.isInterestedUserAcceptedToEventMap$ = this.dataService.isInterestedUserAcceptedToEventMap;
  }

  goToChat(chatId: number) {
    this.router.navigate(["/chat/" + chatId]);
  }

  redirect = (chat: Chat) => chat.isMeOwner ? `/userprofile/${chat.userId}/${chat.eventId}` : `/likedevents/fromChat/${chat.eventId}`;
}
