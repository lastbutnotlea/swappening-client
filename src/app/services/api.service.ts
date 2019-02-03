import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
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

  public login(email, password): Promise<void> {
    if (environment.useMockData) {
    } else {
      const requestUrl = environment.apiUrl + '/login';
      return this.http.post<string>(requestUrl, {
        email,
        password
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

  // TODO: getMyDetails
  public getMyDetails(): Observable<User> {
    const requestUrl = environment.apiUrl + '/user/me';
    return this.http.get<User>(requestUrl, {
      headers: {Authorization: 'Bearer ' + this.userToken}
    });
  }

  // TODO: getUserDetails(userId: number)
  public getUserDetails(userId: number): Observable<User> {
    if (environment.useMockData) {
      return of(FAKE_USER);
    } else {
      const requestUrl = environment.apiUrl + '/usr/' + userId;
      return this.http.get<User>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  // TODO: updateUserDetails

  // TODO: deleteAccount

  public getHostedEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + '/event/ofUser/' + this.userId;
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
    uploadData.append('eventId', eventId.toString());
    const requestUrl = environment.apiUrl + '/event/image';
    return this.http.post<any[]>(requestUrl,
      uploadData,
      {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  public deletePicture(pictureStorageName: string): Observable<any> {
    const requestUrl = environment.apiUrl + '/event/image/' + pictureStorageName;
    return this.http.delete(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      }
    );
  }

  public makeFirstPicture(pictureOrdering, eventId: number): Observable<any> {
    const requestUrl = environment.apiUrl + '/event/image/updateOrder/' + eventId;
    return this.http.put(requestUrl,
      pictureOrdering,
      {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
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
  public getLikedEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + '/event/forUser/liked'; // + this.userId;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      })
    }
  }

  // TODO likeEvent (?)

  // TODO dislikeEvent (?)

  // TODO: deleteEvent(eventId: string)

  public getFirstSwipeEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + '/event/forUser/' + this.userId + '/' + environment.reloadEvery * 1.5;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      });
    }
  }

  public getSwipeEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS.slice(0, 10));
    } else {
      const requestUrl = environment.apiUrl + '/event/forUser/' + this.userId + '/' + environment.reloadEvery;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      })
    }
  }

  // TODO getInterestedUsers(eventId: number)
  public getInterestedUsers(eventId: number): Observable<User[]> {
    const requestUrl = environment.apiUrl + '/user/forEvent/' + eventId;
      return this.http.get<User[]>(requestUrl, {
        headers: {Authorization: 'Bearer ' + this.userToken}
      })
  }


  // TODO getChatUsers(userId: number)
}
