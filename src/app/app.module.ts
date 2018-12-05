import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MyItemsComponent} from './screens/my-items/my-items.component';
import {SwipeItemsComponent} from './screens/swipe-items/swipe-items.component';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {MatButtonModule} from "@angular/material";
import {MatGridListModule} from "@angular/material/grid-list";
import {ApiService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import { MyItemDetailsComponent } from './screens/my-item-details/my-item-details.component';
import { SwipeItemDetailsComponent } from './screens/swipe-item-details/swipe-item-details.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import {DataService} from "./services/data.service";

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
    path: 'swipeitems',
    component: SwipeItemsComponent
  },
  {
    path: "swipteitems/:id",
    component: SwipeItemDetailsComponent
  }
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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatGridListModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
    DataService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
