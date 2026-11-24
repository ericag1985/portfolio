# Agent notes

When creating or changing a design-system component or its stories, follow
`.cursor/skills/component-authoring/SKILL.md`.

Stateful behavior lives in a `useComponent.ts` hook next to the component.

Use JSDoc for anything non-obvious (why, constraints, accessibility behavior); don't comment the obvious.

## Workflow

Grok plans > Claude codes > Grok reviews > Claude fixes > Grok stamps >
Grok or Erica merges.

Roles:

- **Erica** decides what gets built, settles every **Erica decides** item,
  and merges anything that isn't low-risk (see Merge).
- **Grok** (Grok Bot) plans and reviews: writes specs, reviews PRs, stamps,
  and merges low-risk PRs. It never writes or edits code, runs builds, or
  pushes anything except `tasks/` files.
- **Claude** (Claude Code, run by `.github/workflows/claude.yml` when a
  comment mentions `@claude`) builds from specs and review fix lists and
  pushes to the PR's branch. It doesn't review, stamp, or merge.

All state lives in GitHub (specs, PRs, comments, labels). Don't rely on chat
history. Each piece of work is one draft PR, and every handoff is a comment or
a label on it:

| Label           | Meaning                                  |
| --------------- | ---------------------------------------- |
| `needs-review`  | Claude is done with a round; Grok's turn |
| `needs-erica`   | Waiting on an **Erica decides** item     |
| `grok-approved` | Stamped (see Stamp)                      |

### Plan

1. Grok drafts the spec in chat with Erica. Nothing goes to GitHub until
   Erica approves it.
2. Grok creates `feat/<name>` from `main`, commits the approved spec as
   `tasks/<name>.md` (the first commit), pushes the branch, and opens a draft
   PR titled with the spec's goal.
3. Grok starts the build with a PR comment:
   `@claude build this PR from its spec`.

A spec has these sections: Goal, Inputs, API (if any), Files touched,
Acceptance criteria (checkboxes), and Out of scope. If the spec has to change
mid-build, Grok edits `tasks/<name>.md` on the same branch.

### Build

1. On `@claude`, Claude builds on the PR's branch. It reads `AGENTS.md`, the
   spec, the files it names, and the component-authoring skill, not the rest
   of the repo.
2. Before pushing, Claude runs the checks in the spec's Done section on the
   runner and fixes what fails.
3. When every acceptance criterion is met, Claude ticks the criteria in the
   PR description, marks the PR ready for review, and adds `needs-review`.
   CI then runs on the push, and Grok won't stamp until it's green.

### Review

1. Grok picks up PRs labeled `needs-review` and removes the label. It reads
   the diff, the spec, and the CI result, not the whole repo.
2. Grok posts one batched review per round: inline comments, plus a summary
   that tags each item **Fix before merge**, **Erica decides**, or **Nit**.
3. If anything is **Erica decides**, Grok adds `needs-erica` and waits for her
   answer in the PR.
4. Grok posts the fix list as a single PR comment that starts with `@claude`
   and has checkbox criteria. Review fixes never get a `tasks/` file.
5. Claude pushes the fixes to the same branch, ticks the fix list, and adds
   `needs-review` again. Grok re-reviews only the new commits.

Stop after three review rounds and hand it to Erica. A fourth round usually
means the spec is wrong.

### Stamp

Grok stamps a PR when every **Fix before merge** item is ticked, every
**Erica decides** item is settled, and CI is green. A stamp is the
`grok-approved` label plus a short comment: what was checked, and whether the
PR is low-risk. Any new push removes the stamp, and Grok re-checks the new
commits before stamping again.

### Merge

Squash merge, then delete the branch.

- **Grok may merge** a stamped PR when it is low-risk: it changes only docs,
  tests, stories, or `tasks/`, and touches no component code, tokens, CI, or
  dependencies.
- **Erica merges** everything else, after the stamp.
- When in doubt, it's Erica's.

### Rules for everyone

- Stay inside the spec's Files touched and Out of scope. Raise anything else
  in the PR description instead of widening the change.
- If a spec conflicts with the component-authoring skill, the skill wins. Say
  so in the PR.
- Always pull before pushing to a shared branch.
