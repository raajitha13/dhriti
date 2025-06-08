import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, MatSidenavModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isExpanded = false;
  title = 'habit-tracker-frontend';
  showSidebar = true;

  constructor(private router: Router, private auth: AuthService) {
    this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const hideSidebarRoutes = ['/login', '/register'];
      this.showSidebar = !hideSidebarRoutes.includes(event.urlAfterRedirects);
    });
  }

  goToDashboard(){
    this.router.navigate(['/habits/dashboard']);
  }
  goToAnalytics(){
    this.router.navigate(['/habits/analytics']);
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
