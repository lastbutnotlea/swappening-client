import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Item} from '../../shared/item-model';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {

  myItems$: Observable<Item[]>;
  apiUrl: string;

  constructor(private dataService: DataService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.myItems$ = this.dataService.myItems;
  }

  testOnly_update() {
    this.dataService.testOnly_updateMyItems();
  }

}
