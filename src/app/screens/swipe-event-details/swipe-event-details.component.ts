import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Event} from '../../shared/event-model';
import {ApiService} from "../../services/api.service";
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-swipe-event-details',
  templateUrl: './swipe-event-details.component.html',
  styleUrls: ['./swipe-event-details.component.scss']
})
export class SwipeEventDetailsComponent implements OnInit {

  private eventId: number;
  private event$: Observable<Event>;
  private displayLocation: boolean;

  private displayLocationSubscription: Subscription;
  
  private apiUrl: string;

  constructor(private dataService: DataService,
              private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.event$ = this.dataService.swipeEvent(this.eventId);
    this.displayLocationSubscription = this.event$.subscribe(res => {
      this.displayLocation = !res.isPrivate;
    });
  }

  ngOnDestroy() {
    if (this.displayLocationSubscription) this.displayLocationSubscription.unsubscribe();
  }

}
