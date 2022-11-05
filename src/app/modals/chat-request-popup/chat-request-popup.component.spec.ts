import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRequestPopupComponent } from './chat-request-popup.component';

describe('ChatRequestPopupComponent', () => {
  let component: ChatRequestPopupComponent;
  let fixture: ComponentFixture<ChatRequestPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRequestPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRequestPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
