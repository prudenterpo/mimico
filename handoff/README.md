# Handoff — Vertical A (`api-mimico`)

Temporary mailbox. Do not merge this branch into `mimico`.
Apply the patch in `prudenterpo/api-mimico`, then delete this branch.

On your computer, in Cursor, open the `api-mimico` repo and run:

```bash
git fetch origin develop
git checkout -b feature/api-tables-path-63f4 origin/develop
curl -fsSL https://raw.githubusercontent.com/prudenterpo/mimico/feature/handoff-api-tables-63f4/handoff/api-tables-path-63f4.patch | git am
./mvnw test
git push -u origin feature/api-tables-path-63f4
gh pr create --base develop --title "Fix table path, Postgres status, and invite delivery" --body "Vertical A: /api/tables, Flyway V13 TABLE_* status, sendInvite without lazy host. Tested against Postgres + STOMP."
```

What the patch contains:

1. `TableController` mapped at `/api/tables`
2. Flyway `V13` — `game_tables.status VARCHAR(32)` + `TABLE_*` values
3. `TablePlayerService` `@Transactional` + host nickname from `userRepository`
4. `TableControllerTest` and invite test
