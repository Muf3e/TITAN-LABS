# TITAN Android Bridge Issues

## Purpose

Environment and runtime blockers for connecting the TITAN Android build to Android Studio, ADB, an emulator, or a physical device. App defects belong in `TITAN_QA_FINDINGS_AND_CHANGES.md`.

## Open Issues

| ID | Severity | Status | Summary |
| --- | --- | --- | --- |
| AB-ISSUE-000 | P3 | Resolved | Android Studio/toolchain and runtime target verified; `emulator-5554` is authorized and the debug APK launches. |
| AB-ISSUE-001 | P2 | Open | Sample UI hierarchy query returned no matching visible text; dedicated Compose accessibility and user-flow verification is still required. |
| AB-ISSUE-002 | P2 | Open | Emulator system NotificationShade/lockscreen retained focus during the full-flow attempt; subsequent UiAutomator dump returned a null root, blocking reliable navigation automation. |
| AB-ISSUE-003 | P2 | Open | Reboot recovery did not produce a clean active session: ADB returned but the emulator remained in dreaming lockscreen state with null current focus. |

## Required Next Action

Bridge discovery and APK launch are complete. Reset or unlock `emulator-5554` into a clean active app session, verify `mCurrentFocus` is `MainActivity`, then TITAN Evidence QA should rerun critical flows, accessibility, visual, and performance checks.
