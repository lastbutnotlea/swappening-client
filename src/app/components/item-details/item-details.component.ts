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

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.myItem$ = this.dataService.myItem(this.itemId);
  }

}
