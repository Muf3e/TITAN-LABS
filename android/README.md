# TITAN Product Intelligence — Android (Sprint 1)

This is the first native Android slice of TITAN Product Intelligence: a local,
offline UI shell built with Kotlin and Jetpack Compose. It implements the
Sprint 1 scope only.

## What this is

- A search-first Compose app shell with five bottom-navigation destinations:
  Home, Search, Compare, Saved, More.
- Local, hard-coded sample data (`data/sample/SampleData.kt`) standing in for
  the future Product Intelligence backend, including per-product detail
  content (offers, specs, benchmarks, review themes, alternatives).
- A product detail screen (`feature/detail/ProductDetailScreen.kt`), reached
  by tapping a result card in Search, showing canonical identity/variant,
  TITAN Score with confidence, online rating shown separately from the TITAN
  Score, strengths/weaknesses, current sample offers with retailer
  (provenance) and freshness labels, essential specs, a benchmark summary,
  review themes, and links to alternative sample products.
- Reusable loading/error/empty state composables (`ui/state`).
- A restrained visual direction: off-white/ink light theme, dark theme
  support, teal accent, warm amber for confidence/availability signals,
  compact 8dp-radius cards.

## What this is not

- There is no backend, network layer, scraper, or scoring engine in this
  slice, per the architecture principle that the Android client is a
  presentation layer only.
- Product results, TITAN Scores, ratings, prices, specs, benchmarks and
  reviews shown are **sample data** for shell/demo purposes and are labeled
  as such in the UI. They do not reflect real products or real TITAN
  evaluations.
- There is no comparison logic, saved-item persistence, authentication, or
  alerts logic yet — Compare, Saved and More show honest empty states
  instead of fake content.

## Prerequisites

- JDK 17 (Android Gradle Plugin 8.6 targets Java 17 bytecode; a JDK 17–21
  toolchain works — Android Studio ships a bundled JDK that satisfies this).
- Android SDK with Platform 35 and Build-Tools installed (via Android Studio
  SDK Manager, or `sdkmanager "platforms;android-35" "build-tools;35.0.0"`).
- An Android emulator (API 26+) or a physical device with USB debugging.

If you have Android Studio installed, the SDK requirement above is usually
already satisfied — otherwise install the command-line tools and accept the
SDK licenses.

## Building and running

From this `android/` directory:

```bash
# create local.properties pointing at your SDK if it is not auto-detected
echo "sdk.dir=/path/to/Android/Sdk" > local.properties

# build a debug APK
./gradlew assembleDebug

# run unit tests
./gradlew test

# install and launch on a connected device/emulator
./gradlew installDebug
```

On Windows use `gradlew.bat` instead of `./gradlew`.

Opening the `android/` folder directly in Android Studio also works and will
manage the SDK path automatically.

## Project structure

```
android/
  app/src/main/java/com/titanlabs/productintelligence/
    MainActivity.kt
    ui/theme/        Color, typography, light/dark ColorScheme
    ui/state/         LoadingState, ErrorState, EmptyState composables
    ui/components/    Shared product/score/rating UI pieces
    ui/nav/           Bottom navigation + NavHost wiring
    data/model/       SampleProduct and related enums
    data/sample/      Local sample data (clearly not live data)
    feature/home/     Home screen
    feature/search/   Search screen (query, filters, result cards)
    feature/detail/   Product detail screen (sample data only)
    feature/compare/  Compare screen (empty state)
    feature/saved/    Saved screen (empty state)
    feature/more/     More/settings screen
```

## Package

`com.titanlabs.productintelligence`

## Configuration

- minSdk 26, targetSdk/compileSdk 35
- Kotlin 2.0.21, Android Gradle Plugin 8.6.1, Compose BOM 2024.12.01
- No network, image-loading, or database dependencies are included in this
  slice, in line with the Sprint 1 scope.
