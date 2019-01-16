import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedEventDetailsComponent } from './liked-event-details.component';

describe('LikedEventDetailsComponent', () => {
  let component: LikedEventDetailsComponent;
  let fixture: ComponentFixture<LikedEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikedEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
