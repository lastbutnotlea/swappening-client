import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Event} from '../../shared/event-model';
import {User} from '../../shared/user-model';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss']
})
export class MatchesComponent implements OnInit {

  private interestedUsers$: Observable<User[]>;
  private chats$: Observable<User[]>;
  private eventId: number = 15;

  constructor(private dataService: DataService,) {
  }

  ngOnInit() {
    this.interestedUsers$ = this.dataService.interestedUsers;
    this.interestedUsers$.subscribe(data => console.log(data))
  }

}
