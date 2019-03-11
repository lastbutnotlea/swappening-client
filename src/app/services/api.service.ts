import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Event, FAKE_EVENTS} from "../shared/event-model";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, of} from "rxjs";
import {FAKE_USER, User} from "../shared/user-model";
import {Message} from "../shared/messages-model";
import {Chat} from "../shared/chat-model";

@Injectable({
  providedIn: "root"
})
export class ApiService {

  userToken: string;
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  public login(email, password): Promise<void> {
    if (environment.useMockData) {
    } else {
      const requestUrl = environment.apiUrl + "/login";
      return this.http.post<string>(requestUrl, {
        email,
        password
      }).toPromise().then(
        (res: any) => {
          this.userToken = res.token;
          this.loggedIn.next(true);
        }
      );
    }
  }

  public register(user: User, confirmedPassword: string, selectedFile: File): Promise<any> {
    const requestUrl = environment.apiUrl + "/register";
    const uploadData = new FormData();
    if (selectedFile) uploadData.append("data", selectedFile, selectedFile.name);
    uploadData.append("description", user.description);
    if (user.distance) uploadData.append("distance", user.distance.toString());
    uploadData.append("location", user.location);
    uploadData.append("nickname", user.nickname);
    uploadData.append("email", user.email);
    uploadData.append("password", user.password);
    uploadData.append("confirmPassword", confirmedPassword);
    return this.http.post<any>(requestUrl,
      uploadData, {
        headers: {Authorization: "Bearer " + this.userToken}
      }).toPromise();
  }

  public getLoggedIn(): Observable<boolean> {
    return this.loggedIn;
  }

  public logout() {
    this.userToken = null;
    this.loggedIn.next(false);
  }

  public getMyDetails(): Observable<User> {
    const requestUrl = environment.apiUrl + "/user/me";
    return this.http.get<User>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getUserDetails(userId: number): Observable<User> {
    if (environment.useMockData) {
      return of(FAKE_USER);
    } else {
      const requestUrl = environment.apiUrl + "/user/" + userId;
      return this.http.get<User>(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
    }
  }

  // TODO use data that backend returns?
  public updateUserDetails(updatedUser: User, selectedFile: File): Observable<any> {
    const requestUrl = environment.apiUrl + "/user/" + updatedUser.id;
    const uploadData = new FormData();
    if (selectedFile) uploadData.append("data", selectedFile, selectedFile.name);
    uploadData.append("description", updatedUser.description);
    if (updatedUser.distance) uploadData.append("distance", updatedUser.distance.toString());
    uploadData.append("location", updatedUser.location);
    uploadData.append("nickname", updatedUser.nickname);
    uploadData.append("password", updatedUser.password);
    return this.http.put(requestUrl,
      uploadData, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
  }

  public getHostedEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + "/event/ofUser/" + userId;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
    }
  }

  public createNewHostedEvent(newEvent: Event): Observable<Event> {
    const requestUrl = environment.apiUrl + "/event";
    return this.http.post<Event>(requestUrl, {
      ...newEvent
    }, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public deleteHostedEvent(eventId: number): Observable<any> {
    const requestUrl = environment.apiUrl + "/event/" + eventId;
    return this.http.delete(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public uploadPicture(selectedFile: File, eventId: number): Observable<any[]> {
    const uploadData = new FormData();
    uploadData.append("data", selectedFile, selectedFile.name);
    uploadData.append("eventId", eventId.toString());
    const requestUrl = environment.apiUrl + "/event/image";
    return this.http.post<any[]>(requestUrl,
      uploadData,
      {
        headers: {Authorization: "Bearer " + this.userToken}
      }
    );
  }

  public deletePicture(pictureStorageName: string): Observable<any> {
    const requestUrl = environment.apiUrl + "/event/image/" + pictureStorageName;
    return this.http.delete(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      }
    );
  }

  public makeFirstPicture(pictureOrdering, eventId: number): Observable<any> {
    const requestUrl = environment.apiUrl + "/event/image/updateOrder/" + eventId;
    return this.http.put(requestUrl,
      pictureOrdering,
      {
        headers: {Authorization: "Bearer " + this.userToken}
      });
  }

  public updateHostedEvent(updatedEvent: Event): Observable<Event> {
    const requestUrl = environment.apiUrl + "/event/" + updatedEvent.id;
    return this.http.put<Event>(requestUrl, {
      ...updatedEvent
    }, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getLikedEvents(userId: string): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      const requestUrl = environment.apiUrl + "/event/forUser/liked"; // + this.userId;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
    }
  }

  public getAcceptedEvents(userId: string): Observable<Event[]> {
    const requestUrl = environment.apiUrl + "/event/forUser/accepted"; // + this.userId;
    return this.http.get<Event[]>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getFirstSwipeEvents(userId: string, tags: string[]): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS);
    } else {
      let tagsAsString = "";
      if (tags.length > 0) tagsAsString = tags.reduce((acc, curr) => acc + "," + curr);
      const requestUrl = environment.apiUrl + "/event/forUser/" + userId + "/" + environment.reloadEvery * 1.5 + "/0/" + tagsAsString;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
    }
  }

  public getSwipeEvents(userId: string, tags: string[]): Observable<Event[]> {
    if (environment.useMockData) {
      return of(FAKE_EVENTS.slice(0, 10));
    } else {
      let tagsAsString = "";
      if (tags.length > 0) tagsAsString = tags.reduce((acc, curr) => acc + "," + curr);
      const requestUrl = environment.apiUrl + "/event/forUser/" + userId + "/" +
        environment.reloadEvery + "/" + environment.reloadEvery / 2 + "/" + tagsAsString;
      return this.http.get<Event[]>(requestUrl, {
        headers: {Authorization: "Bearer " + this.userToken}
      });
    }
  }

  public getAllChats(): Observable<Chat[]> {
    const requestUrl = environment.apiUrl + "/chat/";
    return this.http.get<Chat[]>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public sendMessage(chatId: number, isMessageOfOwner: boolean, message: string) {
    const requestUrl = environment.apiUrl + "/chat/messages";
    this.http.post(requestUrl, {
      chatId: chatId,
      isMessageOfOwner: isMessageOfOwner,
      message: message
    }, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getMessageOfChat(chatId: number): Observable<Message[]> {
    const requestUrl = environment.apiUrl + "/chat/messages/" + chatId;
    return this.http.get<Message[]>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getToken() {
    return this.userToken;
  }

  public getInterestedUsers(eventId: number): Observable<any[]> {
    const requestUrl = environment.apiUrl + "/user/forEvent/" + eventId;
    return this.http.get<User[]>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public getAllTags(): Observable<any[]> {
    const requestUrl = environment.apiUrl + "/tag";
    return this.http.get<any[]>(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public createChat(eventId: number, userId: number): Observable<any> {
    const requestUrl = environment.apiUrl + "/chat/init/" + eventId + "/" + userId;
    return this.http.get(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public deleteChat(chatId: number): Observable<any> {
    const requestUrl = environment.apiUrl + "/chat/" + chatId;
    return this.http.delete(requestUrl, {
      headers: {Authorization: "Bearer " + this.userToken}
    });
  }

  public swipeAnEvent(isLeft: boolean, eventId: number): Observable<any[]> {
    const requestUrl = environment.apiUrl + "/event/swipe/" + (isLeft ? "left" : "right") + "/" + eventId;
    return this.http.post<any>(requestUrl, {}, {
      headers: {Authorization: "Bearer " + this.userToken},
    });
  }

  public verifyUser(accepted: boolean, userId: number, eventId: number): Observable<any[]> {
    const requestUrl = environment.apiUrl + "/event/swipeUser/" + (accepted ? "right" : "left") + "/" + userId + "/" + eventId;
    return this.http.post<any>(requestUrl, {}, {
      headers: {Authorization: "Bearer " + this.userToken},
    });
  }

  // public isUserAccepted(eventId: number, userId: number): ??? {
  //   const requestUrl = environment.apiUrl + "/event/isUserAccepted/" + eventId + "/" + userId;
  //   return this.http.get(requestUrl, {
  //     headers: {Authorization: "Bearer " + this.userToken}
  //   });
  // }
}
