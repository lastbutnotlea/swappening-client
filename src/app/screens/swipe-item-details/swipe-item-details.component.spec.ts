import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeItemDetailsComponent } from './swipe-item-details.component';

describe('SwipeItemDetailsComponent', () => {
  let component: SwipeItemDetailsComponent;
  let fixture: ComponentFixture<SwipeItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
