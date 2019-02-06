import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Event} from '../../shared/event-model';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../../environments/environment";
import {MatDialog} from "@angular/material";
import {ConfirmationDialogComponent} from "../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-edit-event-details',
  templateUrl: './edit-event-details.component.html',
  styleUrls: ['./edit-event-details.component.scss']
})
export class EditEventDetailsComponent implements OnInit {

  private selectedFile: File = null;
  private previewImage: any;
  private event$: Observable<Event>;
  private eventModel: Event;
  private eventId;
  private apiUrl: string;
  private isEdit: boolean;
  private numberOfPictures = 0;
  private clickCounter = 0;
  private checked = true;
  private soonToBeFirst = 0;
  private orderArray = [];

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private confirmationDialog: MatDialog) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get('id');
    if (current_id !== 'new') {
      this.isEdit = true;
      this.eventId = parseInt(current_id, 10);
      this.event$ = this.dataService.event(this.eventId);
      this.event$.subscribe(newEvent => {
        this.eventModel = newEvent;
        this.numberOfPictures = this.eventModel.pictures_events.length;
      });
    } else {
      this.isEdit = false;
      this.numberOfPictures = 0;
      this.eventModel = {
        id: 0,
        headline: '',
        description: '',
        place: '',
        startTime: '',
        endTime: new Date().toDateString(),
        isPrivate: false,
        hasChat: false,
        isVisible: true,
        tags: [],
        ownerId: 0,
        pictures_events: [],
      }
    }
  }

  onFileChanged(event) {
    console.log(event);
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  deletePicture() {
    if (this.isEdit) {
      const pictureStorageName = this.eventModel.pictures_events[this.clickCounter % this.numberOfPictures].pictureStorageName;
      this.dataService.deletePicture(pictureStorageName, this.eventId);
      this.clickCounter--;
      this.checked = (this.clickCounter % this.numberOfPictures) == this.soonToBeFirst;
    } else {
      this.selectedFile = null;
    }
  }

  makeFirst(index: number) {
    console.log('MAKE FIRST');
    if (!this.checked) {
      let order = 1;
      for (let i = 0; i < this.eventModel.pictures_events.length; i++) {
        if (i == index) order = 1;
        else order = 2;
        this.orderArray.push({
            pictureStorageName: this.eventModel.pictures_events[i].pictureStorageName,
            order: order
          }
        );
      }
      this.soonToBeFirst = this.clickCounter % this.numberOfPictures;
      console.log('MAKE FIRST; soonToBeFirst: ' + this.soonToBeFirst);
      this.checked = true;
    }
  }

  saveEvent() {
    this.clickCounter = 0;
    if (this.isEdit) {
      this.dataService.updateHostedEvent(this.eventModel);
      this.dataService.makeFirstPicture(this.orderArray, this.eventId);
      this.clickCounter = 0;
      if (this.selectedFile !== null) {
        this.dataService.uploadPicture(this.selectedFile, this.eventId);
        this.selectedFile = null;
      }
      this.goBack();
    } else {
      this.dataService.createNewHostedEvent(this.eventModel).then(res => {
        this.eventId = res;
        this.event$ = this.dataService.event(this.eventId);
        this.event$.subscribe(newEvent => this.eventModel = newEvent);
        if (this.selectedFile !== null) {
          this.dataService.uploadPicture(this.selectedFile, this.eventId);
          this.selectedFile = null;
        }
        this.router.navigate([`/hostedevents/${this.eventId}`]);
      });
    }
  }

  deleteEvent() {
    if (this.isEdit) {
      const dialogReference = this.confirmationDialog.open(ConfirmationDialogComponent, {
        width: '50vw',
        data: {
          title: 'Are you sure you want to delete this event?'
        },
        autoFocus: false
      });

      dialogReference.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(["/hostedevents"]);
          this.dataService.deleteHostedEvent(this.eventId);
        }
      });
    }
  }

  cycleThroughPictures() {
    if (this.isEdit) {
      this.clickCounter++;
      this.checked = (this.clickCounter % this.numberOfPictures) == this.soonToBeFirst;
    }
  }

  goBack() {
    if (this.eventId) {
      this.router.navigate([`/hostedevents/${this.eventId}`]);
    } else {
      this.router.navigate(['/hostedevents']);
    }
  }
}
