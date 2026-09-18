# TITAN QA Findings and Changes

## Purpose

Separate register for defects, risks, obstacles, proposed changes, and applied fixes found while testing TITAN. Execution evidence remains in `TITAN_QA_TEST_LOG.md`.

## Severity

- P0: critical security, data loss, or service-wide failure
- P1: release-blocking or major user-impacting failure
- P2: significant feature degradation
- P3: minor defect or polish issue

## Findings

| ID | Severity | Area | Type | Status | Summary |
| --- | --- | --- | --- | --- | --- |
| F-000 | P3 | QA setup | Obstacle | Resolved | Device/emulator runtime target is available; full user-flow and accessibility coverage is now pending QA. |

## Detailed Records

### F-000 - Device/emulator runtime coverage pending

- Type: Obstacle
- Severity: P3
- Status: Resolved for environment; follow-up QA coverage open
- Reproduction: Attempt install/launch and critical-flow checks on an available emulator or physical Android device.
- Expected: The debug APK installs, launches, and supports runtime UI verification.
- Actual: Android Studio, SDK, ADB, authorized `emulator-5554`, APK install, launch, and evidence capture passed.
- Impact: Environment blocker is resolved; runtime behavior, accessibility, visual layout, performance, and install/launch health still require QA coverage.
- Evidence: `TITAN_QA_TEST_LOG.md`, entries T-001 through T-005; `TITAN_ANDROID_BRIDGE_LOG.md`, AB-000 through AB-002.
- Proposed change: TITAN Evidence QA should execute critical flows, accessibility, visual, and performance checks on `emulator-5554`.
- Applied fix: None.
- Regression evidence: Local JVM tests, debug artifact build, APK install, package launch, and runtime evidence capture pass; QA flow retest pending.

### F-001 - Emulator system overlay blocks full UI QA

- Type: Environment blocker
- Severity: P2
- Status: Open
- Reproduction: Start from the current `emulator-5554` session after relaunch and run `uiautomator dump`; the system NotificationShade/lockscreen retains focus and a later dump returns a null root.
- Expected: The emulator is cleanly unlocked with `MainActivity` as the current focus so QA can inspect and interact with the Compose tree.
- Actual: `mFocusedApp` referenced TITAN during part of the attempt, but `mCurrentFocus` was `NotificationShade`; after dismissal attempts, focus and UiAutomator root became null.
- Impact: Full UI navigation and accessibility verification cannot be trusted in this session.
- Evidence: `TITAN_QA_TEST_LOG.md`, entries T-007 and T-008; `TITAN_ANDROID_BRIDGE_ISSUES.md`, AB-ISSUE-002.
- Proposed change: Reset/boot a clean unlocked AVD session, verify `mCurrentFocus` is `com.titanlabs.productintelligence/.MainActivity`, then rerun Search, Detail, navigation, and accessibility checks.
- Applied fix: None.
- Regression evidence: Initial install, launch, screenshot, hierarchy, and relaunch smoke checks pass; full-flow retest pending.

### F-002 - No validated live-data input is available

- Type: Data/integration blocker
- Severity: P1 for live-data release; P3 for the current Sprint 1 shell
- Status: Blocked
- Reproduction: Search the workspace for Source Ledger exports (`TITAN_Product_Intelligence_Source_Ledger`, CSV, XLSX, SQLite, or API configuration).
- Expected: A validated product dataset with product identity, region/currency, evidence URLs, freshness, offers, and provenance is available before app integration.
- Actual: Only hard-coded illustrative content exists in `android/app/src/main/java/com/titanlabs/productintelligence/data/sample/SampleData.kt`; no validated live-data artifact or product scope is present.
- Impact: Live-data patching and live-data testing cannot be performed without inventing facts or mislabeling sample values.
- Evidence: `android/README.md`; `TITAN_PROJECT_STATUS.md`; workspace search on 2026-09-06.
- Proposed change: Provide a bounded product list, region, and currency; run TITAN Source Ledger; validate its export; then hand it to TITAN Catalog Integrator.
- Applied fix: None. Sample-data labeling remains intact.
- Regression evidence: Not applicable until a validated ledger export exists.

## Applied Changes

No source or configuration fixes have been applied by this QA setup.

## Open Questions and Risks

- Physical-device availability is unverified; authorized emulator runtime is available.
- Android Studio, Android SDK, JDK, ADB, and Gradle prerequisites are verified for this target.
- The Sprint 1 app intentionally uses local sample data; backend and live-data claims are outside this test scope.
- Release signing and AAB verification may be unavailable in the current workspace.
