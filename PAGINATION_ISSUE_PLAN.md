# Pagination Issue History and Execution Plan

## Issue Summary
- The CV preview and generated PDF had page-break defects:
- Text was sometimes cut in half at page boundaries.
- Experience section did not consistently respect bottom/top margins between pages.
- In some cases, trailing lines were duplicated at the start of the next page.

## History of Observed Problems
1. Initial symptom:
- Text split across page boundaries (upper part on page N, lower part on page N+1).
2. After first fix pass:
- Improvement in line cutting, but page-end and next-page-start margins were not consistently respected.
3. After margin adjustments:
- Behavior regressed for experience blocks, including duplicated trailing lines on next page.

## Theories Considered

### Theory 1: Margin Ownership and Slice Step Mismatch
- If page margins are applied in one layer (page) while slicing/offset logic assumes another (slice/content), clip windows can overlap or drift.
- Expected effects:
- Inconsistent bottom/top margins.
- Repeated lines near boundaries.

### Theory 2: Measurement Box Model Differs from Clipping Box Model
- If pagination measurements include/exclude border/padding differently than the rendered clipping viewport, page offsets become inaccurate.
- Expected effects:
- Boundary drift by a few pixels to a few lines.
- Non-deterministic behavior as content changes.

### Theory 3: Keep-Together Spacer Logic Is Not Fully Cumulative
- If keep-together logic is applied element-by-element without full cumulative recalculation, downstream block positions may be misestimated.
- Expected effects:
- Some blocks improve, others still split or jump incorrectly.

### Theory 4: Raw Transform Slicing Is Intrinsically Fragile for Text
- Pure pixel slicing (`translateY`) can cut inside line boxes unless breakpoints are aligned to semantic block boundaries.
- Expected effects:
- Half-line clipping and occasional duplicated tails at boundaries.

## Theory Challenges
- Theory 1 challenge: should mainly reproduce around margin-height zones.
- Theory 2 challenge: alone usually causes drift, not always duplication; strongest when combined with Theory 1.
- Theory 3 challenge: explains instability, but duplication often needs geometry overlap too.
- Theory 4 challenge: larger implementation change, but best systemic reliability.

## Similarities Across Theories
- The strongest theories converge on one principle:
- **Pagination, clipping, and margins must use one coordinate system and one clear margin owner.**
- Additionally, reliable boundaries should prefer **semantic block breakpoints** over raw fixed-height cuts.

## Final Decision (What to Implement)
- Implement semantic breakpoint pagination with a single geometry contract:
1. Define one page/content box model and keep it consistent for measurement and clipping.
2. Build break candidates from semantic blocks (experience item, list item, paragraph, headings).
3. Resolve page breaks from candidates (last safe breakpoint before overflow).
4. Use deterministic offsets from resolved breakpoints, not only `index * height`.
5. Keep hard-cut fallback only when a single block exceeds one page.

## Why This Decision
- It directly addresses all reported symptoms:
- Prevents text from being cut mid-line.
- Enforces bottom/top margins per page transition.
- Prevents repeated trailing lines by eliminating overlap-prone boundary math.
- It also creates stable preview/PDF parity with deterministic behavior.

## Execution Plan (All Tasks <= Medium Complexity)

| id | name | description | complexity | difficulty | status | dependencies |
|---|---|---|---|---|---|---|
| T1.1 | Build Fixture A | Create a short CV fixture that should stay on one page. | 🟢 Simple | 🟢 Easy | ⭕ Not started | None |
| T1.2 | Build Fixture B | Create a boundary fixture where experience ends near page bottom. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T1.1 |
| T1.3 | Build Fixture C | Create a long fixture spanning 2+ pages with dense experience bullets. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T1.1 |
| T1.4 | Capture Baseline Breaks | Record current break offsets and duplicated lines for fixtures B/C. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T1.2, T1.3 |
| T2.1 | Define Page Box Contract | Lock exact page height/width and content-box dimensions used for clipping. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T1.4 |
| T2.2 | Define Margin Ownership | Choose one margin owner (page or slice) and document invariant rules. | 🟢 Simple | 🟡 Medium | ⭕ Not started | T2.1 |
| T2.3 | Define Candidate Blocks | Finalize semantic break candidates (experience item, li, p, headings). | 🟡 Medium | 🟡 Medium | ⭕ Not started | T2.2 |
| T3.1 | Add Breakpoint Unit Test 1 | Test no overlap and no duplicate content for boundary fixture math. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T2.3 |
| T3.2 | Add Breakpoint Unit Test 2 | Test bottom-margin and next-page top-margin spacing invariants. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T3.1 |
| T3.3 | Add Breakpoint Unit Test 3 | Test fallback behavior when a single block exceeds one page. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T3.1 |
| T4.1 | Implement Measurement Pass | Measure all candidate blocks once in content coordinates. | 🟡 Medium | 🔴 Hard | ⭕ Not started | T3.1, T3.2 |
| T4.2 | Implement Breakpoint Resolver | Compute page breaks from candidates without fixed `index * height` assumptions. | 🟡 Medium | 🔴 Hard | ⭕ Not started | T4.1 |
| T4.3 | Apply Stable Slice Offsets | Render slices strictly from resolved break offsets (no overlap drift). | 🟡 Medium | 🟡 Medium | ⭕ Not started | T4.2 |
| T5.1 | Validate Preview Fixtures | Verify fixtures A/B/C visually: no cut lines, no duplicated tails, margins respected. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T4.3 |
| T5.2 | Validate PDF Parity | Confirm generated PDF page breaks match preview for fixtures B/C. | 🟡 Medium | 🟡 Medium | ⭕ Not started | T5.1 |
| T5.3 | Final Quality Gate | Run related unit tests, typecheck, and touched-file lint. | 🟢 Simple | 🟢 Easy | ⭕ Not started | T5.2 |

## Definition of Done
- Final deliverable:
- Stable, deterministic pagination for preview and PDF.
- Success criteria:
1. No split lines across page boundaries.
2. No duplicated trailing lines on next page.
3. Bottom and top page margins are respected for experience-heavy boundary cases.
4. Related unit tests, typecheck, and lint pass for touched scope.
