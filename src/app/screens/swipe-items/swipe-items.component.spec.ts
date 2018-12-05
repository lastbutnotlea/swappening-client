import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeItemsComponent } from './swipe-items.component';

describe('SwipeItemsComponent', () => {
  let component: SwipeItemsComponent;
  let fixture: ComponentFixture<SwipeItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
