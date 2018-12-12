import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-item-details',
  templateUrl: './edit-item-details.component.html',
  styleUrls: ['./edit-item-details.component.css']
})
export class EditItemDetailsComponent implements OnInit {

  private myItem$: Observable<Item>;
  myItemModel: Item;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    let current_id: string = this.route.snapshot.paramMap.get('id');
    if(current_id != 'new'){
      this.myItem$ = this.dataService.myItem(current_id);
      this.myItem$.subscribe(newItem => this.myItemModel = newItem);
    }
  }

}
