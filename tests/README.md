# Tests

Test suite for the Kanban View Obsidian plugin, powered by [Vitest](https://vitest.dev/).

---

## Directory Structure

```text
tests/
  __mocks__/              Obsidian API stubs (manual mock)
  helpers/                Shared test utilities (e.g. mockStateManager)
  integration/            Slow tests that spawn child processes or verify environment
  unit/                   Fast, isolated unit tests grouped by module
    parsers/              Parser round-trip & archive tests
  setup.ts                Global Vitest setup (polyfills, window globals)
  tsconfig.json           TypeScript config for the test tree
  README.md               This file
```

### Conventions

| Principle | Rule |
| --- | --- |
| **Organize by type** | `unit/` for fast isolated tests, `integration/` for slow / environment tests |
| **Mirror `src/` modules** | Unit test subfolders match the source module (e.g. `unit/parsers/` tests `src/parsers/`) |
| **Traceability** | Test names keep the `FT-x.y.z` identifier from the Functional Test document |
| **One concern per file** | Each `.test.ts` covers a single functional area |
| **Alias imports** | Use `src/...` and `tests/...` aliases (defined in `vitest.config.ts`) instead of relative paths |

---

## Running Tests

```bash
# All tests
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# Unit tests only (fast)
npm run test:unit

# Parser unit tests only
npm run test:unit:parsers

# Integration tests only (slow — spawns build, typecheck, npm ls)
npm run test:integration

# With coverage report
npm run test:coverage
```

---

## Adding New Tests

1. **Unit test** -- Create the file under `tests/unit/<module>/` mirroring the `src/` path.
   Example: tests for `src/helpers/util.ts` go in `tests/unit/helpers/util.test.ts`.

2. **Integration test** -- Place in `tests/integration/`.
   Mark with `// @vitest-environment node` if it does not need jsdom.

3. **Shared helpers** -- Add to `tests/helpers/`.

4. **New Obsidian API stubs** -- Extend `tests/__mocks__/obsidian.ts`.

---

## Traceability to Functional Test Document

| Test File | FT IDs | Functional Test Section |
| --- | --- | --- |
| `integration/validate-deps.test.ts` | FT-1.x | Fase 1 -- Dependensi & Toolchain |
| `unit/parsers/roundtrip.test.ts` | FT-2.4.x | Fase 2 -- Parser round-trip fidelity |
| `unit/parsers/archive.test.ts` | FT-4.2.x | Fase 4 -- Archive separator |
