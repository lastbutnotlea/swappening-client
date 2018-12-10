import { Component, OnInit } from '@angular/core';
import {DataService} from "../../services/data.service";
import {Item} from "../../shared/item-model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {

  myItems$: Observable<Item[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.myItems$ = this.dataService.myItems;
  }

  testOnly_update() {
    this.dataService.updateMyItems();
  }

}
