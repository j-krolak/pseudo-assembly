---
name: tutorial-step
description: Add or edit a step in the pseudo-assembly interactive tutorial (tutorial.html + src/tutorial/tutorial-steps.ts + tutorial-manager.ts). Use when asked to add a new tutorial lesson/step, reorder tutorial steps, or edit an existing step's exercise/validation.
---

A tutorial step is defined in three places that must stay in sync:

1. **`src/tutorial/tutorial-steps.ts`** — one `TutorialStep` object per step, appended to the `tutorialSteps` array (id = its 1-based position):
   - `expectedCode`: a `RegExp` or `RegExp[]` the student's submitted code must match (used loosely - just enough to confirm they used the right instructions, not an exact-string match).
   - `expectedValues`: `{ labelName, value }[]` checked against the interpreter's memory after running the student's code.
   - `solution`: a full, correct program (shown by the "load example solution" button).
   - `successMessage`: shown on a correct answer.

2. **`tutorial.html`** — one `<div class="tutorial-step w-full" id="step-N" style="display: none">` per step (the first step omits `style="display: none"`), each containing:
   - A left panel: `step N of M` label, title, description, a `Task:`/`Hint:` box (`bg-[#2E2E2E] p-4`), and `prev-step`/`next-step` buttons (the very first step's `prev-step` gets `disabled`).
   - A right panel: vim toggle checkbox, `load-example`/`check-answer` buttons (both need `data-step="N"`), a `<div id="tutorial-editor-N">`, and a `<div class="feedback text-sm" id="feedback-N">`.
   - The **last** step is always a static completion screen with no editor — see the existing `id="step-M"` at the end of the file for its shape.

3. **`src/tutorial/tutorial-manager.ts`** — `private readonly totalSteps` must equal the number of `<div class="tutorial-step">` blocks (including the completion screen). `TutorialManager` wires up prev/next/load-example/check-answer generically by scanning `.prev-step`/`.next-step`/`.load-example`/`.check-answer`/`data-step` - no other per-step code exists there.

## Adding a step

Prefer **appending** a new step just before the completion screen over inserting one in the middle - inserting requires renumbering every subsequent step's `id`, `data-step`, `tutorial-editor-N`, `feedback-N`, and `step N of M` text, plus every *other* step's `step N of M` text (since `M` changes either way, but appending avoids touching `N`).

Steps to append a step:
1. Add the new `TutorialStep` to `tutorialSteps` in `tutorial-steps.ts`.
2. Duplicate the previous exercise step's `<div class="tutorial-step">` block in `tutorial.html`, renumber its `id`/`data-step`/`tutorial-editor-N`/`feedback-N` to the new step number, and write new content.
3. Renumber the completion screen's `id="step-N"` to the new last number.
4. Update `step N of M` text on **every** step (M changed).
5. Bump `totalSteps` in `tutorial-manager.ts`.
6. Run `pnpm build` to typecheck, then click through the tutorial in a browser (prev/next, load example, check answer, vim toggle) to confirm nothing broke.

## Editing an existing step

Prefer tightening/adding to an existing step's description over adding a whole new step when the concept is a short addendum rather than a new exercise (e.g. a one-sentence rule) - see step 1's note about `DC`/`DS` needing to precede executable instructions for an example of this.
