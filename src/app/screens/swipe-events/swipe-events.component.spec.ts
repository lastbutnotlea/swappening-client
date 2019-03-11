import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeEventsComponent } from './swipe-events.component';

describe('SwipeEventsComponent', () => {
  let component: SwipeEventsComponent;
  let fixture: ComponentFixture<SwipeEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
