import {Component, Input, OnInit} from '@angular/core';
import {Item} from "../../shared/item-model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  @Input()
  myItems$: Observable<Item[]>;
  @Input()
  routingLink: string;
  apiUrl: string;

  constructor() {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
  }

}
