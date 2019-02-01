import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../shared/item-model';
import {Event} from '../../shared/event-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-edit-event-details',
  templateUrl: './edit-event-details.component.html',
  styleUrls: ['./edit-event-details.component.scss']
})
export class EditEventDetailsComponent implements OnInit {

  private myItem$: Observable<Item>;
  private myItemModel: Item;
  private selectedFile: File = null;
  private itemId;

  private event$: Observable<Event>;
  private eventModel: Event;
  private eventId;

  private apiUrl: string;
  private isEdit: boolean;
  private clickCounter = 0;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id !== 'new') {
      this.isEdit = true;

      this.itemId = parseInt(current_id, 10);
      this.myItem$ = this.dataService.myItem(this.itemId);
      this.myItem$.subscribe(newItem => this.myItemModel = newItem);

      this.eventId = parseInt(current_id, 10);
      this.event$ = this.dataService.event(this.eventId);
      this.event$.subscribe(newEvent => this.eventModel = newEvent);
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
      this.eventModel = {
        id: null,
        headline: '',
        description: '',
        place: '',
        startTime: '',
        endTime: '',
        isPrivate: false,
        hasChat: false,
        isVisible: true,
        tags: [],
        ownerId: null,
        pictures_events: [],
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
      this.dataService.updateHostedEvent(this.eventModel);
      if (this.selectedFile !== null) {
        this.dataService.uploadPicture(this.selectedFile, this.eventId);
        this.selectedFile = null;
      }
    } else {
      this.isEdit = true;
      this.dataService.createNewHostedEvent(this.eventModel).then(res => {
        this.eventId = res;
        this.event$ = this.dataService.event(this.eventId);
        this.event$.subscribe(newEvent => this.eventModel = newEvent);
        if (this.selectedFile !== null) {
          this.dataService.uploadPicture(this.selectedFile, this.eventId);
        }
        this.selectedFile = null;
      });
    }
  }

  cycleThroughPictures() {
    this.clickCounter++;
  }

  goBack() {
    if (this.eventId) {
      this.router.navigate([`/hostedevents/${this.eventId}`]);
    } else {
      this.router.navigate(['/hostedevents']);
    }
  }
}
