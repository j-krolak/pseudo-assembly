# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, etc.) when working with code in this repository. `CLAUDE.md` is a symlink to this file.

## What this is

An interpreter and web playground for a pseudo-assembly language modeled on lectures from Warsaw University of Technology (PW). The site has three pages: an interactive playground (write/run code, inspect registers and memory), a step-by-step tutorial, and instruction reference docs. Published at https://j-krolak.github.io/pseudo-assembly/docs.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

- `pnpm install` — install deps
- `pnpm dev` — Vite dev server
- `pnpm build` — `tsc` (typecheck, no emit) then `vite build`; run this after any change to confirm both typecheck and bundling succeed
- `pnpm preview` — preview the production build
- `pnpm deploy` — `gh-pages -d dist`

There is no test suite and no lint script configured — `tsc --noEmit` (via `pnpm build`) is the only automated check. Formatting is Prettier (`.prettierrc`: single quotes, trailing commas).

`pnpm-workspace.yaml` (not `package.json`) is where `pnpm` reads `allowBuilds`/`overrides` — a `"pnpm"` field in `package.json` is silently ignored by this pnpm version.

## Architecture

**Multi-page Vite app, no framework.** Three HTML entry points (`index.html` = playground, `tutorial.html`, `docs.html`) are declared in `vite.config.js`'s `rollupOptions.input`, each with its own `<script type="module">` (`src/main.ts`, `src/tutorial/tutorial-manager.ts`). `base: '/pseudo-assembly/'` is set for GitHub Pages. Tailwind is loaded via the `@tailwindcss/browser@4` CDN script tag directly in HTML — there is no Tailwind build step. `src/style.css` holds only the custom, non-utility CSS (dropdown component, toggle checkboxes, panel styles).

**The interpreter (`src/interpreter.ts`)** is a plain TS class with no dependencies on the DOM or CodeMirror. It runs in two phases:
- `preprocess()`: scans all lines, registers labels, validates instruction/operand shape, and lays out memory (`bytes`), assigning each statement a byte size/address.
- `interpret()` / `interpretNextLine()`: executes statements one at a time, mutating `registers`/`bytes`/`eflags`. `interpretNextLine()` is also called directly by the "run line by line" stepping feature in the playground.

It exports `keywords` (the instruction mnemonic list) — this is reused by the editor's syntax highlighter and label-aligner, so a new instruction added here should generally also just work there. `PreprocessingError`/`RuntimeError` carry both a human-readable `message` (prefixed `[Line N] ...`) and a structured `line?: number` field; use `this.preprocessingError(msg)` / `this.runtimeError(msg)` inside `Interpreter` rather than `new PreprocessingError(...)` directly, so the line number stays attached automatically.

**Editor stack is CodeMirror 6**, wired up independently in `src/main.ts` (playground, single editor) and `src/tutorial/tutorial-manager.ts` (tutorial, one editor per step). Optional features — vim mode, syntax highlighting, label-column alignment — are each mounted via their own `Compartment` so they can be toggled at runtime without recreating the editor; each toggle's on/off state is persisted to `localStorage` (see the `*_LS_KEY` constants near the top of `main.ts`).

**Custom language support for the pseudo-assembly syntax** is split across three files that must stay consistent with each other:
- `src/pasm-line.ts` — the single source of truth for "is the first word of this line a label, or the instruction?" (`classifyLineHead`). A word can be both a valid instruction mnemonic AND a valid label (e.g. `A` is the add instruction *and* a legal label name), so this has to look at what follows, not just the word itself.
- `src/pasm-language.ts` — `StreamLanguage`-based tokenizer/highlighter built on `classifyLineHead`.
- `src/pasm-align.ts` — a `ViewPlugin` that visually pads instructions into a shared column after labels (elastic-tabstop style), also built on `classifyLineHead`, plus an `inputHandler` that auto-inserts a separating space when a user starts typing a new label in front of an existing instruction word.

This classifier used to be duplicated between the highlighter and the aligner and silently drifted out of sync (one handled edge cases like `"3, ZERO"` the other didn't) — keep it in one place.

**`src/dropdown.ts`** is a hand-rolled dropdown (native `<select>` can't be styled to spec). Used for the register/memory bin↔hex format pickers and for the playground's "files" dropdown, which merges the built-in `src/examples.ts` entries (immutable) with user-saved files kept in `localStorage` (add/delete supported, see `DropdownExtra` in `dropdown.ts` and the `FileRef`/`customFiles` logic in `main.ts`).

**Playground rendering is direct DOM manipulation**, not reactive: `displayState()` in `main.ts` rebuilds the registers/memory panels from `interpreter.registers`/`interpreter.bytes` and is called explicitly after every run/step. There's no diffing/virtual-DOM layer.

**`localStorage` is the only persistence layer** — current code buffer, per-feature toggle state, saved custom files, and which file is currently open all live there. Grep `*_LS_KEY` in `main.ts` for the full list of keys.

## Notes specific to this codebase

- `tsconfig.json` has `erasableSyntaxOnly: true`, which rejects TS parameter-property shorthand (`constructor(readonly x: number)`) — declare the field separately and assign it in the constructor body instead.
- `noUnusedLocals`/`noUnusedParameters` are on; `tsc --noEmit` will fail on dead destructured bindings, not just unused top-level vars.
