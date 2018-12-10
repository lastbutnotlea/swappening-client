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

  get myItems() {
    return this.asObservable(this._myItems);
  }

  myItem(itemId: string) {
    return this.asObservable(this._myItems).pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.itemId === itemId)));
  }

  get swipeItems() {
    return this.asObservable(this._swipeItems);
  }

  asObservable(subject: Subject) {
    return new Observable(fn => subject.subscribe(fn));
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
