import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1>Pedidos360</h1>
      <p>Sistema de gestión de pedidos — Cloud Native DSY1107</p>

      @if (auth.getAccount()) {
        <p class="welcome">Hola, {{ auth.getUserName() }}</p>
        <div class="actions">
          <a routerLink="/products" class="btn primary">Ver productos</a>
          <a routerLink="/orders" class="btn">Mis pedidos</a>
        </div>
      } @else {
        <button type="button" class="btn primary" (click)="auth.login()">
          Iniciar sesión con Azure AD
        </button>
      }
    </section>
  `,
  styles: `
    .hero {
      text-align: center;
      padding: 3rem 1rem;
    }
    .welcome { color: #555; margin: 1rem 0; }
    .actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: 1px solid #2563eb;
      background: #fff;
      color: #2563eb;
      text-decoration: none;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn.primary { background: #2563eb; color: #fff; border-color: #2563eb; }
  `,
})
export class HomeComponent {
  readonly auth = inject(AuthService);
}
