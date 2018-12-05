import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailViewComponent } from './item-detail-view.component';

describe('ItemDetailViewComponent', () => {
  let component: ItemDetailViewComponent;
  let fixture: ComponentFixture<ItemDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
