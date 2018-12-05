import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Item} from "../../shared/item-model";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
