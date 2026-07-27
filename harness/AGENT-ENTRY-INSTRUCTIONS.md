# AGENT-ENTRY-INSTRUCTIONS - Executable Task Entry

Status: Active  
Date: 2026-07-27

## Purpose

These are the standard entry instructions for executor agents running a Mimico task file.

Use this file to avoid duplicating the same execution guardrails inside every `tasks/TASK-XXX.md`.

## How To Start A Task

Executor agents should be started from a task file directly:

```text
Execute tasks/TASK-XXX.md
```

Do not use a separate prompt wrapper. The old `prompts/PROMPT-XXX.md` wrappers are deprecated.

## Before Editing Files

1. Read `docs/EXECUTION-STATUS.md` and confirm the task is neither `[x] Done` nor `[>] In review`.
2. If the task is done or in review, stop and report the current status instead of re-executing it.
3. Follow `harness/HARNESS-001-agent-execution.md`.
4. Read every document listed in the task file's `Source Documents`.
5. Read the matching test-first pack, usually `test-first/TEST-FIRST-XXX.md`.
6. Restate the task goal, source docs, target repo, and verification commands before implementation.
7. Do not expand scope. Respect the task file's `Scope`, `Out Of Scope`, `Allowed Files Or Areas`, and `Stop Conditions`.
8. Add or update tests from the test-first pack before or alongside implementation.
9. Run the required verification commands.
10. Review the diff before integration.
11. Commit from the target repo, push, and open a PR for Rodrigo review.
12. Update `docs/EXECUTION-STATUS.md` at the end with branch, PR, verification result, merge status when known, and deferrals.

## Final Report

Report:

- initial code/test findings
- files changed
- tests added or updated
- verification commands run and results
- any deferrals from the test-first pack
- branch/commit/PR status if created
