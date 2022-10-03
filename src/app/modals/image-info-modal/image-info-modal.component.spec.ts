import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageInfoModalComponent } from './image-info-modal.component';

describe('ImageInfoModalComponent', () => {
  let component: ImageInfoModalComponent;
  let fixture: ComponentFixture<ImageInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
