# akeneo-reference-entity-table-bundle

Symfony PHP bundle that adds a "table" attribute type to Akeneo PIM Enterprise Reference Entities, enabling multi-column/multi-row structured data with typed columns (text, number, simple select, multilingual select). Installed into a host Akeneo EE project via Composer.

## Tech Stack

- **PHP 7.4**, Symfony bundle conventions, Akeneo PIM Enterprise ^5.0
- **PHPSpec 6** (unit), **PHPUnit 8** (integration), **PHPStan 0.12 level 7**, **PHP CodeSniffer 3.5 (PSR-2)**
- **TypeScript / React / JSX** frontend (Akeneo's RequireJS module system)
- **Jest** (frontend unit tests), **tslint**, **prettier**
- **Yarn** for frontend tooling; no webpack config in this bundle (assets compiled by the host app)

## Repository Structure

```
src/                  PHP source — Attribute/, Record/, Property/, Connector/, DependencyInjection/
src/Resources/        config/ (services XML, validation YML, requirejs), public/ (frontend TS/TSX/JS), translations/
spec/                 PHPSpec unit tests (mirrors src/ hierarchy)
tests/                PHPUnit integration tests (tagged services, overridden services, TestKernel)
jest/                 Jest frontend tests (mirrors src/Resources/public/ hierarchy)
.github/workflows/    CI: backend-tests, backend-analysis, frontend-tests, frontend-analysis
```

## Local Development

This is a library bundle — it has no standalone runtime. Development requires a host Akeneo PIM EE project.

**PHP dependencies:**

```bash
composer install
```

**Frontend dependencies:**

```bash
yarn install
```

No `.env.example` — the bundle itself needs no environment variables. The host application requires Akeneo EE credentials to install.

## Build / Test / Lint

No Makefile or `.make-rules/` — use the scripts directly.

### PHP

```bash
# Unit tests (PHPSpec)
vendor/bin/phpspec run

# Integration tests (PHPUnit)
vendor/bin/phpunit

# Static analysis
vendor/bin/phpstan analyse --configuration phpstan.neon.dist

# Code style check
vendor/bin/phpcs --standard=PSR2 src/

# Lint
vendor/bin/phplint src/
```

### Frontend

```bash
# Unit tests
yarn jest

# TypeScript unused exports check
yarn ts-unused-exports tsconfig.json

# Linting
yarn tslint --project tsconfig.json

# Code style check
yarn prettier --check "**/*.{ts,tsx}"

# Auto-fix formatting
yarn prettier --write "**/*.{ts,tsx}"
```

## Conventions

- **Commits**: Conventional Commits — `feat:`, `fix:`, `chore:`, etc.
- **PHP style**: PSR-2 enforced by phpcs; strict types expected per project rules
- **PHPStan level 7** — custom type alias `tablePropertyArray` defined in `phpstan.neon.dist`
- **Frontend module paths**: TypeScript path aliases in `tsconfig.json` map `@akeneo-pim-community/*` and `@akeneo-pim-enterprise/*` to Akeneo EE packages — these resolve in the host app at runtime
- **Service tags**: All services in `src/Resources/config/reference_entity.xml` use Akeneo-specific interface tags; adding new handlers requires both the class and a tagged service entry
- **PHPSpec**: Spec files live in `spec/` and mirror the `src/` namespace; run with `phpspec run`
- **Jest config**: Tests live in `jest/` and are matched by `**/jest/**/*.test.(js|ts|tsx)`

## Gotchas / Notes

- CI workflows require an SSH key with access to the Akeneo EE Composer repository — local `phpunit` integration tests will fail without a working Akeneo EE installation available
- `phpstan.neon.dist` is the distributed config — copy or extend it if customizing analysis locally
- Frontend assets are not compiled by this bundle; they are registered via RequireJS (`requirejs.yml`) and compiled by the host Akeneo application
- Akeneo EE ^5.0 is the only supported version — no compatibility with CE or other major versions is expressed in `composer.json`
- Coverage reports output to `build/` (clover XML + HTML) for both PHPSpec and PHPUnit
