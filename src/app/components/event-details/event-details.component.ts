import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../../shared/event-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from "../../../environments/environment";
import {DateDisplayService} from "../../services/date-display.service";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  private eventId: number;
  private event$: Observable<Event>;

  private apiUrl: string;
  private clickCounter = 0;

  constructor(private dataService: DataService,
              private dateDisplayService: DateDisplayService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.event$ = this.dataService.event(this.eventId);
  }

  cycleThroughPictures() {
    this.clickCounter++;
  }

  displayDate = date => this.dateDisplayService.parseDate(date);
}
