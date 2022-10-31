import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressUpComponent } from './progress-up.component';

describe('ProgressUpComponent', () => {
  let component: ProgressUpComponent;
  let fixture: ComponentFixture<ProgressUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
