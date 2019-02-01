import {Injectable, OnInit} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Item} from '../shared/item-model';
import {Event} from '../shared/event-model'
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  // ITEMS
  private _myItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItems: BehaviorSubject<Item[]> = new BehaviorSubject([]);
  private _swipeItemsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _myItemsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //EVENTS
  private _hostedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _likedEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _swipeEvents: BehaviorSubject<Event[]> = new BehaviorSubject([]);
  private _hostedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _likedEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _swipeEventsLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  

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

        this.apiService.getHostedEvents('1213').subscribe(res => {
          this._hostedEvents.next(res);
          this._hostedEventsLoaded.next(true);
        });

      }
    );
  }

  ngOnInit() {
  }

  //EVENTS
  get hostedEvents(): Observable<Event[]> {
    return new Observable<Event[]>(fn => this._hostedEvents.subscribe(fn));
  }

  get hostedEventsLoaded(): Observable<boolean> {
    return new Observable<boolean>(fn => this._hostedEventsLoaded.subscribe(fn));
  }


  // ITEMS
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
    return new Observable<Item[]>(fn =>
      this._myItems.subscribe(fn)).pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.id === id)));
  }

  get swipeItems() {
    return new Observable<Item[]>(fn => this._swipeItems.subscribe(fn));
  }

  public fetchNewSwipeItems() {
    this.apiService.getSwipeItems('id').subscribe(res => this._swipeItems.next(this._swipeItems.value.slice(10, 15).concat(res)));
  }

  async createNewUserItem(newItem: Item) : Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let newItemId;
      this.apiService.createNewUserItem(newItem).subscribe(res => {
        newItemId = res.id;
        this._myItems.next([res].concat(this._myItems.value));
        resolve(newItemId);
      });
    });
  }

  public uploadPicture(selectedFile: File, itemId: number) {
    this.apiService.uploadPicture(selectedFile, itemId).subscribe(res => {
      let editedItemIndex = this._myItems.value.findIndex(myItem => myItem.id === itemId);
      let newItemsArray = this._myItems.value;
      newItemsArray[editedItemIndex].pictures = res;
      this._myItems.next(newItemsArray);
    })
  }

  public updateUserItem(newItem: Item) {
    this.apiService.updateUserItem(newItem).subscribe(res => {
      let editedItemIndex = this._myItems.value.findIndex(myItem => myItem.id === newItem.id);
      let newItemsArray = this._myItems.value;
      newItemsArray[editedItemIndex] = res;
      this._myItems.next(newItemsArray);
    })
  }
}
