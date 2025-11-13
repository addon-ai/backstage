# Configuración de Google Authentication en Backstage

## Paso 1: Instalar el plugin de Google Auth

```bash
cd packages/backend
yarn add @backstage/plugin-auth-backend-module-google-provider
```

## Paso 2: Crear Google OAuth 2.0 Client

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** > **Credentials**
4. Click en **Create Credentials** > **OAuth client ID**
5. Si es necesario, configura la pantalla de consentimiento OAuth:
   - User Type: External
   - App name: Backstage Local
   - User support email: tu email
   - Developer contact: tu email
6. Selecciona **Application type**: Web application
7. Completa los campos:
   - **Name**: Backstage Local
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:7007/api/auth/google/handler/frame`
8. Click en **Create**
9. Guarda el **Client ID** y **Client Secret**

## Paso 3: Configurar variables de entorno

Actualiza el archivo `.env` en la raíz del proyecto:

```bash
AUTH_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## Paso 4: Configurar app-config.yaml

Agrega la configuración de Google auth:

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
    google:
      development:
        clientId: ${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

## Paso 5: Actualizar backend index.ts

En `packages/backend/src/index.ts`, agrega el módulo de Google provider:

```typescript
// Auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-google-provider'));
```

## Paso 6: Configurar el frontend

En `packages/app/src/App.tsx`, agrega el provider de Google:

```typescript
import { SignInProviderConfig } from '@backstage/core-components';
import { githubAuthApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';

const githubProvider: SignInProviderConfig = {
  id: 'github-auth-provider',
  title: 'GitHub',
  message: 'Sign in using GitHub',
  apiRef: githubAuthApiRef,
};

const googleProvider: SignInProviderConfig = {
  id: 'google-auth-provider',
  title: 'Google',
  message: 'Sign in using Google',
  apiRef: googleAuthApiRef,
};

const app = createApp({
  // ...
  components: {
    SignInPage: props => (
      <SignInPage {...props} auto providers={['guest', githubProvider, googleProvider]} />
    ),
  },
});
```

## Paso 7: Crear usuarios en el catálogo

Actualiza `examples/org.yaml` para incluir usuarios con emails de Google:

```yaml
---
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: john-doe
spec:
  profile:
    displayName: John Doe
    email: john.doe@gmail.com
  memberOf: [guests]
```

## Paso 8: Iniciar Backstage

```bash
yarn start
```

## Verificación

1. Abre http://localhost:3000
2. Deberías ver las opciones:
   - Enter as Guest
   - Sign in using GitHub
   - Sign in using Google
3. Al hacer click en Google, te redirigirá a Google para autorizar
4. Después de autorizar, volverás a Backstage autenticado

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que la Authorized redirect URI en Google Cloud Console sea exactamente: `http://localhost:7007/api/auth/google/handler/frame`

### Error: "Auth provider registered for 'google' is misconfigured"
- Verifica que las variables de entorno estén cargadas correctamente
- Reinicia completamente Backstage después de cambiar la configuración

### Error: "User not found in catalog"
- Asegúrate de que el usuario tenga un email en el catálogo que coincida con el email de Google
- El resolver `emailMatchingUserEntityProfileEmail` busca usuarios por email

## Diferencias entre GitHub y Google Auth

### GitHub Auth
- Usa `usernameMatchingUserEntityName` resolver
- Busca usuarios por nombre de usuario
- Requiere que el nombre del usuario en el catálogo coincida con el username de GitHub

### Google Auth
- Usa `emailMatchingUserEntityProfileEmail` resolver
- Busca usuarios por email
- Requiere que el usuario tenga un email en su perfil del catálogo que coincida con el email de Google

## Configuración de producción

Para producción, cambia `development` por `production` en app-config.yaml y usa URLs de producción:

```yaml
auth:
  providers:
    google:
      production:
        clientId: ${AUTH_GOOGLE_CLIENT_ID}
        clientSecret: ${AUTH_GOOGLE_CLIENT_SECRET}
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

Y actualiza las URLs autorizadas en Google Cloud Console con tus URLs de producción.
