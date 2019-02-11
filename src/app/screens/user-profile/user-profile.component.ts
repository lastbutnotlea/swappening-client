import { Component, OnInit } from '@angular/core';
import {User} from '../../shared/user-model';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private userId: number;
  private isMe: boolean;
  private user$: Observable<User>;

  private apiUrl: string;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id == 'me') {
      this.isMe = true;
    } else {
      this.isMe = false;
      this.userId = parseInt(current_id, 10);
    }
    if (this.isMe) {
      this.user$ = this.dataService.me;
    }
    else{
      this.user$ = this.dataService.user(this.userId);
    }
  }
}
