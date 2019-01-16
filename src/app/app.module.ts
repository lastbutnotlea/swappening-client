import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {SwipeEventsComponent} from './screens/swipe-events/swipe-events.component';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {MatButtonModule, MatCardModule} from '@angular/material';
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
import { SettingsComponent } from './screens/settings/settings.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { HostedEventsComponent } from './screens/hosted-events/hosted-events.component';
import { LikedEventsComponent } from './screens/liked-events/liked-events.component';
import { LikedEventDetailsComponent } from './screens/liked-event-details/liked-event-details.component';

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
    path: 'settings',
    component: SettingsComponent
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
    SettingsComponent,
    EventListComponent,
    HostedEventsComponent,
    LikedEventsComponent,
    LikedEventDetailsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
