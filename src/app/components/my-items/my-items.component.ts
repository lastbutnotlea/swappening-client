import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {

  images = [1,2,3,4,5,6,7];

  constructor() { }

  ngOnInit() {
  }

}
