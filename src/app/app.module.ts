import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {SwipeEventsComponent} from './screens/swipe-events/swipe-events.component';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {MatButtonModule, MatCardModule, MatIconModule, MatSlideToggleModule} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {HttpClientModule} from '@angular/common/http';
import { HostedEventDetailsComponent } from './screens/hosted-event-details/hosted-event-details.component';
import { SwipeEventDetailsComponent } from './screens/swipe-event-details/swipe-event-details.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EditEventDetailsComponent } from './screens/edit-event-details/edit-event-details.component';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatchesComponent } from './screens/matches/matches.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { HostedEventsComponent } from './screens/hosted-events/hosted-events.component';
import { LikedEventsComponent } from './screens/liked-events/liked-events.component';
import { LikedEventDetailsComponent } from './screens/liked-event-details/liked-event-details.component';
import { UserProfileComponent } from './screens/user-profile/user-profile.component'
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {OwlMomentDateTimeModule} from "ng-pick-datetime-moment";

export const MY_MOMENT_FORMATS = {
  parseInput: 'DD.MM.YY HH:mm',
  fullPickerInput: 'DD.MM.YY HH:mm',
  datePickerInput: 'DD.MM.YY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MM YYYY',
};

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/swipeevents',
    pathMatch: 'full'
  },
  {
    path: 'hostedevents',
    component: HostedEventsComponent
  },
  {
    path: 'hostedevents/:id',
    component: HostedEventDetailsComponent
  },
  {
    path: 'hostedevents/:id/edit',
    component: EditEventDetailsComponent
  },
  {
    path: 'likedevents',
    component: LikedEventsComponent
  },
  {
    path: 'likedevents/:id',
    component: LikedEventDetailsComponent
  },
  {
    path: 'swipeevents',
    component: SwipeEventsComponent
  },
  {
    path: 'swipeevents/:id',
    component: SwipeEventDetailsComponent
  },
  {
    path: 'matches',
    component: MatchesComponent
  },
  {
    path: 'userprofile',
    component: UserProfileComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SwipeEventsComponent,
    BottomMenuComponent,
    HostedEventDetailsComponent,
    SwipeEventDetailsComponent,
    EventDetailsComponent,
    EditEventDetailsComponent,
    MatchesComponent,
    EventListComponent,
    HostedEventsComponent,
    LikedEventsComponent,
    LikedEventDetailsComponent,
    UserProfileComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
