import {Component, OnInit, Input} from "@angular/core";
import {User} from "../../shared/user-model";
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../services/api.service";
import {ConfirmationDialogComponent} from "../../components/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit {

  private userId: number;
  private isMe: boolean;
  private user$: Observable<User>;
  private eventId: number;

  private apiUrl: string;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private apiService: ApiService,
              private confirmationDialog: MatDialog) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    const current_id: string = this.route.snapshot.paramMap.get("id");
    if (current_id === "me") {
      this.isMe = true;
    } else {
      this.isMe = false;
      this.userId = parseInt(current_id, 10);
      const current_eventId: string  = this.route.snapshot.paramMap.get("eventId");
      this.eventId =  parseInt(current_eventId, 10);
    }
    if (this.isMe) {
      this.user$ = this.dataService.me;
    } else {
      this.user$ = this.dataService.user(this.userId);
    }
    console.log(this.eventId)
  }

  logout() {
    const dialogReference = this.confirmationDialog.open(ConfirmationDialogComponent, {
      width: "50vw",
      data: {
        title: "Are you sure you want to log out?"
      },
      autoFocus: false
    });

    dialogReference.afterClosed().subscribe(result => {
      if (result === true) {
        this.apiService.logout();
        this.router.navigate(["/login"]);
      }
    });
  }

  swipeUser(isLeft: boolean) {
    this.dataService.swipeUser(isLeft, this.userId, this.eventId)
    this.router.navigate(["/matches"])
    //HERE WE SHOULD ALSO DELETE THE REQUEST
  }
}
