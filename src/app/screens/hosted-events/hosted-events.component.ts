import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";
import {Event} from "../../shared/event-model";
import {DataService} from "../../services/data.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-hosted-events',
  templateUrl: './hosted-events.component.html',
  styleUrls: ['./hosted-events.component.scss']
})
export class HostedEventsComponent implements OnInit {

  myItems$: Observable<Item[]>;
  hostedEvents$: Observable<Event[]>;


  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.myItems$ = this.dataService.myItems;
    this.hostedEvents$ = this.dataService.hostedEvents;
  }

}
