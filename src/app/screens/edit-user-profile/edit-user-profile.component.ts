import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {User} from "../../shared/user-model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../services/api.service";
import {InformationDialogComponent} from "../../components/information-dialog/information-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: "app-edit-user-profile",
  templateUrl: "./edit-user-profile.component.html",
  styleUrls: ["./edit-user-profile.component.scss"]
})
export class EditUserProfileComponent implements OnInit {

  private isEdit;
  private user$: Observable<User>;
  private userModel: User;
  private confirmedPassword: string;
  private apiUrl: string;
  private selectedFile: File = null;
  private previewImage: any;
  private newPicture = false;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private router: Router,
              private apiService: ApiService,
              private informationDialog: MatDialog) {
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
      this.confirmedPassword = null;
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
      this.apiService.register(this.userModel, this.confirmedPassword, this.selectedFile).then(
        () => {
          console.log("you registered successfully");
          this.router.navigate(['/userprofile/me']);
        }
      ).catch(err => {
        console.log(err);
        const dialogReference = this.informationDialog.open(InformationDialogComponent, {
          width: "50vw",
          data: {title: err.error[0].msg},
          autoFocus: false
        });
      });
    }
  }
}
