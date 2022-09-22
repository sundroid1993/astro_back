import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductedchatscallsComponent } from './conductedchatscalls.component';

describe('ConductedchatscallsComponent', () => {
  let component: ConductedchatscallsComponent;
  let fixture: ComponentFixture<ConductedchatscallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConductedchatscallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductedchatscallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
