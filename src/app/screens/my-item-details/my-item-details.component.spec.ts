import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyItemDetailsComponent } from './my-item-details.component';

describe('MyItemDetailsComponent', () => {
  let component: MyItemDetailsComponent;
  let fixture: ComponentFixture<MyItemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyItemDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
