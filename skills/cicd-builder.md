---
name: CI/CD Builder
version: 1.0.0
author: newth.ai
category: development
tags:
  - cicd
  - github-actions
  - automation
  - devops
compatibility:
  - gemini
  - claude
  - cursor
  - windsurf
  - copilot
---

# CI/CD Builder

Create CI/CD pipelines and automation workflows for GitHub Actions, GitLab CI, and other platforms. Build multi-stage pipelines, deployment automation, testing integration, and code quality checks with best practices for modern DevOps.

## Triggers

Use this skill when the user requests:
- CI/CD pipeline setup or configuration
- GitHub Actions workflows
- GitLab CI/CD pipelines
- Automated testing or deployment
- Build automation
- Release workflows
- Code quality automation
- DevOps workflow setup

Keywords: "CI/CD", "pipeline", "GitHub Actions", "GitLab CI", "automation", "deploy", "workflow", "continuous integration", "continuous deployment", "build", "test automation"

## Features

- **GitHub Actions Workflows**: Create comprehensive workflows with jobs, steps, and matrix builds
- **GitLab CI Configuration**: Build .gitlab-ci.yml files with stages, jobs, and deployment strategies
- **Multi-Stage Pipelines**: Design complex pipelines with dependencies, conditions, and parallel execution
- **Deployment Automation**: Set up automated deployments to various platforms (Vercel, AWS, Docker, etc.)
- **Testing Integration**: Configure automated test runs, coverage reports, and quality gates
- **Environment Management**: Handle multiple environments (dev, staging, production) with proper secrets

## Usage Examples

### GitHub Actions - Node.js CI/CD

```yaml
name: Node.js CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
      
      - name: Build
        run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: npm run deploy
```

### Docker Build and Push

```yaml
name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: myorg/myapp
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=registry,ref=myorg/myapp:buildcache
          cache-to: type=registry,ref=myorg/myapp:buildcache,mode=max
```

### GitLab CI - Python Application

```yaml
stages:
  - test
  - build
  - deploy

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip
    - venv/

test:
  stage: test
  image: python:3.11
  before_script:
    - python -m venv venv
    - source venv/bin/activate
    - pip install -r requirements.txt
  script:
    - pytest --cov=app tests/
    - pylint app/
  coverage: '/TOTAL.*\s+(\d+%)$/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  only:
    - main
    - tags

deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
  script:
    - ssh user@staging-server "docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
    - ssh user@staging-server "docker-compose up -d"
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
  script:
    - ssh user@prod-server "docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
    - ssh user@prod-server "docker-compose up -d"
  environment:
    name: production
    url: https://example.com
  only:
    - tags
  when: manual
```

### Release Workflow with Semantic Versioning

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

### Matrix Testing Across Multiple Platforms

```yaml
name: Cross-Platform Tests

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        include:
          - os: ubuntu-latest
            node: 22
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

## Best Practices

### Secrets Management
- Always use repository secrets for sensitive data (API keys, tokens, passwords)
- Never commit secrets to your repository
- Use environment-specific secrets for different deployment targets
- Rotate secrets regularly

### Workflow Optimization
- Use caching for dependencies to speed up builds
- Run tests in parallel when possible using matrix strategies
- Use conditions (`if:`) to skip unnecessary jobs
- Leverage job dependencies to create efficient pipelines

### Security
- Pin action versions using SHA instead of tags for security
- Use minimal permissions with GITHUB_TOKEN
- Scan for vulnerabilities in dependencies
- Use trusted, well-maintained actions from verified creators

### Testing Strategy
- Run unit tests on every push
- Run integration tests before deployment
- Generate and track code coverage
- Use quality gates to block merges with failing tests

### Deployment Safety
- Always test before deploying
- Use staging environments
- Implement manual approval for production deployments
- Include rollback mechanisms
- Use blue-green or canary deployment strategies for zero-downtime updates

## Common Patterns

### Conditional Deployment
Only deploy on main branch:
```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

### Dependency Between Jobs
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # ... build steps
  
  deploy:
    needs: build  # Wait for build to succeed
    runs-on: ubuntu-latest
    # ... deploy steps
```

### Reusable Workflows
```yaml
# .github/workflows/reusable-test.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci && npm test
```

```yaml
# .github/workflows/main.yml
jobs:
  call-test:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
```

## Platform-Specific Features

### GitHub Actions
- Artifact storage and sharing between jobs
- GitHub Packages integration
- GitHub Environments with protection rules
- Workflow dispatch for manual triggers
- Composite actions for reusability

### GitLab CI
- Auto DevOps for automatic pipeline generation
- Review Apps for preview deployments
- Container Registry integration
- GitLab Pages deployment
- Merge request pipelines

## Troubleshooting

### Workflow Not Triggering
- Check branch protection rules
- Verify the `on:` trigger conditions
- Ensure the workflow file is in `.github/workflows/`
- Check file permissions (workflows must be readable)

### Failing Tests
- Review test logs in the Actions/CI tab
- Run tests locally to reproduce issues
- Check for environment-specific issues
- Verify all required secrets are configured

### Deployment Issues
- Confirm all deployment secrets are set
- Check network connectivity and firewall rules
- Verify deployment target is accessible
- Review deployment logs for specific errors

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Semantic Release](https://github.com/semantic-release/semantic-release)
