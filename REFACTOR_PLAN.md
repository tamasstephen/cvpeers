# Refactor Plan

## References
- Charter: `/Users/stephentamas/projects/cvpeers/REFACTOR_CHARTER.md`

## Self-Reflection Rubric
1. `SOLID`: each module has one clear reason to change, and dependencies point to abstractions.
2. `Composition where it adds value`: keep proven inheritance when it reduces churn and risk.
3. `DRY`: eliminate duplicated form construction/mapping/persistence logic.
4. `KISS`: reduce branching and side effects in large components, keep orchestration thin.
5. `TDD discipline`: failing test first for each refactor step, then implementation, then pass.
6. `Safety`: preserve behavior with characterization tests before structural changes.
7. `Quality gates`: unit tests + lint + typecheck must pass before task completion.

Complexity mapping for this plan: `low=🟢 Simple`, `medium=🟡 Medium`, `high/extra=🔴 Complex` (decomposed so all executable tasks are `<= 🟡 Medium`).

| id | name | description | complexity | difficulty | status | dependencies |
|---|---|---|---|---|---|---|
| T1 | Refactor Charter | Define module boundaries and target architecture around `/Users/stephentamas/projects/cvpeers/src/app/form`, `/Users/stephentamas/projects/cvpeers/src/app/cv`, `/Users/stephentamas/projects/cvpeers/src/app/services`. Include risks and rollback points. | 🟡 Medium | 🟡 Medium | ✅ Completed | None |
| T2 | Lifecycle Pattern Decision (Path A) | Keep `ComponentBaseComponent` for this refactor scope; avoid teardown-pattern migration and focus on higher-value module boundaries. | 🟢 Simple | 🟢 Easy | ✅ Completed | T1 |
| T3.1 | CV Form Baseline Characterization | Add failing tests for load/save/reset/submit/dummy-data/sidepanel behavior in `/Users/stephentamas/projects/cvpeers/src/app/form/cv-form/cv-form.component.ts`. | 🟡 Medium | 🟡 Medium | ✅ Completed | T1 |
| T3.2 | Extract Storage Adapter | Move localStorage access into a dedicated adapter with unit tests. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.1 |
| T3.3 | Extract Persistence Mapper | Move serialization/deserialization and date normalization into a mapper module with tests. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.2 |
| T3.4 | Extract Form Skeleton Factory | Extract creation of top-level form groups/controls from component into typed factory functions. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.1 |
| T3.5 | Extract Section Array Factories | Extract experience/education/language/social array-item form builders to remove duplication. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.4 |
| T3.6 | Extract CV Form Commands | Separate download/reset/use-dummy and dialog command logic into a use-case/facade layer. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.3, T3.5 |
| T3.7 | Orchestrator-Only Component | Reduce `CvFormComponent` to orchestration and view binding; keep behavior unchanged. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.6 |
| T3.8 | CV Form Regression Validation | Re-run and extend component-level tests to validate no behavior drift after decomposition. | 🟡 Medium | 🟢 Easy | ✅ Completed | T3.7 |
| T4.1 | PDF/Preview Baseline Characterization | Add failing tests for summary parsing/font injection/pagination invariants. | 🟡 Medium | 🟡 Medium | ✅ Completed | T1 |
| T4.2 | Extract Summary Sanitizer Step | Isolate HTML sanitization and unsafe markup cleanup into a focused pure step with tests. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.1 |
| T4.3 | Extract Summary List Normalizer Step | Isolate ordered/unordered list normalization logic into a pure transformer with tests. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.2 |
| T4.4 | Extract Summary Typography Step | Isolate font/style normalization for summary HTML into a dedicated transformer with tests. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.3 |
| T4.5 | Extract Preview Measurement Unit | Move preview page-height/semantic block measurement orchestration into dedicated utilities/services. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.1 |
| T4.6 | Extract PDF Renderer Adapter | Separate jsPDF rendering orchestration from transform logic into adapter-level module boundaries. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.4, T4.5 |
| T4.7 | Integrate Preview/PDF Pipeline | Reconnect extracted steps into a stable pipeline used by CV preview and export flows. | 🟡 Medium | 🟡 Medium | ✅ Completed | T4.6 |
| T4.8 | Preview/PDF Regression Validation | Re-run targeted tests for preview and PDF paths to ensure output parity. | 🟡 Medium | 🟢 Easy | ✅ Completed | T4.7 |
| T5 | DRY Pass Across Form Sections | Deduplicate shared patterns in experience/education/language/social modules with small composable helpers. | 🟡 Medium | 🟡 Medium | ✅ Completed | T3.8 |
| T6 | Verification Gates | Run full validation: unit tests, lint, typecheck; block completion on failures. | 🟡 Medium | 🟢 Easy | ✅ Completed | T2, T4.8, T5 |
| T7 | Documentation Update | Update architecture/refactor notes and rationale in project docs. | 🟢 Simple | 🟢 Easy | ✅ Completed | T6 |

## Hypotheses To Challenge (Medium+ Tasks)
1. Keeping inheritance for teardown will not block modularization and testability goals.
2. Extracting form factories will reduce duplication without over-abstraction.
3. Splitting PDF/preview logic will improve testability without performance regression.

## Definition of Done
- Final deliverable: a refactored Angular app with smaller, composable modules and preserved behavior.
- Success criteria:
1. All relevant unit tests pass (including new characterization tests).
2. `lint` and typecheck pass with no new violations.
3. Core user flows (edit CV, preview, download PDF, persist/restore form) behave identically or better.
