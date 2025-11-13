# Plugins Guide

## Installed Plugins

### Authentication
- **Guest Provider**: Default authentication for development
- **GitHub Provider**: OAuth authentication with GitHub

### Core Plugins
- **App Backend**: Serves the frontend application
- **Proxy Backend**: Handles API proxying
- **Catalog Backend**: Software catalog management
- **Scaffolder Backend**: Template scaffolding with GitHub integration
- **TechDocs Backend**: Documentation platform
- **Search Backend**: Search functionality with PostgreSQL engine
- **Permission Backend**: Authorization system (allow-all policy)
- **Notifications Backend**: Event notifications
- **Signals Backend**: Real-time communication

### Integration Plugins
- **Kubernetes Backend**: Kubernetes cluster integration
- **Jenkins Backend**: CI/CD pipeline integration
- **SonarQube Backend**: Code quality analysis

## Configuration

### GitHub Authentication
Set environment variables:
```bash
AUTH_GITHUB_CLIENT_ID=your_client_id
AUTH_GITHUB_CLIENT_SECRET=your_client_secret
```

### Database
Production uses PostgreSQL. 

**Install PostgreSQL driver:**
```bash
yarn --cwd packages/backend add pg
```

**Set environment variables:**
```bash
POSTGRES_HOST=your_host
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
```