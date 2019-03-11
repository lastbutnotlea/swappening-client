import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostedEventsComponent } from './hosted-events.component';

describe('HostedEventsComponent', () => {
  let component: HostedEventsComponent;
  let fixture: ComponentFixture<HostedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostedEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
