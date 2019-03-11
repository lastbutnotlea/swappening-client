import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostedEventDetailsComponent } from './hosted-event-details.component';

describe('HostedEventDetailsComponent', () => {
  let component: HostedEventDetailsComponent;
  let fixture: ComponentFixture<HostedEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostedEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostedEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
