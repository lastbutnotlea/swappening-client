import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Item} from "../shared/item-model";
import {User} from "../shared/user-model";
import {map} from "rxjs/operators";


@Injectable()
export class DataService {

  private _myItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);

  constructor(private apiService: ApiService) {
    this.apiService.getAllUserItems('1213').subscribe(res => this._myItems.next(res));
    this.apiService.getFirstSwipeItems('1213').subscribe(res => this._swipeItems.next(res));
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

  // TODO update data; does this work using observables the way i do right now?
  public fetchNewSwipeItems() {
    let newSwipeItems$: Observable<Item[]>;
    //this.swipeItems$.pipe(map(items => items.slice(10, 15)));
    //newSwipeItems$ = this.apiService.getSwipeItems(this.userId);
    // this.swipeItems$ = merge(this.swipeItems$, newSwipeItems$);
  }

  public updateMyItems() {
    this.apiService.testOnly_get3Items().subscribe(res => this._myItems.next(this._myItems.value.concat(res)));
  }
}
