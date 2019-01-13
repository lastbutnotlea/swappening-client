import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-liked-events',
  templateUrl: './liked-events.component.html',
  styleUrls: ['./liked-events.component.css']
})
export class LikedEventsComponent implements OnInit {

  myItems$: Observable<Item[]>;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.myItems$ = this.dataService.myItems;
  }

}
