import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../shared/item-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  private itemId: number;
  private myItem$: Observable<Item>;
  private myItems$: Observable<Item[]>;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.myItem$ = this.dataService.myItem(this.itemId);
  }

}
