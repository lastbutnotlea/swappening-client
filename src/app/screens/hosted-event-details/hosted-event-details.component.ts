import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-hosted-event-details',
  templateUrl: './hosted-event-details.component.html',
  styleUrls: ['./hosted-event-details.component.scss']
})
export class HostedEventDetailsComponent implements OnInit {

  private eventId: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
  }

}
