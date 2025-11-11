import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflectionVoicePageComponent } from './reflection-voice-page.component';

describe('ReflectionVoicePageComponent', () => {
  let component: ReflectionVoicePageComponent;
  let fixture: ComponentFixture<ReflectionVoicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionVoicePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReflectionVoicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
