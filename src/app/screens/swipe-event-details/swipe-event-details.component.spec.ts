import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeEventDetailsComponent } from './swipe-event-details.component';

describe('SwipeEventDetailsComponent', () => {
  let component: SwipeEventDetailsComponent;
  let fixture: ComponentFixture<SwipeEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
