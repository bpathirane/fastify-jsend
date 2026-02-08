# CLAUDE.md

## Project Overview

**fastify-jsend** is a Fastify plugin that decorates the `Reply` object with methods to send [JSend](https://github.com/omniti-labs/jsend)-compliant JSON responses. It wraps the `jsend` npm package and exposes four convenience methods on every Fastify reply.

- **Version:** 1.0.2
- **License:** MIT
- **Entry point:** `index.js`

## Repository Structure

```
/
├── index.js          # Plugin source (single file, ~44 lines)
├── test.js           # Full test suite (TAP, ~298 lines, 11 tests)
├── package.json      # Project manifest and scripts
├── package-lock.json # Dependency lock file
├── .gitignore        # Ignores node_modules, .nyc_output
├── .travis.yml       # Travis CI config (Node 7, auto-deploy to npm on tags)
├── LICENSE.txt       # MIT license
└── README.md         # User-facing documentation
```

There are no subdirectories for source code. Everything lives at the root.

## Commands

```bash
npm install          # Install dependencies
npm test             # Run tests: tap -R spec ./test.js
npm run lint         # Lint with StandardJS: standard | snazzy
npm run lint-fix     # Auto-fix lint issues: standard --fix
```

## Architecture

### Plugin (`index.js`)

The plugin uses `fastify-plugin` to register four reply decorators:

| Method | Purpose |
|---|---|
| `reply.jsend(payload)` | Auto-routes: calls `jsendSuccess` for non-Error payloads, `jsendError` for Error instances |
| `reply.jsendSuccess(payload)` | Sends `{ status: 'success', data: payload }` |
| `reply.jsendFail(payload)` | Sends `{ status: 'fail', data: payload }` |
| `reply.jsendError(payload, options?)` | Sends `{ status: 'error', message, code?, data? }` |

The `jsendError` method extracts `message`, `code`, and `data` from the payload object (or Error). An optional second argument can override `code` and `data`. When no error message is provided, the default is `"Unknown error - (fastify-jsend)"`.

### Dependencies

- **Production:** `jsend` (^1.0.2) - core JSend formatting
- **Dev:** `fastify` (^5.2.0), `fastify-plugin` (^1.5.0), `tap` (^12.5.3), `standard` (^12.0.1), `snazzy` (^8.0.0)

## Code Conventions

- **Style:** StandardJS (no semicolons, single quotes, 2-space indent, no trailing commas)
- **Strict mode:** All files start with `'use strict'`
- **Module system:** CommonJS (`require`/`module.exports`)
- **Variable declarations:** Mix of `const` and `var` in existing code
- **Naming:** camelCase; plugin methods prefixed with `jsend`

## Testing Conventions

- **Framework:** TAP (`tap` package) with spec reporter
- **Pattern:** Each test creates a fresh `Fastify()` instance, registers the plugin, defines a route, and uses `fastify.inject()` for HTTP simulation (no real server needed)
- **Assertions used:** `t.error()`, `t.strictEquals()`, `t.equals()`, `t.looseEquals()`, `t.match()`, `t.notOk()`, `t.end()`
- **Callback style:** Tests use callback-based TAP with `t.end()` (not promise/async)

## CI/CD

Travis CI is configured to:
- Test on Node 7
- Auto-deploy to npm on tagged commits from `bpathirane/fastify-jsend`
