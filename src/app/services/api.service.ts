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

  // TODO: deleteEvent(id: string)

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
}
