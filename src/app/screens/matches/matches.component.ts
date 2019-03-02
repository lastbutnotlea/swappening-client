import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../../shared/user-model";
import {DataService} from "../../services/data.service";

@Component({
  selector: "app-matches",
  templateUrl: "./matches.component.html",
  styleUrls: ["./matches.component.scss"]
})
export class MatchesComponent implements OnInit {
  chats = [{userId: 5, isUser: true}, {userId: 1, isUser: false}];

  private eventId: number = 15;

  private interestedUsersMap$: Observable<Map<number, User[]>>;
  private interestedUsers$: Observable<User[]>; // = this.interestedUsersMap$.pipe(map(userMap => userMap[this.eventId]));
  private chats$: Observable<User[]>;


  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.interestedUsersMap$ = this.dataService.interestedUsers;
    this.interestedUsersMap$.subscribe(whatever => console.log(whatever));
    this.interestedUsers$ = this.interestedUsersMap$.pipe(map(userMap => {
      return userMap.get(this.eventId);
    }));
    this.interestedUsers$.subscribe(data => console.log(data));
  }

}
