import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Item} from "../../shared/item-model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {

  images = [1,2,3,4,5,6,7];
  private items$: Observable<Item[]>;
  private items: Item[];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getAllUserItems('000').subscribe(result => this.items = result);
    console.log('items: ');
    console.log(this.items);
    this.items$ = this.api.getAllUserItems('000');
    console.log('items observable: ');
    console.log(this.items$);
  }

}
