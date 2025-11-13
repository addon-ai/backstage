/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import './env';
import { createBackend } from '@backstage/backend-defaults';

console.log('AUTH_GITHUB_CLIENT_ID:', process.env.AUTH_GITHUB_CLIENT_ID);
console.log('AUTH_GITHUB_CLIENT_SECRET:', process.env.AUTH_GITHUB_CLIENT_SECRET ? '***SET***' : 'NOT SET');
console.log('AUTH_GITHUB_TOKEN:', process.env.AUTH_GITHUB_TOKEN);
//console.log('AUTH_GOOGLE_CLIENT_ID:', process.env.AUTH_GOOGLE_CLIENT_ID);
//console.log('AUTH_GOOGLE_CLIENT_SECRET:', process.env.AUTH_GOOGLE_CLIENT_SECRET ? '***SET***' : 'NOT SET');

const backend = createBackend();

// Core plugins
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// Auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-auth-backend-module-github-provider'));

// Scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);

// TechDocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// Catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// Permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// Search plugin
backend.add(import('@backstage/plugin-search-backend'));
backend.add(import('@backstage/plugin-search-backend-module-pg'));
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// Kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// Notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-github/alpha'));

backend.start();