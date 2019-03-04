import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../../shared/user-model";
import {Event} from "../../shared/event-model";
import {environment} from "../../../environments/environment";
import {DataService} from "../../services/data.service";
import {Chat} from "../../shared/chat-model";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"]
})
export class MatchesComponent implements OnInit {
  private interestedUsersMap$: Observable<Map<number, User[]>>;
  private interestedUsers$: Observable<User[]>; // = this.interestedUsersMap$.pipe(map(userMap => userMap[this.eventId]));
  private chatsOfMyEvents$: Observable<Object[]>; // object = {chat, partnerUser}
  private chatsOfLikedEvents$: Observable<Object[]>; // object = {chat, event}

  apiUrl: string;

  constructor(private dataService: DataService,
              private chatService: ChatService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.chatsOfMyEvents$ = this.chatService.getChatOfMyEventsWithPartnerUser();
    this.chatsOfLikedEvents$ = this.dataService.getLikedEventsChatsOfLikedEvents();

    /*this.interestedUsersMap$ = this.dataService.interestedUsers;
    this.interestedUsersMap$.subscribe(whatever => console.log(whatever));
    this.interestedUsers$ = this.interestedUsersMap$.pipe(map(userMap => {
      return userMap.get(this.eventId);
    }));
    this.interestedUsers$.subscribe(data => console.log(data));*/
  }

}
