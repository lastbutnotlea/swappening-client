import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../shared/item-model';
import {Event} from '../../shared/event-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  private itemId: number;
  private myItem$: Observable<Item>;
  private eventId: number;
  private event$: Observable<Event>;

  private apiUrl: string;
  private clickCounter = 0;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.itemId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.myItem$ = this.dataService.myItem(this.itemId);
    this.event$ = this.dataService.event(this.eventId);
  }

  cycleThroughPictures() {
    this.clickCounter++;
  }
}
