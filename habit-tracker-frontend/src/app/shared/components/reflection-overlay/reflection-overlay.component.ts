import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, AfterViewInit, ViewChild, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-reflection-overlay',
  templateUrl: './reflection-overlay.component.html',
  styleUrls: ['./reflection-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReflectionOverlayComponent implements AfterViewInit {
  @Output() reflectionComplete = new EventEmitter<string>();
  @Output() skip = new EventEmitter<void>();

  @ViewChild('charImg') charImg!: ElementRef;
  @ViewChild('textBox') textBox!: ElementRef;

  username: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const email = this.authService.getUsernameFromToken();
    this.username = email ? email.split('@')[0] : '';
  }

  ngAfterViewInit() {
    const char = this.charImg.nativeElement;
    const text = this.textBox.nativeElement;

    // Initial setup
    gsap.set(char, { opacity: 0, scale: 0.85, x: 150, y: 150 });
    gsap.set(text, { opacity: 0, y: 20 });

    const tl = gsap.timeline();

    // 1️⃣ Character entrance (curved path)
    tl.to(char, {
      duration: 1.8,
      opacity: 1,
      scale: 1,
      ease: 'power3.out',
      motionPath: {
        path: [
          { x: 150, y: 160 },
          { x: 60, y: 50 },
          { x: 0, y: 0 }
        ],
        curviness: 1.5
      }
    });

    // 2️⃣ Add subtle floating idle loop after entrance
    tl.to(char, {
      y: "+=8",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    }, ">-0.8");

    // 3️⃣ Fade in text box slightly delayed
    tl.to(text, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, "-=1.2");
  }

  startVoice() {
    this.router.navigate(['/reflections/voice']);
  }

  startText() {
    this.router.navigate(['/reflections/text']);
  }

  skipPrompt() {
    this.skip.emit();
  }
}
