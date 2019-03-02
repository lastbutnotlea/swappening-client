import {Component, Input, OnInit} from "@angular/core";
import {Event} from "../../shared/event-model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DateDisplayService} from "../../services/date-display.service";

@Component({
  selector: "app-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"]
})
export class EventListComponent implements OnInit {

  @Input()
  events$: Observable<Event[]>;
  @Input()
  routingLink: string;
  apiUrl: string;

  constructor(private dateDisplayService: DateDisplayService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
  }

  displayDate = (date) => this.dateDisplayService.parseDate(date);
}
