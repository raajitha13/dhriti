import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflectionTextPageComponent } from './reflection-text-page.component';

describe('ReflectionTextPageComponent', () => {
  let component: ReflectionTextPageComponent;
  let fixture: ComponentFixture<ReflectionTextPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectionTextPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReflectionTextPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
