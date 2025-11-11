import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReflectionService } from '../../core/services/reflection.service';
import { Router } from '@angular/router';

export interface MemoryTile {
  id: string;
  date: string;
  sentiment: keyof typeof SENTIMENT_MAP;
  highlights?: string[];
  summary?: string;
  habitImpact?: string[];
  rowSpan?: number;
}

export const SENTIMENT_MAP = {
  positive: { label: 'Positive', color: 'bg-green-200', emoji: '😊' },
  neutral: { label: 'Neutral', color: 'bg-gray-200', emoji: '😐' },
  negative: { label: 'Negative', color: 'bg-red-200', emoji: '😞' },
  reflective: { label: 'Reflective', color: 'bg-blue-200', emoji: '🤔' },
  excited: { label: 'Excited', color: 'bg-yellow-200', emoji: '🤩' }
} as const;

@Component({
  selector: 'app-memory-tiles',
  templateUrl: './memory-tiles.component.html',
  styleUrls: ['./memory-tiles.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class MemoryTilesComponent implements OnInit {
  constructor(private reflectionService: ReflectionService, private el: ElementRef, private router: Router) {}

  SENTIMENT_MAP = SENTIMENT_MAP;
  initialTiles: MemoryTile[] = [];

  private WEEKLY_LAYOUT = [7, 4, 4, 6, 5, 7, 4];
  private MONTHLY_LAYOUT = [
    5, 4, 4, 3, 5, 3, 4,
    5, 4, 3, 3, 5, 3, 4,
    5, 3, 4, 3, 5, 3, 5,
    5, 3, 3, 4, 5, 3, 5,
    5, 3, 4, 3, 5, 3, 5,
    5, 3, 4, 3, 4, 3, 5,
  ];
  

  viewMode: 'weekly' | 'monthly' = 'weekly';
  sentimentFilter: string = 'all';
  query: string = '';
  selected: MemoryTile | null = null;

  @ViewChild('tilesContainer', { static: false }) tilesContainer!: ElementRef<HTMLDivElement>;

 

  ngOnInit() {
    this.loadTiles();
    // mock data
  //    this.initialTiles = [
  //   {
  //     id: '1',
  //     date: '2025-10-30',
  //     sentiment: 'positive',
  //     highlights: ['Completed project', 'Helped a colleague'],
  //     summary: 'Felt productive and happy today. Managed to finish key tasks.',
  //     habitImpact: ['Meditation', 'Exercise']
  //   },
  //   {
  //     id: '2',
  //     date: '2025-10-29',
  //     sentiment: 'reflective',
  //     highlights: ['Thought about career goals'],
  //     summary: 'Spent time reflecting on what I want to achieve next month.',
  //     habitImpact: []
  //   },
  //   {
  //     id: '3',
  //     date: '2025-10-28',
  //     sentiment: 'negative',
  //     highlights: ['Missed deadline', 'Procrastinated'],
  //     summary: 'Had a tough day with distractions and missed deadlines.',
  //     habitImpact: ['Exercise']
  //   },
  //   {
  //     id: '4',
  //     date: '2025-10-27',
  //     sentiment: 'excited',
  //     highlights: [],
  //     summary: 'Excited about new game project and learned cool Unity stuff.',
  //     habitImpact: ['Coding']
  //   },
  //   {
  //     id: '5',
  //     date: '2025-10-26',
  //     sentiment: 'neutral',
  //     highlights: ['Routine work'],
  //     summary: 'Nothing special, just regular work and tasks.',
  //     habitImpact: []
  //   },
  //   {
  //     id: '6',
  //     date: '2025-10-24',
  //     sentiment: 'positive',
  //     highlights: ['Completed project', 'Helped a colleague'],
  //     summary: 'Felt productive and happy today. Managed to finish key tasks.',
  //     habitImpact: ['Meditation', 'Exercise']
  //   },
  //   {
  //     id: '7',
  //     date: '2025-10-22',
  //     sentiment: 'reflective',
  //     highlights: ['Thought about career goals'],
  //     summary: 'Spent time reflecting on what I want to achieve next month.',
  //     habitImpact: []
  //   },
  //   {
  //     id: '8',
  //     date: '2025-10-21',
  //     sentiment: 'negative',
  //     highlights: ['Missed deadline', 'Procrastinated'],
  //     summary: 'Had a tough day with distractions and missed deadlines.',
  //     habitImpact: ['Exercise']
  //   },
  //   {
  //     id: '9',
  //     date: '2025-10-19',
  //     sentiment: 'excited',
  //     highlights: ['Game idea brainstorm', 'Learned new Unity trick'],
  //     summary: 'Excited about new game project and learned cool Unity stuff.',
  //     habitImpact: ['Coding']
  //   },
  //   {
  //     id: '10',
  //     date: '2025-10-12',
  //     sentiment: 'neutral',
  //     highlights: ['Routine work'],
  //     summary: 'Nothing special, just regular work and tasks.',
  //     habitImpact: []
  //   }
  // ];

    this.initialTiles.forEach(t => {
      let base = 8; // default rowSpan

      if ((t.highlights?.length || 0) >= 2) base += 2;      // highlights check
      if ((t.summary?.length || 0) > 80) base += 2;         // long summary
      if ((t.habitImpact?.length || 0) > 0) base += 2;      // habit impact

      t.rowSpan = base;
    });
  }

  getEmojiSize(tile: MemoryTile) {
    if ((tile.highlights?.length || 0) >= 2) return 28; // lots of highlights → slightly smaller emoji
    if ((tile.summary?.length || 0) < 50) return 36; // short summary → bigger emoji
    return 24; // default
  }



  get tiles(): MemoryTile[] {
    return this.initialTiles
      .filter(t => this.sentimentFilter === 'all' ? true : t.sentiment === this.sentimentFilter)
      .filter(t => {
        if (!this.query.trim()) return true;
        const q = this.query.toLowerCase();
        return (
          t.summary?.toLowerCase().includes(q) ||
          (t.highlights || []).some(h => h.toLowerCase().includes(q)) ||
          t.date.includes(q)
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }



  get stats() {
    const counts: Record<string, number> = {
      positive: 0, neutral: 0, negative: 0, reflective: 0, excited: 0
    };
    for (const t of this.initialTiles) counts[t.sentiment] = (counts[t.sentiment] || 0) + 1;
    return counts;
  }

  formatDate(date: string): string {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  closeModal() { this.selected = null; }

  pinTile() { alert('Pin/Share action (implement)'); }

  promptReflect(tile: MemoryTile) {
    const confirmReflect = confirm(`No reflection found for ${this.formatDate(tile.date)}. Reflect now?`);
    if (confirmReflect) {
      this.router.navigate(['/reflections/voice'], { 
        queryParams: { date: tile.date } 
      });
    }
  }


  isFutureDate(dateStr: string): boolean {
    const today = new Date();
    const tileDate = new Date(dateStr + 'T00:00:00');
    return tileDate > today;
  }



  loadTiles() {
    const today = new Date();
    let from: Date;
    let to: Date;

    const startOfWeek = (date: Date) => {
      const day = date.getDay(); // 0 = Sunday
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff);
      monday.setHours(0,0,0,0);
      return monday;
    };

    const endOfWeek = (date: Date) => {
      const monday = startOfWeek(date);
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
      sunday.setHours(23,59,59,999);
      return sunday;
    };

    const startOfMonth = (date: Date) => {
      const first = new Date(date.getFullYear(), date.getMonth(), 1);
      first.setHours(0,0,0,0);
      return first;
    };

    const endOfMonth = (date: Date) => {
      const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      last.setHours(23,59,59,999);
      return last;
    };

    if (this.viewMode === 'weekly') {
      from = startOfWeek(today);
      to = endOfWeek(today);
    } else {
      from = startOfMonth(today);
      to = endOfMonth(today);
    }


    // Generate all dates (immutable)
    const formatLocalDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const allDates: string[] = [];
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      allDates.push(formatLocalDate(d));
    }

    this.reflectionService.fetchReflectionsInRange(from, to).subscribe(insights => {
      const mapped: Record<string, MemoryTile> = {};
      insights.forEach(i => {
        const analysis = JSON.parse(i.analysis || '{}');
        const highlights = i.highlights?.split('|').map(h => h.trim()) || [];
        const sentiment = analysis.sentiment in SENTIMENT_MAP ? analysis.sentiment : 'neutral';

        mapped[i.date.toString()] = {
          id: i.reflectionId.toString(),
          date: i.date.toString(),
          sentiment,
          highlights,
          summary: this.summarizeAnalysis(analysis),
          habitImpact: analysis.completedHabits || []
        };
      });

      this.initialTiles = allDates.map((dateStr, idx) => {
        const tile = mapped[dateStr] || {
          id: `empty-${dateStr}`,
          date: dateStr,
          sentiment: null,
          highlights: [],
          summary: '',
          habitImpact: []
        };

        tile.rowSpan = this.computeTileHeight(tile, idx); // pass idx here

        return tile;
      });
    });
  }


  computeTileHeight(tile: MemoryTile, idx?: number): number {
    let base = this.viewMode === 'weekly' 
      ? this.WEEKLY_LAYOUT[idx || 0] 
      : this.MONTHLY_LAYOUT[idx || 0];

    const contentRows = Math.ceil((tile.summary?.length || 0) / 50) 
                        + (tile.highlights?.length || 0) 
                        + (tile.habitImpact?.length || 0);

    return contentRows !== 0 ? Math.min(contentRows, 10) : Math.min(base, 10);
  }




  summarizeAnalysis(analysis: any): string {
    const tone = analysis.tone ? `Tone: ${analysis.tone}` : '';
    const blockers = analysis.blockers?.length ? `Blocked by ${analysis.blockers?.join(', ')}` : '';
    const timeWasters = analysis.timeWasters?.length ? `Wasted time on ${analysis.timeWasters?.join(', ')}` : '';
    const habits = analysis.completedHabits?.length ? `Habits done: ${analysis.completedHabits?.join(', ')}` : '';
    return [tone, blockers, timeWasters, habits].filter(Boolean).join('. ');
  }

  // getRandomHeight(tile: MemoryTile): number {
  //   // Random height between 120px and 300px
  //   return 120 + Math.floor(Math.random() * 180);
  // }

  setViewMode(mode: 'weekly' | 'monthly') {
    if (this.viewMode !== mode) {
      this.viewMode = mode;
      this.loadTiles(); // reload based on new range
    }
  }



}
