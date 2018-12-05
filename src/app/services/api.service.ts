import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Item} from "../shared/item-model";
import {environment} from "../../environments";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {
  }

  // ### USER

  // TODO: login

  // TODO: register

  // TODO: logout

  // TODO: getUserDetails

  // TODO: updateUserDetails

  // TODO: deleteAccount


  // ### MY ITEMS

  public getAllUserItems(userId: string): Item[] {
    if (environment.useMockData) {
      return null;
    } else {
      return null;
    }

  }

  // TODO: createNewUserItem(newItem: Item)

  // TODO: updateUserItem(newItem: Item)

  // TODO: deleteUserItem(itemId: string)


  // ### ALL ITEMS

  // TODO: getSwipingItems(userId: string)

  // TODO: swipeItems(itemId: string, liked: boolean): someKindOfResponse
}
