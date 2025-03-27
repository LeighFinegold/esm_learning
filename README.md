# esm-learning

This is a public reference project that demonstrates how to build an ESM-based TypeScript CLI with shared modules with packaging.

## 🧱 Project Structure

```
esm-learning/
├── shared/         # ESM-only shared module
├── cli/            # CLI entry point, bundled to CJS with shebang
├── cli.e2e.spec.ts # Integration test that builds, packs, installs, and runs the CLI
├── tsconfig.base.json
└── package.json    # Uses npm workspaces
```

## 🛠️ Tech Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Tsup](https://tsup.egoist.dev/) for fast, opinionated builds
- [Vitest](https://vitest.dev/) for integration/E2E testing
- npm workspaces for clean module boundaries

## 🚀 Usage

### Build

```bash
npm run build
```

Builds both `shared` and `cli` modules using workspace script.

### Test

```bash
npm run test
```

Runs an integration test that:
- Builds the shared and CLI modules
- Packs the CLI into a `.tgz`
- Installs that `.tgz` into a fresh temp folder
- Executes the CLI via its declared `bin` script

### CLI Output

```bash
Hello, World!
```

## 📝 License

ISC
