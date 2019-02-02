import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/user-model';
import {FAKE_USER} from '../../shared/user-model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  private userId: number;
  private isMe: boolean;
  private user$: Observable<User>
  private mock_user: User = FAKE_USER;

  private apiUrl: string;

  constructor() { }

  ngOnInit() {
  }

}
