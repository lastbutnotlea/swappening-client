import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {Item} from "../shared/item-model";
import {User} from "../shared/user-model";
import {map} from "rxjs/operators";

@Injectable()
export class DataService {

  private user$: Observable<User>;
  private userId: string;
  private myItems$: Observable<Item[]>;

  constructor(private apiService: ApiService) {
    this.user$ = this.apiService.getUserDetails();
    this.user$.subscribe(user => this.userId = user.userId);
    this.myItems$ = this.apiService.getAllUserItems(this.userId);
  }

  public getAllUserItems(): Observable<Item[]> {
    return this.myItems$;
  }

  public getUserItem(itemId: string): Observable<Item> {
    return this.myItems$.pipe(map((myItems: Item[]) => myItems.find(myItem => myItem.itemId === itemId)));
  }

  public getUserDetails() {
    return this.user$;
  }

  // TODO update data; does this work using observables the way i do right now?
}
