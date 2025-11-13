# Configuración de GitHub Authentication en Backstage

## Paso 1: Instalar el plugin de GitHub Auth

```bash
cd packages/backend
yarn add @backstage/plugin-auth-backend-module-github-provider
```

## Paso 2: Crear GitHub OAuth App

1. Ve a https://github.com/settings/developers
2. Click en "New OAuth App"
3. Completa los campos:
   - **Application name**: Backstage Local
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:7007/api/auth/github/handler/frame`
4. Guarda el **Client ID** y **Client Secret**

## Paso 3: Configurar variables de entorno

Crea o actualiza el archivo `.env` en la raíz del proyecto:

```bash
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=backstage
AUTH_GITHUB_CLIENT_ID=tu_client_id
AUTH_GITHUB_CLIENT_SECRET=tu_client_secret
AUTH_GITHUB_TOKEN=tu_github_token
```

## Paso 4: Configurar app-config.yaml

Agrega la configuración de GitHub auth:

```yaml
auth:
  providers:
    guest: {}
    github:
      development:
        clientId: ${AUTH_GITHUB_CLIENT_ID}
        clientSecret: ${AUTH_GITHUB_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: usernameMatchingUserEntityName
```

## Paso 5: Actualizar backend index.ts

En `packages/backend/src/index.ts`, agrega el módulo de GitHub provider:

```typescript
// Auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
```

## Paso 6: Configurar el frontend

En `packages/app/src/App.tsx`, agrega el provider de GitHub:

```typescript
import { SignInProviderConfig } from '@backstage/core-components';
import { githubAuthApiRef } from '@backstage/core-plugin-api';

const githubProvider: SignInProviderConfig = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message: 'Sign in using GitHub',
  apiRef: githubAuthApiRef,
};

const app = createApp({
  // ...
  components: {
    SignInPage: props => <SignInPage {...props} auto providers={['guest', githubProvider]} />,
  },
});
```

## Paso 7: Cargar variables de entorno

Crea `packages/backend/src/env.ts`:

```typescript
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../.env') });
```

Importa en `packages/backend/src/index.ts`:

```typescript
import './env';
import { createBackend } from '@backstage/backend-defaults';
```

## Paso 8: Iniciar Backstage

```bash
yarn start
```

## Verificación

1. Abre http://localhost:3000
2. Deberías ver la opción de "Sign in using GitHub"
3. Al hacer click, te redirigirá a GitHub para autorizar
4. Después de autorizar, volverás a Backstage autenticado

## Troubleshooting

### Error: "redirect_uri is not associated with this application"
- Verifica que la Authorization callback URL en GitHub sea exactamente: `http://localhost:7007/api/auth/github/handler/frame`

### Error: "Auth provider registered for 'github' is misconfigured"
- Verifica que las variables de entorno estén cargadas correctamente
- Reinicia completamente Backstage después de cambiar la configuración

### Error: "Unknown auth provider 'github'"
- Asegúrate de que el módulo esté agregado en `packages/backend/src/index.ts`
- Reinicia el backend
