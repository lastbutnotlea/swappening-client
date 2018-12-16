import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../shared/item-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-edit-item-details',
  templateUrl: './edit-item-details.component.html',
  styleUrls: ['./edit-item-details.component.css']
})
export class EditItemDetailsComponent implements OnInit {

  private myItem$: Observable<Item>;
  myItemModel: Item;
  selectedFile = null;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private apiService: ApiService) {
  }

  ngOnInit() {
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id !== 'new') {
      this.myItem$ = this.dataService.myItem(parseInt(current_id, 10));
      this.myItem$.subscribe(newItem => this.myItemModel = newItem);
    }
  }

  onFileSelected(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    // this.myItemModel.imageUrls = this.selectedFile;
  }

  onUpload() {
    this.apiService.createNewUserItem(this.myItemModel);
  }

}
