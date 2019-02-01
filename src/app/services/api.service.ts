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
import {Event, FAKE_EVENTS} from '../shared/event-model';
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


  // ### EVENTS HOSTED BY USER

  public getHostedEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + '/ofUser/' + this.userId;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      })
    }
  }

  public createNewHostedEvent(newEvent: Event): Observable<Event> {
    const requestUrl = environment.apiUrl + '/event';
    return this.http.post<Event>(requestUrl, {
      ...newEvent
    }, {
      headers: {Authorization: 'Bearer ' + this.userToken}
    })
  }

  public uploadPicture(selectedFile: File, eventId: number): Observable<any[]> {
    const uploadData = new FormData();
    uploadData.append('data', selectedFile, selectedFile.name);
    uploadData.append('itemId', eventId.toString());
    const requestUrl = environment.apiUrl + '/event/image';
    return this.http.post<any[]>(requestUrl,
      uploadData,
      {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  public updateHostedEvent(updatedEvent: Event): Observable<Event> {
    const requestUrl = environment.apiUrl + '/event/' + updatedEvent.id;
    return this.http.put<Event>(requestUrl, {
      ...updatedEvent
    }, {
      headers: {Authorization: 'Bearer ' + this.userToken}
    })
  }

  // TODO getLikedEvent

  // TODO likeEvent (?)

  // TODO dislikeEvent (?)




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

  public createNewUserItem(newItem: Item): Observable<Item> {
    const requestUrl = environment.apiUrl + '/item/addItem';
    return this.http.post<Item>(requestUrl, {
        headline: newItem.headline,
        description: newItem.description
      }, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  public uploadPicture(selectedFile: File, itemId: number): Observable<any[]> {
    const uploadData = new FormData();
    uploadData.append('data', selectedFile, selectedFile.name);
    uploadData.append('itemId', itemId.toString());
    const requestUrl = environment.apiUrl + '/item/addPictureToItem';
    return this.http.post<any[]>(requestUrl,
      uploadData,
      {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  public updateUserItem(newItem: Item): Observable<Item> {
    const requestUrl = environment.apiUrl + '/item/updateItem/' + newItem.id;
    return this.http.put<Item>(requestUrl, {
        headline: newItem.headline,
        description: newItem.description
      }, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  // TODO: deleteUserItem(id: string)


  // ### SWIPE EVENTS

  public getFirstSwipeEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + '/forUser/' + this.userId + '/' + environment.reloadEvery * 1.5;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  public getSwipeEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS.slice(0,10));
    } else {
      const requestUrl = environment.apiUrl + '/forUser/' + this.userId + '/' + environment.reloadEvery;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      })
    }
  }

  // ### ALL ITEMS

  // fetches the first set of items; should only be triggered once
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

  // fetches the next set of items, should be triggered after the user swiped through X previous items
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

  // TODO: swipeItems(id: string, liked: boolean): someKindOfResponse
}
