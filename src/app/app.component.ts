import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <a routerLink="/" class="brand">Pedidos360</a>
      <nav>
        <a routerLink="/products" routerLinkActive="active">Productos</a>
        <a routerLink="/orders" routerLinkActive="active">Pedidos</a>
      </nav>
      <div class="user">
        @if (auth.getAccount()) {
          <span>{{ auth.getUserName() }}</span>
          @if (auth.isAdmin()) {
            <span class="badge">ADMIN</span>
          }
          <button type="button" class="btn" (click)="auth.logout()">Salir</button>
        }
      </div>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    .header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #1e3a8a;
      color: #fff;
    }
    .brand {
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      font-size: 1.125rem;
    }
    nav {
      display: flex;
      gap: 1rem;
      flex: 1;
    }
    nav a {
      color: #bfdbfe;
      text-decoration: none;
    }
    nav a.active,
    nav a:hover {
      color: #fff;
    }
    .user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }
    .badge {
      background: #fbbf24;
      color: #78350f;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .btn {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #93c5fd;
      background: transparent;
      color: #fff;
      cursor: pointer;
    }
    main {
      min-height: calc(100vh - 56px);
    }
  `,
})
export class AppComponent implements OnInit {
  private readonly msal = inject(MsalService);
  readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.msal.instance.initialize().then(() => {
      this.msal.instance.handleRedirectPromise().then((result) => {
        if (result?.account) {
          this.msal.instance.setActiveAccount(result.account);
        } else {
          const accounts = this.msal.instance.getAllAccounts();
          if (accounts.length > 0) {
            this.msal.instance.setActiveAccount(accounts[0]);
          }
        }
        this.auth.refreshRoles();
      });
    });
  }
}
