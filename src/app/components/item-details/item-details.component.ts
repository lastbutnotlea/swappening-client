import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  private itemId: string;
  private myItem$: Observable<Item>;
  private myItems$: Observable<Item[]>;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
/*    this.dataService.myDataReady.subscribe(ready => {
      if (ready) {
        this.myItem$ = this.dataService.myItem(this.itemId);
        // TODO unsubscribe
      }
    })*/
  this.myItems$ = this.dataService.myItems;
  this.myItem$ = this.myItems$.pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.id === this.itemId)));
  }

}
