import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/user-model';
import {DataService} from '../../services/data.service';
import {FAKE_USER} from '../../shared/user-model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {


  private userId: number = 1;
  private isMe: boolean = false;
  private user$: Observable<User>;
  private mock_user: User = FAKE_USER;

  private apiUrl: string;

  constructor(private dataService: DataService,) {
  }

  ngOnInit() {
    this.user$ = this.dataService.user(this.userId)
  }

}
