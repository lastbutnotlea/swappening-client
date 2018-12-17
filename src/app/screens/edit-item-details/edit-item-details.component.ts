import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../shared/item-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-edit-item-details',
  templateUrl: './edit-item-details.component.html',
  styleUrls: ['./edit-item-details.component.css']
})
export class EditItemDetailsComponent implements OnInit {

  private myItem$: Observable<Item>;
  private myItemModel: Item;
  private selectedFile: File = null;
  private itemId;
  private apiUrl: string;
  private isEdit: boolean;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id !== 'new') {
      this.isEdit = true;
      this.itemId = parseInt(current_id);
      this.myItem$ = this.dataService.myItem(this.itemId);
      this.myItem$.subscribe(newItem => this.myItemModel = newItem);
    } else {
      this.isEdit = false;
    }
  }

  onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    // this.myItemModel.pictures = this.selectedFile;
  }

  onUpload() {
    if(this.isEdit) {
      this.apiService.updateUserItem(this.myItemModel);
    } else {
      //this.apiService.createNewUserItem(this.myItemModel);
      //this.apiService.uploadPicture(this.selectedFile);
    }
  }

}
