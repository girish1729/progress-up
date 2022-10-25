import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UplComponent } from './upl.component';

describe('UplComponent', () => {
  let component: UplComponent;
  let fixture: ComponentFixture<UplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UplComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
