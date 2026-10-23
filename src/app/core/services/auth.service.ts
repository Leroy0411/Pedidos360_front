import { Injectable, inject, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly msal = inject(MsalService);
  readonly roles = signal<string[]>([]);

  login(): void {
    this.msal.loginRedirect({
      scopes: [environment.apiScope],
    });
  }

  logout(): void {
    this.roles.set([]);
    this.msal.logoutRedirect();
  }

  getAccount(): AccountInfo | null {
    const accounts = this.msal.instance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  getUserName(): string {
    const account = this.getAccount();
    return account?.name ?? account?.username ?? 'Usuario';
  }

  refreshRoles(): void {
    const account = this.getAccount();
    if (!account) {
      this.roles.set([]);
      return;
    }

    const idRoles =
      (account.idTokenClaims as { roles?: string[] } | undefined)?.roles ?? [];
    if (idRoles.length > 0) {
      this.roles.set(idRoles);
      return;
    }

    this.msal
      .acquireTokenSilent({
        scopes: [environment.apiScope],
        account,
      })
      .subscribe({
        next: (result) => {
          const payload = this.decodeJwtPayload(result.accessToken);
          this.roles.set((payload['roles'] as string[] | undefined) ?? []);
        },
        error: () => this.roles.set([]),
      });
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  private decodeJwtPayload(token: string): Record<string, unknown> {
    const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!base64) return {};
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  }
}
