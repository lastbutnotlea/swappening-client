import {Injectable, OnInit} from "@angular/core";
import {ApiService} from "./api.service";
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {Item} from "../shared/item-model";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  private _myItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItemsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _myItemsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {
    this.apiService.login().then(() => {
        this.apiService.getFirstSwipeItems('1213').subscribe(res => {
          this._swipeItems.next(res);
          this._swipeItemsLoaded.next(true);
        });
        this.apiService.getAllUserItems('1213').subscribe(res => {
          this._myItems.next(res);
          this._myItemsLoaded.next(true);
        });
      }
    )
  }

ngOnInit() {
  }

  get swipeItemsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._swipeItemsLoaded.subscribe(fn));
  }

  get myItemsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._myItemsLoaded.subscribe(fn));
  }

  get myItems(): Observable<Item[]> {
    return new Observable<Item[]>(fn => this._myItems.subscribe(fn));
  }

  myItem(id: number): Observable<Item> {
    return new Observable<Item[]>(fn => this._myItems.subscribe(fn)).pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.id === id)));
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
