# TITAN QA Test Log

## Purpose

Chronological evidence log for testing the TITAN Product Intelligence app from core code paths through the runnable Android artifact. This file records what was tested and what happened. Defects, obstacles, proposed changes, and applied fixes belong in `TITAN_QA_FINDINGS_AND_CHANGES.md`.

## Test Run Metadata

- Run ID: QA-2026-09-06-001
- Date: 2026-09-06
- Agent: TITAN Evidence QA
- Repository state: Initial log creation; verify with `git status` before execution
- Target: Android Sprint 1 offline Compose shell
- Build variants: To be recorded
- Device/emulator: To be recorded

## Scope and Oracle

- Product QA baseline: `05_TITAN_PRODUCT_INTELLIGENCE_QA_SECURITY_RELEASE.md`
- Architecture baseline: `02_TITAN_PRODUCT_INTELLIGENCE_TECHNICAL_ARCHITECTURE.md`
- UI baseline: `03_TITAN_PRODUCT_INTELLIGENCE_UI_UX_SPECIFICATION.md`
- Android scope and commands: `android/README.md`
- Explicit Sprint 1 limitations: no backend, network, scoring engine, persistence, authentication, alerts, or comparison logic

## Test Plan

- [ ] Build and static project sanity
- [ ] Unit and local JVM tests
- [ ] Core model, sample data, filtering, and navigation code inspection
- [ ] Debug APK creation, install, launch, and artifact inspection
- [ ] Critical user flows: Home, Search, result selection, Product Detail, Offers, Compare, Saved, More, back navigation
- [ ] Loading, error, empty, unavailable, and sample-data labeling states
- [ ] Visual response: layout, hierarchy, contrast, dark/light theme, screen sizes, font scaling
- [ ] Accessibility: semantics, labels, focus order, touch targets, TalkBack-compatible actions
- [ ] Configuration changes and process recreation
- [ ] Offline/slow network behavior and malformed data handling within implemented scope
- [ ] Security/privacy: APK contents, permissions, links, secrets, and sample data boundaries
- [ ] Performance: cold/warm start, navigation latency, rendering, memory, and logs
- [ ] Release artifact and release-gate review

## Execution Log

| ID | Layer / scenario | Environment and command | Expected | Observed | Status | Evidence / finding |
| --- | --- | --- | --- | --- | --- | --- |
| T-000 | Log initialized | Workspace inspection | Required test and findings logs exist separately | Both logs present | PASS | QA setup |
| T-001 | Android JVM tests | `android/gradlew.bat test`; Windows; 2026-09-06 | Unit/local tests complete successfully | Gradle reported `BUILD SUCCESSFUL`; 49 actionable tasks up to date | PASS | Gradle output |
| T-002 | Debug artifact build | `android/gradlew.bat assembleDebug`; Windows; 2026-09-06 | Debug APK is generated successfully | Gradle reported `BUILD SUCCESSFUL`; 37 actionable tasks up to date | PASS | `android/app/build/outputs/apk/` |
| T-003 | Device/emulator runtime | No device/emulator execution performed in this cycle | Install, launch, and critical UI flows are exercised | Runtime evidence unavailable | BLOCKED | F-000 |
| T-004 | Android runtime bridge | Android Studio + ADB; AVD `Medium_Phone`; authorized `emulator-5554`; debug APK | Current APK installs and launches | `adb install -r` succeeded; package process observed; no fatal exception/ANR in launch log slice | PASS | AB-000, AB-001 |
| T-005 | Runtime evidence capture | `adb screencap`, `uiautomator dump`; `qa-evidence/` | Screen and UI hierarchy are available for QA inspection | Screenshot and XML dump saved; text query returned no matching sample labels | PASS WITH LIMITATION | AB-002, AB-ISSUE-001 |
| T-006 | Relaunch/back smoke check | ADB on `emulator-5554`; force-stop, launch, back, relaunch, process/log scan | Main activity returns to foreground without crash or ANR | `MainActivity` resumed and process remained alive; crash scan returned no matching fatal exception/ANR | PASS | Runtime command output |
| T-007 | UI hierarchy and accessibility surface | `uiautomator dump` on `emulator-5554`; initial active app state | App controls, labels, and content descriptions are inspectable | Initial dump exposed 23 visible text nodes and bottom navigation labels; only one content description surfaced. Later flow navigation was blocked by emulator NotificationShade/lockscreen state and null UI root | BLOCKED WITH PARTIAL PASS | AB-002, AB-ISSUE-001, AB-ISSUE-002 |
| T-008 | Full UI navigation flows | Search, result selection, detail, offers, bottom navigation, and empty states | Critical flows are exercised on a clean active app surface | Not completed because emulator system overlay retained focus and subsequent UI dump returned null root | BLOCKED | AB-ISSUE-002 |
| T-009 | Emulator recovery attempt | `adb reboot`, `wait-for-device`, keyguard dismissal, MainActivity launch | Clean unlocked app focus is restored | Device returned to ADB, but `mCurrentFocus=null` and `mDreamingLockscreen=true`; UI session remains blocked | BLOCKED | AB-ISSUE-002 |
| T-010 | Launcher and splash branding | Rebuilt `assembleDebug`; `aapt2 dump badging`; merged `values-v31`; `adb install -r`; `am start -W` | APK references supplied logo for launcher and Android 12+ splash; app launches | `ic_launcher.xml` packaged; merged splash references `@drawable/titan_logo`; install succeeded; `MainActivity` foreground; no fatal exception/ANR in scan | PASS | CT-007 |

## Coverage Summary

- Checks planned: 15 areas
- Checks executed: 10
- PASS: 6
- FAIL: 0
- BLOCKED: 3
- NOT APPLICABLE: 0
- Release gate: Not assessed

## Environment Blockers

Record missing SDK components, emulator/device access, Gradle failures, unavailable backend services, or other constraints here. Link the detailed issue in `TITAN_QA_FINDINGS_AND_CHANGES.md`.

## Final Test-Run Notes

JVM tests, debug APK assembly, emulator install, launch, runtime evidence capture, relaunch/back smoke check, and launcher/splash branding verification pass. Full UI navigation and accessibility flows remain blocked when the emulator system overlay/lockscreen retains focus; reboot recovery did not restore a clean focus. Re-run after the AVD is fully booted and unlocked.
