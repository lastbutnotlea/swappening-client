import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {FAKE_FIRST_SWIPE_ITEMS, FAKE_ITEMS, FAKE_SWIPE_ITEMS, Item} from "../shared/item-model";
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {FAKE_USER, User} from "../shared/user-model";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {
  }

  // ### USER

  // TODO: login

  // TODO: register

  // TODO: logout

  public getUserDetails(): Observable<User> {
    if (environment.useMockData) {
      return of(FAKE_USER);
    } else {
      // TODO
      return this.http.get<User>('some url');
    }
  }

  // TODO: updateUserDetails

  // TODO: deleteAccount


  // ### MY ITEMS

  public getAllUserItems(userId: string): Observable<Item[]> {
    if (environment.useMockData) {
      return of(FAKE_ITEMS);
    } else {
      // TODO
      return this.http.get<Item[]>('some url');
    }
  }

  // TODO: createNewUserItem(newItem: Item)

  // TODO: updateUserItem(newItem: Item)

  // TODO: deleteUserItem(itemId: string)


  // ### ALL ITEMS

  // fetches the first 15 items or so for the user to swipe through
  // should be triggered once
  public getFirstSwipeItems(userId: string): Observable<Item[]> {
    if (environment.useMockData) {
      return of(FAKE_FIRST_SWIPE_ITEMS);
    } else {
      // TODO
      return this.http.get<Item[]>('some url');
    }
  }

  // fetches the next 10 items or so for the user to swipe through
  // should be triggered after the user swiped through 10 previous items
  public getSwipeItems(userId: string): Observable<Item[]> {
    if (environment.useMockData) {
      return of(FAKE_SWIPE_ITEMS);
    } else {
      // TODO
      return this.http.get<Item[]>('some url');
    }
  }

  // TODO: swipeItems(itemId: string, liked: boolean): someKindOfResponse
}
