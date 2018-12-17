import {Component, OnInit} from '@angular/core';
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
  private clickCounter = 0;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id !== 'new') {
      this.isEdit = true;
      this.itemId = parseInt(current_id, 10);
      this.myItem$ = this.dataService.myItem(this.itemId);
      this.myItem$.subscribe(newItem => this.myItemModel = newItem);
    } else {
      this.isEdit = false;
      this.myItemModel = {
        id: null,
        headline: '',
        description: '',
        tags: [],
        ownerId: '',
        giveAway: false,
        pictures: []
      }
    }
  }

  onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    this.clickCounter = 0;
    if (this.isEdit) {
      this.dataService.updateUserItem(this.myItemModel);
      if (this.selectedFile !== null) {
        this.dataService.uploadPicture(this.selectedFile, this.itemId);
        this.selectedFile = null;
      }
    } else {
      this.isEdit = true;
      this.dataService.createNewUserItem(this.myItemModel).then(res => {
        this.itemId = res;
        this.myItem$ = this.dataService.myItem(this.itemId);
        if (this.selectedFile !== null) {
          this.dataService.uploadPicture(this.selectedFile, this.itemId);
        }
        this.selectedFile = null;
      });
      this.myItem$.subscribe(newItem => {
        this.myItemModel = newItem;
      });
    }
  }

  cycleThroughPictures() {
    this.clickCounter++;
  }
}
