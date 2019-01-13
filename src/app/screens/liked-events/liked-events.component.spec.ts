import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedEventsComponent } from './liked-events.component';

describe('LikedEventsComponent', () => {
  let component: LikedEventsComponent;
  let fixture: ComponentFixture<LikedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikedEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
