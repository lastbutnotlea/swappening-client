import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";
import {DataService} from "../../services/data.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-hosted-events',
  templateUrl: './hosted-events.component.html',
  styleUrls: ['./hosted-events.component.css']
})
export class HostedEventsComponent implements OnInit {

  myItems$: Observable<Item[]>;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.myItems$ = this.dataService.myItems;
  }

}
