import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
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

  apiUrl: string;

  constructor(private dataService: DataService,
              private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    // TODO not sure about this
    this.dataService.refreshLikedEvents();
    this.dataService.likedEventsLoaded.subscribe(loaded => {
      if (loaded) {
        this.dataService.refreshChats();
        this.dataService.doneFetchingChatData.subscribe(done => {
          if (done) {
            this.myChats$ = this.dataService.myChats;
            this.myChats$.subscribe(res => console.log(res));
            this.idToUser$ = this.dataService.idToUser;
            this.idToUser$.subscribe(res => console.log(res));
            this.idToEvent$ = this.dataService.idToEvent;
            this.idToEvent$.subscribe(res => console.log(res));
          }
        })
      }
    });
  }

  goToChat(chatId: number) {
    this.router.navigate(["/chat/" + chatId]);
  }

  redirect = (chat: Chat) => chat.isMeOwner ? `/userprofile/${chat.userId}/${chat.eventId}` : `/likedevents/fromChat/${chat.eventId}`;
}
