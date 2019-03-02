import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../../shared/event-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-liked-event-details',
  templateUrl: './liked-event-details.component.html',
  styleUrls: ['./liked-event-details.component.css']
})
export class LikedEventDetailsComponent implements OnInit {

  private eventId: number;
  private event$: Observable<Event>;

  private apiUrl: string;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.event$ = this.dataService.likedEvent(this.eventId);
  }

}
