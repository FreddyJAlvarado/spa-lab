import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  irClientes() {
    this.router.navigate(['/clientes']);
  }

  irProductos() {
    this.router.navigate(['/productos']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
