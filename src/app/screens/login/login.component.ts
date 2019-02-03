import {Component, OnInit} from "@angular/core";
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {ApiService} from "../../services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  private apiUrl: string;
  private email;
  private password;

  constructor(private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
  }

  login() {
    this.apiService.login(this.email, this.password)
      .then(() => this.router.navigate(["/swipeevents"]))
      .catch(() => {
        console.log("Wrong Email or Password");
      });
  }

  loginUser1() {
    this.apiService.login("test123@beispiel.de", "password123")
      .then(() => this.router.navigate(["/swipeevents"]))
      .catch(() => {
        console.log("Wrong Email or Password");
      });
  }

  loginUser2() {
    this.apiService.login("test1234@beispiel.de", "password123")
      .then(() => this.router.navigate(["/swipeevents"]))
      .catch(() => {
        console.log("Wrong Email or Password");
      });
  }
}
