import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MemoryTilesComponent } from './memory-tiles.component';

describe('MemoryTilesComponent', () => {
  let component: MemoryTilesComponent;
  let fixture: ComponentFixture<MemoryTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MemoryTilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MemoryTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show header text', () => {
    const title = fixture.debugElement.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Memory Tiles');
  });

  it('should display mock tiles initially', () => {
    const articles = fixture.debugElement.queryAll(By.css('article'));
    expect(articles.length).toBeGreaterThan(0);
  });

  it('should switch to monthly view', () => {
    const monthlyButton = fixture.debugElement.queryAll(By.css('button'))[1];
    monthlyButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.viewMode).toBe('monthly');
  });

  it('should filter tiles by sentiment', () => {
    component.sentimentFilter = 'positive';
    fixture.detectChanges();
    const filtered = component.tiles.every(t => t.sentiment === 'positive');
    expect(filtered || component.tiles.length === 0).toBeTrue();
  });

  it('should open modal when tile clicked', () => {
    const firstTile = fixture.debugElement.query(By.css('article'));
    firstTile.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.selected).toBeTruthy();

    const modal = fixture.debugElement.query(By.css('.fixed.inset-0'));
    expect(modal).toBeTruthy();
  });

  it('should close modal on close button click', () => {
    // open first
    const firstTile = fixture.debugElement.query(By.css('article'));
    firstTile.triggerEventHandler('click', null);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.queryAll(By.css('button'))
      .find(btn => btn.nativeElement.textContent.includes('Close'));
    closeButton?.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selected).toBeNull();
  });
});
