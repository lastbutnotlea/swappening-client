import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Item, SINGLE_FAKE_ITEM} from '../../shared/item-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  private itemId: number;
  private myItem$: Observable<Item>;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.myItem$ = this.dataService.myItem(this.itemId);
  }

}
