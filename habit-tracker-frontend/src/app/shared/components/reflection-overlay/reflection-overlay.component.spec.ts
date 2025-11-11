import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflectionOverlayComponent } from './reflection-overlay.component';

describe('ReflectionDialogComponent', () => {
  let component: ReflectionOverlayComponent;
  let fixture: ComponentFixture<ReflectionOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReflectionOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
