# Pedidos360 Frontend

Frontend Angular 19 con **MSAL** (Azure AD) para el curso DSY1107 — Desarrollo Cloud Native I.

## Requisitos

- Node.js 20+
- Tenant Azure AD configurado (ver `../pedidos360-backend/docs/AZURE_AD_SETUP.md`)

## Configuración

1. Copia `src/environments/environment.local.example.ts` → `environment.local.ts`
2. Reemplaza `tenantId`, `clientId` y `apiScope` con tus valores de Azure
3. O edita directamente `environment.development.ts`

## Ejecución

```powershell
cd pedidos360-frontend
npm install
npm start
```

Abre http://localhost:4200

## Flujo

1. **Inicio** → botón "Iniciar sesión con Azure AD" (Authorization Code + PKCE vía MSAL)
2. **Productos / Pedidos** → rutas protegidas con `MsalGuard`
3. **API** → `MsalInterceptor` adjunta el access token al BFF (`http://localhost:8080/api/*`)

## Estructura

```
src/app/
├── auth/msal.config.ts      # MSAL instance, interceptor, guard
├── core/services/           # AuthService, ApiService
├── core/guards/             # authGuard (legacy; rutas usan MsalGuard)
└── pages/                   # home, products, orders
```
