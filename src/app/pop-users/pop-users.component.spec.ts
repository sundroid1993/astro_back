import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUsersComponent } from './pop-users.component';

describe('PopUsersComponent', () => {
  let component: PopUsersComponent;
  let fixture: ComponentFixture<PopUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
