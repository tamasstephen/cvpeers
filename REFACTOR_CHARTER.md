# Refactor Charter

## Task Metadata
- Task ID: `T1`
- Name: `Refactor Charter`
- Complexity: `medium`
- Status: `completed`

## Self-Reflection Rubric
1. `SOLID`: each module has one reason to change.
2. `Composition where it adds value`: keep proven inheritance when migration cost outweighs benefit.
3. `DRY`: repeated form construction and mapping logic moved to single owners.
4. `KISS`: components orchestrate; business logic is extracted.
5. `TDD`: characterization tests before refactor, then implementation.
6. `Safety`: incremental delivery with rollback points after each phase.
7. `Quality gates`: tests + lint + typecheck are mandatory before completion.

## Current Architecture Baseline
- Routing is simple and page-based in `/Users/stephentamas/projects/cvpeers/src/app/app.routes.ts`.
- Form workflow is centralized in `/Users/stephentamas/projects/cvpeers/src/app/form/cv-form/cv-form.component.ts` (large mixed responsibility component).
- Preview rendering and data mapping are centralized in `/Users/stephentamas/projects/cvpeers/src/app/cv/cv.component.ts`.
- PDF rendering and HTML normalization are centralized in `/Users/stephentamas/projects/cvpeers/src/app/services/pdf-generator/pdf-generator.service.ts`.
- Multiple components/services inherit from `/Users/stephentamas/projects/cvpeers/src/app/shared/core/component-base/component-base.component.ts`.

## Boundary Violations Identified
1. `SRP breach`: `CvFormComponent` mixes UI orchestration, storage persistence, dummy data, file/image handling, form hydration, and dialog flow.
2. `Lifecycle constraint`: teardown currently depends on a shared base class; this is accepted in Path A and treated as a stable constraint for this refactor.
3. `DRY breach`: repeated `FormGroup`/`FormArray` construction and hydration logic in `CvFormComponent`.
4. `Infrastructure leakage`: direct `window`, `document`, `localStorage` usage inside presentation-centric components.
5. `Tight coupling`: sidepanel behavior bound to router events across root and sidepanel implementations.

## Target Architecture Boundaries

| Layer | Responsibility | Allowed Dependencies | Forbidden Dependencies |
|---|---|---|---|
| Presentation (`components`) | Render UI, capture events, bind signals/forms | Application services, Angular UI APIs | Direct storage/PDF/DOM-heavy business logic |
| Application (`use-cases/facades`) | Orchestrate CV flows (load/save/reset/submit/download) | Domain factories/mappers, infrastructure adapters | Template rendering details |
| Domain (`factories/mappers/validators`) | Pure CV form construction, data mapping, invariants | Types and pure utilities only | Angular component APIs, browser globals |
| Infrastructure (`adapters`) | LocalStorage, DOM/document, PDF engine, side effects | Browser APIs, 3rd-party libs | UI decision logic |
| Shared lifecycle (`component-base`) | Subscription lifecycle handling for existing components/services | RxJS subscriptions + Angular lifecycle hooks | Feature-specific business logic |

## Proposed Module Ownership

| Concern | Current Owner | Target Owner |
|---|---|---|
| CV form creation/hydration | `cv-form.component.ts` | `form-factories` + `form-hydration-mapper` |
| Local storage persistence | `cv-form.component.ts` | `cv-form-persistence.adapter` |
| PDF transform + rendering orchestration | `pdf-generator.service.ts` | `summary-transform.pipeline` + `pdf-renderer.adapter` |
| CV preview orchestration | `cv.component.ts` | `cv-preview-orchestrator` + pure pagination utilities |
| Subscription cleanup | `ComponentBaseComponent` inheritance | `ComponentBaseComponent` retained for this refactor scope |
| Sidepanel open/close orchestration | root + sidepanel component | sidepanel application service + thin UI shell |

## Execution Strategy (Incremental)
1. Freeze lifecycle approach: keep `ComponentBaseComponent` and avoid teardown migration in this refactor.
2. Characterization tests first for current behavior in form, preview, and PDF flows.
3. Extract typed form factories and persistence mappers from `CvFormComponent`.
4. Separate preview and summary transformation pipelines into composable units.
5. Apply DRY pass across feature form sections.
6. Complete full verification gates and documentation updates.

## Explicit Verification Steps (High-Impact Changes)

### A. Core Logic Migration (`CvFormComponent`, `CvComponent`)
1. Run targeted specs before change to establish baseline:
   - `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/form/cv-form/cv-form.component.spec.ts`
   - `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/cv/cv.component.spec.ts`
2. Add failing characterization tests for extracted behaviors.
3. Implement refactor in small commits per concern.
4. Re-run targeted specs after each extraction.

### B. Infrastructure/PDF Refactor (`PdfGeneratorService`)
1. Run baseline:
   - `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/services/pdf-generator/pdf-generator.service.spec.ts`
2. Add failing tests for `parseSummaryHtml` and output invariants.
3. Extract transform pipeline and renderer adapter.
4. Re-run targeted specs and preview pagination tests:
   - `npm test -- --watch=false --browsers=ChromeHeadless --include src/app/cv/preview-pagination.util.spec.ts`

### C. Completion Gate (Definition of Done enforcement)
1. Run project tests (or all impacted suites).
2. Run lint: `npm run lint`
3. Run typecheck: `npx tsc --noEmit`
4. Fail the task if any step fails.

## Risks and Rollback Points

| Risk | Impact | Mitigation | Rollback Point |
|---|---|---|---|
| Accidental partial teardown migration | Mixed patterns and inconsistent cleanup behavior | freeze rule: retain `ComponentBaseComponent` for existing modules in this refactor | revert any commit introducing mixed lifecycle patterns |
| Form hydration mapping changes | Broken persisted CV data and date fields | mapper unit tests with fixture snapshots | preserve previous hydration path behind temporary adapter |
| PDF layout drift | User-visible export regressions | PDF transform tests + preview pagination validation | keep old rendering entrypoint callable during migration |
| Sidepanel routing behavior drift | panel not opening/closing correctly on `/cv` route | route-event behavior tests in app + sidepanel | revert sidepanel orchestration extraction commit |
| Over-abstraction | harder maintenance | cap extraction scope to repeated logic only; enforce KISS | keep helpers feature-local until a second consumer exists |

## Scope Guardrails
- In scope: structure, ownership, and behavior-preserving extraction.
- Out of scope: visual redesign, new user features, route changes.
- Rule: no speculative abstractions; extract only after duplication/volatility evidence.

## Success Criteria
1. Architecture boundaries are documented and reflected in code organization.
2. High-risk refactors are validated by explicit tests before and after changes.
3. Quality gates pass: unit tests, lint, and typecheck.
