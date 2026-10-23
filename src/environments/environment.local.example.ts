/**
 * Copia este archivo como environment.local.ts y reemplaza con tus valores de Azure.
 * environment.local.ts está en .gitignore.
 */
export const environment = {
  production: false,
  tenantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  redirectUri: 'http://localhost:4200',
  authority: 'https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  apiUrl: 'http://localhost:8080',
  apiScope: 'api://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/access_as_user',
};
