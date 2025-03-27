# esm-learning

This repo demonstrates how to structure and evolve a modern TypeScript CLI and shared module architecture using npm workspaces, `tsup`, and `npm pack` — **without needing to publish to a registry**.

---

## 📜 Evolution of the Project (Commit History)

### ✅ Commit 1: CLI with Shared Module Bundled

- Created two packages:
    - `cli`: a simple CLI that prints a greeting
    - `shared`: a module exporting `greet(name)`
- `cli` imported `greet` from `@esm_learning/shared`
- Used `tsup` to bundle `shared` into the CLI binary (`noExternal`)
- Packed CLI with `npm pack`
- Integration test installed the `.tgz` and ran the CLI via the `bin` script

> ✅ Good for simple tools, but tightly couples CLI and shared

---

### ✅ Commit 2: CLI and Shared as Separately Publishable Modules

- Promoted `shared` to a standalone, versioned module
- Updated `cli` to treat `@esm_learning/shared` as an external dependency
- Introduced `prepare-publish` script to convert local `"file:../shared"` reference to real semver (`^1.0.0`) before packing
- Created end-to-end integration test that:
    - Packs both `shared` and `cli` into `.tgz` files
    - Simulates two consumers:
        - One imports and uses `@esm_learning/shared`
        - One installs and runs the CLI via `bin`

> ✅ This makes both packages portable, reusable, and testable without publishing to npm

---
## ✅ Commit 3: Dynamic Plugin System in Shared + Custom Consumer Plugin

- Introduced a `Plugin` interface and `PluginLoader` class in `shared`
- Added `runDefaultPlugin()` which loads a built-in plugin via `ts-node` or dynamic import
- CLI updated to call `runDefaultPlugin()` after greeting the user
- End-to-end test updated to:
    - Create a library consumer that writes its own plugin class
    - Dynamically loads and runs that plugin using `PluginLoader` from `@esm_learning/shared`
    - Handles ESM/CJS compatibility and dynamic runtime paths

> ✅ Demonstrates extensibility: CLI + shared plugin system + consumer plugins — all tested locally


## 🧪 Testing Strategy

- Uses `vitest` to simulate real consumers
- Runs `npm install` on the `.tgz` files in fresh temp folders
- Verifies both library and CLI behavior
- Proves that local packaging workflows can fully replace registry publishing for testing and distribution

---

## 🛠️ Stack

- TypeScript + `tsup`
- npm workspaces
- `npm pack`
- `vitest`
- CJS CLI with shebang
- ESM/CJS dual export for shared

---

## 📝 License

ISC
