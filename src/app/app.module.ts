import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MyItemsComponent} from './screens/my-items/my-items.component';
import {SwipeItemsComponent} from './screens/swipe-items/swipe-items.component';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {MatButtonModule} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {ApiService} from './services/api.service';
import {HttpClientModule} from '@angular/common/http';
import { MyItemDetailsComponent } from './screens/my-item-details/my-item-details.component';
import { SwipeItemDetailsComponent } from './screens/swipe-item-details/swipe-item-details.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import {DataService} from './services/data.service';
import { EditItemDetailsComponent } from './screens/edit-item-details/edit-item-details.component';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatchesComponent } from './screens/matches/matches.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { SettingsComponent } from './screens/settings/settings.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { HostedEventsComponent } from './screens/hosted-events/hosted-events.component';
import { LikedEventsComponent } from './screens/liked-events/liked-events.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/swipeitems',
    pathMatch: 'full'
  },
  {
    path: 'myitems',
    component: MyItemsComponent
  },
  {
    path: 'myitems/:id',
    component: MyItemDetailsComponent
  },
  {
    path: 'hostedevents',
    component: HostedEventsComponent
  },
  {
    path: 'hostedevents/:id',
    component: MyItemDetailsComponent
  },
  {
    path: 'likedevents',
    component: LikedEventsComponent
  },
  {
    path: 'likedevents/:id',
    component: MyItemDetailsComponent
  },
  {
    path: 'swipeitems',
    component: SwipeItemsComponent
  },
  {
    path: 'swipeitems/:id',
    component: SwipeItemDetailsComponent
  },
  {
    path: 'myitems/:id/edit',
    component: EditItemDetailsComponent
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
    MyItemsComponent,
    SwipeItemsComponent,
    BottomMenuComponent,
    MyItemDetailsComponent,
    SwipeItemDetailsComponent,
    ItemDetailsComponent,
    EditItemDetailsComponent,
    MatchesComponent,
    TopMenuComponent,
    SettingsComponent,
    EventListComponent,
    HostedEventsComponent,
    LikedEventsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatGridListModule,
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
