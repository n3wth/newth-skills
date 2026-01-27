---
name: Monorepo Manager
version: 1.0.0
author: newth.ai
category: development
tags:
  - monorepo
  - turborepo
  - nx
  - workspaces
  - build-optimization
compatibility:
  - gemini
  - claude
  - cursor
  - windsurf
  - copilot
---

# Monorepo Manager

Comprehensive guide for managing monorepo workspaces with Turborepo, Nx, or pnpm workspaces. Master build caching, dependency management, and package publishing workflows for scalable monorepo development.

## Triggers

Use this skill when the user wants to:
- Set up a new monorepo with Turborepo, Nx, or pnpm workspaces
- Optimize build times with caching strategies
- Manage shared packages and libraries
- Handle cross-package dependencies
- Set up package publishing workflows
- Configure CI/CD for monorepos
- Migrate to a monorepo structure

Keywords: "monorepo", "turborepo", "nx", "pnpm workspace", "build cache", "workspace", "package management"

## Monorepo Architecture Overview

```
monorepo/
├── apps/
│   ├── web/           # Next.js app
│   ├── mobile/        # React Native app
│   └── api/           # Express API
├── packages/
│   ├── ui/            # Shared UI components
│   ├── utils/         # Shared utilities
│   └── config/        # Shared configs
├── turbo.json         # Turborepo config
├── pnpm-workspace.yaml
└── package.json
```

## Usage Examples

### Turborepo Setup

```bash
# Create new Turborepo monorepo
npx create-turbo@latest

# Or add to existing repo
npm install turbo --save-dev
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "cache": true
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  },
  "remoteCache": {
    "signature": true
  }
}
```

### pnpm Workspaces Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tools/*'
```

```json
// package.json (root)
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^1.11.0"
  },
  "packageManager": "pnpm@8.15.0"
}
```

### Workspace Package Dependencies

```json
// apps/web/package.json
{
  "name": "@myorg/web",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@myorg/ui": "workspace:*",
    "@myorg/utils": "workspace:^1.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@myorg/config": "workspace:*"
  }
}
```

### Shared Package Setup

```json
// packages/ui/package.json
{
  "name": "@myorg/ui",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  }
}
```

### Nx Workspace Setup

```bash
# Create Nx workspace
npx create-nx-workspace@latest

# Add Nx to existing monorepo
npx nx@latest init
```

```json
// nx.json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"]
    },
    "lint": {
      "cache": true,
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.base.json"]
  }
}
```

### CI/CD with Turborepo

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Setup Turbo cache
        uses: actions/cache@v3
        with:
          path: .turbo
          key: ${{ runner.os }}-turbo-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-turbo-
      
      - run: pnpm build
      - run: pnpm test
      - run: pnpm lint
```

### Remote Caching with Vercel

```bash
# Link to Vercel remote cache
npx turbo login
npx turbo link

# Or use environment variable
export TURBO_TOKEN="your-token"
export TURBO_TEAM="your-team"
```

### Package Publishing with Changesets

```bash
# Install changesets
pnpm add -Dw @changesets/cli
pnpm changeset init
```

```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@myorg/web"]
}
```

```bash
# Create changeset
pnpm changeset

# Version packages
pnpm changeset version

# Publish packages
pnpm changeset publish
```

## Best Practices

### Dependency Management
1. Use workspace protocol (`workspace:*`) for internal dependencies
2. Hoist common dependencies to root when possible
3. Use `pnpm-workspace.yaml` to define workspace boundaries
4. Lock versions with `pnpm-lock.yaml` and commit it

### Build Optimization
1. Configure proper `outputs` in turbo.json for caching
2. Use `dependsOn` to define task dependencies
3. Enable remote caching for faster CI builds
4. Use `--filter` to run tasks for specific packages
5. Leverage incremental builds where possible

### Code Organization
1. Keep shared code in `packages/`
2. Apps in `apps/` should be deployment units
3. Use consistent naming conventions (@org/package-name)
4. Separate dev tools into `tools/` directory

### CI/CD Strategies
1. Use Turborepo's built-in caching in CI
2. Run affected tasks only with `--filter=[HEAD^1]`
3. Set up remote caching for team collaboration
4. Use GitHub Actions cache for node_modules

### Version Management
1. Use changesets for coordinated version bumps
2. Follow semantic versioning
3. Keep internal packages at same major version when possible
4. Automate releases with CI/CD

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
# or with Turborepo
turbo run build

# Build specific package
turbo run build --filter=@myorg/ui

# Build package and its dependencies
turbo run build --filter=@myorg/ui...

# Build packages affected by changes
turbo run build --filter=[HEAD^1]

# Run dev mode for all apps
turbo run dev --parallel

# Run tests
turbo run test

# Add dependency to specific package
pnpm add react --filter @myorg/web

# Add dev dependency to root
pnpm add -Dw prettier

# Clean all build artifacts
turbo run clean
pnpm -r exec rm -rf dist .next build

# Check workspace
pnpm list -r --depth 0
```

## Troubleshooting

### Cache Issues
```bash
# Clear Turbo cache
rm -rf .turbo

# Force rebuild without cache
turbo run build --force
```

### Dependency Resolution
```bash
# Deduplicate dependencies
pnpm dedupe

# Check for phantom dependencies
pnpm install --strict-peer-dependencies
```

### Build Failures
- Check task dependencies in turbo.json
- Verify `outputs` configuration
- Ensure workspace dependencies use `workspace:` protocol
- Check that builds happen in correct order

## Dependencies

```bash
# Turborepo
pnpm add -Dw turbo

# pnpm (package manager)
npm install -g pnpm

# Nx (alternative)
pnpm add -Dw nx

# Changesets (versioning)
pnpm add -Dw @changesets/cli
```

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Nx Documentation](https://nx.dev/)
- [Changesets](https://github.com/changesets/changesets)
