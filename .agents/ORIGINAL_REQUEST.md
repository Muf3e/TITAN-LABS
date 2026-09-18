# Original User Request

## 2026-09-06T12:56:52Z

Autonomous development, maintenance, and continuous verification of the TITAN Product Intelligence native Android application and platform, featuring modern Jetpack Compose UI, deterministic 8-dimension evaluation engine, and automated emulator verification.

Working directory: c:\Users\Mustafa\OneDrive\Documents\TITAN Labs
Integrity mode: development

## Requirements

### R1. Native Android Application Feature Development & UI Fidelity
Maintain and advance the native Android application (`com.titanlabs.productintelligence`) built with Jetpack Compose and Material 3. The UI must preserve the official 3D rainbow gradient visual identity and fluid navigation across all five primary destinations (Home, Search, Saved, Compare, Account).

### R2. Deterministic 8-Dimension Evaluation Engine Integrity
Ensure mathematical correctness and zero regression across all 8 evaluation dimensions (Performance, Value, Build Quality, Camera, Battery, Software, Display, Reliability), scoring formulas, and category weightings in `TitanEvaluationEngine.kt`.

### R3. Automated Emulator Build, Deployment & UI Verification
Execute automated unit test suites, build debug APKs via Gradle, install to the active Android Studio emulator (`emulator-5554`) via ADB, and programmatically verify UI stability and screen state handling without crashing.

### R4. Autonomous Telemetry & Antigravity Handshake
Maintain `TITAN_CYCLE_REPORT_FOR_ASSISTANT.md` with live cycle health metrics, build statuses, and compliance scores so subsequent assistant interactions have an instant, verifiable record of system state.

### R5. Controlled Infrastructure & Toolchain
Use the local Android SDK at `C:\Users\Mustafa\AppData\Local\Android\Sdk` and JDK 21 at `C:\Program Files\Android\openjdk\jdk-21.0.8`. All build and emulator commands must run through the local Gradle wrapper (`gradlew.bat`) and ADB.

## Acceptance Criteria

### Build & Test Quality
- [ ] `./gradlew.bat test` passes 100% of unit tests covering evaluation engine and data repositories.
- [ ] `./gradlew.bat assembleDebug` produces a functional APK with zero compilation errors.

### Live Emulator Verification
- [ ] App deploys to `emulator-5554` and launches without crash or ANR.
- [ ] Automated navigation through Home, Search, Saved, Compare, and Account completes successfully.
- [ ] Screenshots for each verified screen are saved to `reports/screenshots/`.

### Mathematical & Spec Compliance
- [ ] Evaluation engine scores across all 8 dimensions remain consistent with the master specification formulas.
- [ ] `TITAN_CYCLE_REPORT_FOR_ASSISTANT.md` is updated with latest telemetry.
