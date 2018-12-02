import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MyItemsComponent} from './components/my-items/my-items.component';
import {SwipeItemsComponent} from './components/swipe-items/swipe-items.component';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {MatButtonModule} from "@angular/material";
import {MatGridListModule} from "@angular/material/grid-list";

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
    path: 'swipeitems',
    component: SwipeItemsComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MyItemsComponent,
    SwipeItemsComponent,
    BottomMenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatButtonModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
