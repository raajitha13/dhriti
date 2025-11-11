import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReflectionService } from '../../../core/services/reflection.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reflection-voice-page',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './reflection-voice-page.component.html',
  styleUrls: ['./reflection-voice-page.component.scss'],
})
export class ReflectionVoicePageComponent {

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private source!: MediaStreamAudioSourceNode;


  recording = false;
  processing = false;
  errorState = false;
  transcript = '';
  recognition: any;
  waveformBars: number[] = Array(20).fill(0); // 20 bars
  private waveInterval: any;
  reflectionDate?: string;

  constructor(
    private reflectionService: ReflectionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.startRecording();
    this.route.queryParams.subscribe(params => {
      this.reflectionDate = params['date'] || null;
      console.log('Reflecting for date:', this.reflectionDate || 'today');
    });
  }

  startRecording() {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        this.snackBar.open('Speech Recognition not supported.', 'Close', { duration: 3000 });
        this.errorState = true;
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.continuous = true;

      this.recording = true;
      this.errorState = false;
      this.processing = false;
      this.transcript = '';

      // Animate waveform
      this.startWaveformAnimation();

      this.recognition.onresult = (event: any) => {
        this.transcript = event.results[0][0].transcript;
      };

      this.recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        this.snackBar.open('Recording error occurred.', 'Close', { duration: 2500 });
        this.recording = false;
        this.errorState = true;
        this.stopWaveformAnimation();
      };

      this.recognition.onend = () => {
        this.stopWaveformAnimation();
        if (!this.transcript && !this.errorState) {
          this.snackBar.open('No voice detected. Try again.', 'Close', { duration: 2000 });
          this.recording = false;
          this.errorState = true;
        }
      };

      this.recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      this.snackBar.open('Unable to access microphone.', 'Close', { duration: 2500 });
      this.errorState = true;
    }
  }

  stopRecording() {
    if (this.recording && this.recognition) {
      this.recognition.stop();
      this.recording = false;
      this.processing = true;

      setTimeout(() => this.submitReflection(), 1200); // simulate processing
    }
  }

  retryRecording() {
    this.errorState = false;
    this.startRecording();
  }

  submitReflection() {
    if (!this.transcript.trim()) {
      this.processing = false;
      this.errorState = true;
      return;
    }

    this.reflectionService.completeReflection(this.transcript, false, this.reflectionDate).subscribe({
      next: () => {
        this.processing = false;
        this.snackBar.open('Reflection saved successfully ✨', 'Close', { duration: 2500 });
        setTimeout(() => this.router.navigate(['/habits/dashboard']), 1000);
      },
      error: (err) => {
        console.error('Error saving reflection:', err);
        console.log("Transcript:", this.transcript);
        this.processing = false;
        this.errorState = true;
        this.snackBar.open('Failed to save reflection. Try again.', 'Close', { duration: 2000 });
      },
    });
  }

 private startWaveformAnimation() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256; // higher = smoother wave
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.source = this.audioContext.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const animate = () => {
        if (!this.recording) return;

        this.analyser.getByteTimeDomainData(this.dataArray as any);
        
        // Map time-domain data to bars (normalize 0–1, then scale)
        this.waveformBars = Array.from({ length: 20 }, (_, i) => {
        const idx = Math.floor(i * this.dataArray.length / 20);
        const value = this.dataArray[idx]; // 0–255
        // Normalize 0–1 and scale to bar container height
        return Math.max((value / 128) * 50, 5); // ensure min height of 5px
      });


      requestAnimationFrame(animate);
    };

    animate();
  }).catch(err => {
    console.error('Mic access error', err);
  });
}



  private stopWaveformAnimation() {
    this.waveformBars = Array(20).fill(0);
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

}
