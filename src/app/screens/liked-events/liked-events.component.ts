import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Event} from "../../shared/event-model";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-liked-events',
  templateUrl: './liked-events.component.html',
  styleUrls: ['./liked-events.component.css']
})
export class LikedEventsComponent implements OnInit {

  likedEvents$: Observable<Event[]>
  acceptedEvents$: Observable<Event[]>

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.likedEvents$ = this.dataService.likedEvents;
    this.acceptedEvents$ = this.dataService.acceptedEvents;
  }

}
