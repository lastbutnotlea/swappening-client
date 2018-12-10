import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-my-item-details',
  templateUrl: './my-item-details.component.html',
  styleUrls: ['./my-item-details.component.css']
})
export class MyItemDetailsComponent implements OnInit {

  private itemId: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
  }

}
