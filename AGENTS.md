# Agent notes

When creating or changing a design-system component or its stories, follow
`.cursor/skills/component-authoring/SKILL.md`.

Stateful behavior lives in a `useComponent.ts` hook next to the component.

Use JSDoc for anything non-obvious (why, constraints, accessibility behavior); don't comment the obvious.

## Workflow

Roles:

- **Erica** decides what gets built and approves every merge.
- **Claude** plans and reviews: writes specs and reviews PRs. It does not
  write component code.
- **Alice** builds from specs, opens PRs, and gets CI green.
- **Cheshire** merges only after Erica approves.

All state lives in GitHub (specs, PRs, comments). Don't rely on chat history.

### New work

1. Claude creates `feat/<name>` from `main`, commits `tasks/<name>.md` as the
   first commit, and pushes the branch. There is no separate spec PR.
2. Alice builds on that branch. She reads the spec, the files it names, and
   the component-authoring skill, not the rest of the repo.
3. Alice opens the PR when every acceptance criterion is met and CI is green.
   The PR description ticks off the criteria.
4. Erica approves the spec and the build together, then Cheshire merges.

A spec has these sections: Goal, Inputs, API (if any), Files touched,
Acceptance criteria (checkboxes), and Out of scope. If the spec has to change
mid-build, Claude edits `tasks/<name>.md` on the same branch.

### Review

1. Claude posts one batched review per round: inline comments, plus a summary
   that tags each item **Fix before merge**, **Erica decides**, or **Nit**.
2. Once Erica has decided, Claude posts the fix list as a single PR comment
   with checkbox criteria. Review fixes never get a `tasks/` file.
3. Alice pulls, pushes the fixes to the same branch, and Claude re-reviews.

### Rules for everyone

- Stay inside the spec's Files touched and Out of scope. Raise anything else
  in the PR description instead of widening the change.
- If a spec conflicts with the component-authoring skill, the skill wins. Say
  so in the PR.
- Always pull before pushing to a shared branch.
