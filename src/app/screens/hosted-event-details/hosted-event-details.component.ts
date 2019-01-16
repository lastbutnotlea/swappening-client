import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-hosted-event-details',
  templateUrl: './hosted-event-details.component.html',
  styleUrls: ['./hosted-event-details.component.css']
})
export class HostedEventDetailsComponent implements OnInit {

  private itemId: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
  }

}
