import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKundliComponent } from './user-kundli.component';

describe('UserKundliComponent', () => {
  let component: UserKundliComponent;
  let fixture: ComponentFixture<UserKundliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserKundliComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserKundliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
