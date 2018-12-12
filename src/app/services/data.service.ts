import {Injectable, OnInit} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Item} from "../shared/item-model";
import {map} from "rxjs/operators";


@Injectable()
export class DataService implements OnInit {

  private _myItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _dataReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {
    this.apiService.login().then(() => {
        console.log('#4# ready: ' + this._dataReady.value);
        this.apiService.getFirstSwipeItems('1213').subscribe(res => {
          this._swipeItems.next(res);
          this._dataReady.next(true);
        });
        // TODO
        // this.apiService.getAllUserItems('1213').subscribe(res => this._myItems.next(res));
      }
    )
  }

ngOnInit() {
  }

  get dataReady(): Observable<boolean> {
    return new Observable<boolean>(fn => this._dataReady.subscribe(fn));
  }

  get myItems(): Observable<Item[]> {
    return new Observable<Item[]>(fn => this._myItems.subscribe(fn));
  }

  myItem(itemId: string): Observable<Item> {
    return new Observable<Item[]>(fn => this._myItems.subscribe(fn)).pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.itemId === itemId)));
  }

  get swipeItems() {
    return new Observable<Item[]>(fn => this._swipeItems.subscribe(fn));
  }

  public fetchNewSwipeItems() {
    this.apiService.getSwipeItems("id").subscribe(res => this._swipeItems.next(this._swipeItems.value.slice(10, 15).concat(res)));

    //let newSwipeItems$: Observable<Item[]>;
    //this.swipeItems$.pipe(map(items => items.slice(10, 15)));
    //newSwipeItems$ = this.apiService.getSwipeItems(this.userId);
    // this.swipeItems$ = merge(this.swipeItems$, newSwipeItems$);
  }

  public test_fetchNewSwipeItem() {
    this.apiService.getSwipeItem().subscribe(res => this._swipeItems.next(this._swipeItems.value.slice(1, 15).concat(res)));
  }


  public testOnly_updateMyItems() {
    this.apiService.testOnly_get3Items().subscribe(res => this._myItems.next(this._myItems.value.concat(res)));
  }
}
