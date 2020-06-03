import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinentoryComponent } from './addinentory.component';

describe('AddinentoryComponent', () => {
  let component: AddinentoryComponent;
  let fixture: ComponentFixture<AddinentoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddinentoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddinentoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
