import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Event} from "../../shared/event-model";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-hosted-events',
  templateUrl: './hosted-events.component.html',
  styleUrls: ['./hosted-events.component.scss']
})
export class HostedEventsComponent implements OnInit {

  hostedEvents$: Observable<Event[]>;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.hostedEvents$ = this.dataService.hostedEvents;
  }

}
