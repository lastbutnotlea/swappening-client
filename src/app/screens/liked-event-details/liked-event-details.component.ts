import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../../shared/event-model';
import {User} from '../../shared/user-model';
import {ApiService} from "../../services/api.service";
import {DataService} from '../../services/data.service';
import {ChatService} from '../../services/chat.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-liked-event-details',
  templateUrl: './liked-event-details.component.html',
  styleUrls: ['./liked-event-details.component.css']
})
export class LikedEventDetailsComponent implements OnInit {

  private eventId: number;
  private event$: Observable<Event>;
  private chatId: number;

  private apiUrl: string;

  constructor(private dataService: DataService,
              private apiService: ApiService,
              private chatService: ChatService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.event$ = this.dataService.likedEvent(this.eventId);
  }

  startChat() {
    this.chatService.addNewChat(this.eventId, +this.dataService.myId).subscribe(res => {
      this.chatId = res.id;
      this.router.navigate(["/chat/" + this.chatId])
    } );
  }

}
