import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  FAKE_FIRST_SWIPE_ITEMS,
  FAKE_ITEMS,
  FAKE_ITEMS_3,
  FAKE_ITEMS_4,
  FAKE_SWIPE_ITEMS,
  Item, SINGLE_FAKE_ITEM
} from '../shared/item-model';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {FAKE_USER, User} from '../shared/user-model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  userToken: string;
  userId = 1;

  constructor(private http: HttpClient) {
  }

  // ### USER

  public login(): Promise<void> {
    if (environment.useMockData) {
    } else {
      const requestUrl = environment.apiUrl + '/login';
      return this.http.post<string>(requestUrl, {
        email: 'test123@beispiel.de',
        password: 'password123'
      }).toPromise().then(
        (res: any) => {
          this.userToken = res.token;
          console.log(this.userToken);
        }
      );
    }
  }


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
      const requestUrl = environment.apiUrl + `/item/getItemsOfUser/${this.userId}`;
      return this.http.get<Item[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  public testOnly_get3Items(): Observable<Item[]> {
    return of(FAKE_ITEMS_3);
  }

  // TODO: createNewUserItem(newItem: Item)
  public createNewUserItem(newItem: Item) {
    const requestUrl = environment.apiUrl + `/item/addItem`;
    this.http.post<Item>(requestUrl, {
      headers: {Authorization: 'Bearer ' + this.userToken},
      headline: newItem.headline, description: newItem.description
    });
  }

  public uploadPicture(selectedFile: File) {
    // this.http is the injected HttpClient
    const uploadData = new FormData();
    uploadData.append('data', selectedFile, selectedFile.name);
    const requestUrl = environment.apiUrl + '/files/upload';
    this.http.post(requestUrl, {
      headers: {Authorization: 'Bearer ' + this.userToken},
      data: uploadData
    })
      .subscribe( res => {
        console.log(res);
    });
  }

  // TODO: updateUserItem(newItem: Item)

  // TODO: deleteUserItem(id: string)

  // ### ALL ITEMS

  // fetches the first 15 items or so for the user to swipe through
  // should be triggered once
  public getFirstSwipeItems(userId: string): Observable<Item[]> {
    if (environment.useMockData) {
      return of(FAKE_FIRST_SWIPE_ITEMS);
    } else {
      const requestUrl = environment.apiUrl + `/item/getItemsForUser/${this.userId}/${environment.reloadEvery * 1.5}`;
      return this.http.get<Item[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  // fetches the next 10 items or so for the user to swipe through
  // should be triggered after the user swiped through 10 previous items
  public getSwipeItems(userId: string): Observable<Item[]> {
    if (environment.useMockData) {
      return of(FAKE_SWIPE_ITEMS);
    } else {
      const requestUrl = environment.apiUrl + `/item/getItemsForUser/${this.userId}/${environment.reloadEvery}`;
      return this.http.get<Item[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  public getSwipeItem(): Observable<Item[]> {
    if (environment.useMockData) {
      return of(SINGLE_FAKE_ITEM);
    }
  }

  // TODO: swipeItems(id: string, liked: boolean): someKindOfResponse
}
