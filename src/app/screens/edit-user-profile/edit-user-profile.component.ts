import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {User} from "../../shared/user-model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.component.html",
  styleUrls: ["./edit-user-profile.component.scss"]
})
export class EditUserProfileComponent implements OnInit {

  private isEdit;
  private user$: Observable<User>;
  private userModel: User;
  private apiUrl: string;
  private selectedFile: File = null;
  private previewImage: any;
  private newPicture = false;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const mode: string = this.route.snapshot.url[0].path;
    if (mode === "edituserprofile") {
      this.isEdit = true;
      this.user$ = this.dataService.me;
      this.user$.subscribe(user => {
        this.userModel = user;
      });
    } else if (mode === "newuserprofile") {
      this.isEdit = false;
      this.userModel = {
        id: null,
        email: null,
        password: null,
        nickname: null,
        description: null,
        pictureStorageName: null,
        location: null,
        distance: null
      };
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
    this.newPicture = true;
  }

  saveUser() {
    if (this.isEdit) {
      this.dataService.updateUserDetails(this.userModel, this.selectedFile);
      this.router.navigate(['/userprofile/me']);
    } else {
      /*      this.dataService.createNewHostedEvent(this.eventModel).then(res => {
              this.eventId = res;
              this.event$ = this.dataService.event(this.eventId);
              this.event$.subscribe(newEvent => this.eventModel = newEvent);
              if (this.selectedFile !== null) {
                this.dataService.uploadPicture(this.selectedFile, this.eventId);
                this.selectedFile = null;
              }
              this.router.navigate([`/hostedevents/${this.eventId}`]);
            });*/
    }
  }
}
