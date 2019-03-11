import {Event} from "../../shared/event-model";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ApiService} from "../../services/api.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-liked-event-details",
  templateUrl: "./liked-event-details.component.html",
  styleUrls: ["./liked-event-details.component.css"]
})
export class LikedEventDetailsComponent implements OnInit, OnDestroy {

  private eventId: number;
  private event$: Observable<Event>;
  private chatId: number;
  private fromChat: boolean = false;
  private displayLocation: boolean;

  private displayLocationSubscription: Subscription;

  private apiUrl: string;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.eventId = parseInt(this.route.snapshot.paramMap.get("id"), 10);
    this.event$ = this.dataService.likedEvent(this.eventId);
    this.fromChat = this.route.snapshot.paramMap.get('fromChat') === "fromChat";
    this.displayLocationSubscription = this.event$.subscribe(res => {
      this.displayLocation = !res.isPrivate;
      if (!this.displayLocation) {
        this.displayLocation = !this.fromChat;
      }
    });
  }

  startChat() {
    this.dataService.addNewChat(this.eventId, +this.dataService.myId).then(res => {
      this.chatId = res;
      this.router.navigate(["/chat/" + this.chatId]);
    });
  }

  ngOnDestroy() {
    if (this.displayLocationSubscription) this.displayLocationSubscription.unsubscribe();
  }

}
