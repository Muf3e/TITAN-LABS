# TITAN Product Intelligence
## App Features, Functionality, Product Journey, and Current State

**Document status:** Current implementation guide  
**Platform:** Native Android  
**Package:** `com.titanlabs.productintelligence`  
**Build state:** Debug and release test tasks currently pass  
**Data state:** Local illustrative sample data; backend integration is not connected

---

## 1. Product Purpose

TITAN Product Intelligence is an evidence-oriented electronics discovery, evaluation, comparison, and buying-decision app.

The current product focus is consumer electronics. The catalog model currently supports:

- Laptops
- Smartphones
- Tablets
- Accessories

The product architecture is intended to expand later to additional electronics and eventually other product categories.

TITAN is designed to help a user move through this journey:

**Need -> Discovery -> Search -> Filtering -> Product identity -> Specifications -> TITAN evaluation -> Benchmarks -> Online ratings and reviews -> Pros and cons -> Price comparison -> Comparison -> Purchase decision**

TITAN Score is deliberately separate from marketplace ratings. Marketplace ratings describe user or retailer-platform sentiment. TITAN Score is an evidence-based product evaluation intended to make trade-offs visible.

---

## 2. Current Application Shell

The Android app is a single-activity Jetpack Compose application with bottom navigation.

### Bottom tabs

The current bottom navigation contains five destinations:

1. **Home**
2. **Search**
3. **Saved**
4. **Compare**
5. **Account**

The navigation definitions are in `android/app/src/main/java/com/titanlabs/productintelligence/ui/nav/TitanDestinations.kt` and the destination wiring is in `android/app/src/main/java/com/titanlabs/productintelligence/ui/nav/TitanApp.kt`.

### Shared navigation behavior

- Product detail pages are opened from Search, Saved, Compare, and alternative-product links.
- The back action returns to the previous navigation destination.
- Search query and category are held in the app shell so Home actions can open Search without creating a disconnected duplicate search state.
- Search state is intended to survive navigation to a product and back.
- Saved and Compare state is held by the in-memory `ProductRepository`.
- The app currently uses local state and does not persist data across process death or devices.

---

## 3. Home Tab

### Purpose

Home is the discovery and orientation surface. It is not intended to be the complete product result list.

### Header and branding

The Home header currently displays:

- Menu icon
- TITAN LABS logo
- TITAN LABS wordmark
- Notification shortcut

The supplied logo is included in Android resources as:

`android/app/src/main/res/drawable/titan_logo.png`

The Android 12+ window splash theme (`values-v31/themes.xml`) configures `windowSplashScreenAnimatedIcon` to transparent and a neutral white background (`#FFFFFF`), ensuring the app opens directly into the custom branded Compose Splash Screen with organic corner gradients, animated fill progress bar, and tagline without flashing a redundant system logo first.

### Greeting area

Home introduces the user with:

- `Hello!`
- `What are you looking for today?`

### Search entry

The Home search field supports:

- Free-text product search
- Search by product, model, or category phrase
- Clear action
- Keyboard search action
- Camera/scan visual entry point

Submitting Home search opens the Search tab and updates the shared query state.

### Category shortcuts

Current category shortcuts include:

- Laptops
- Mobiles
- Tablets
- Accessories
- More

Selecting a category opens Search with that category selected.

### Discovery banner

Home includes a visual promotional/discovery banner with the message:

**Smarter Tech, Happier You**

It functions as an entry point into broad product discovery. In the current local build, it is a curated app asset rather than a live campaign feed.

### Popular searches

Home provides visual search shortcuts for:

- Gaming laptops
- iPhones
- Samsung phones
- Tablets

These shortcuts send a query into the shared Search workspace.

### Recent searches

Home displays recent local sample searches such as:

- Ryzen 7 laptop under 80000
- Nilgiri X200
- Best camera phone under 30000

Available behavior:

- Tap a recent search to reopen Search with that query.
- Clear recent searches from the Home section.

### Home versus Search distinction

Home is the discovery surface. Search is the working catalog surface.

Home should be used to begin exploration through categories, popular searches, campaigns, and recent searches. Search should be used for full result browsing, filters, hard constraints, and product selection.

---

## 4. Search Tab

### Purpose

Search is the primary product-finding workspace. It displays products that match a query, category, use case, and strict requirements.

### Search input

The Search screen provides:

- Search by name
- Search by model number
- Search by SKU-oriented text
- Clear query action
- Search result count
- Sample-data indicator
- Filter entry point

### Use-case filters

A horizontal filter row provides use-case selection, including the evaluation engine's supported use cases such as:

- General everyday use
- Gaming
- Student
- Programming
- Creator/content creation
- AI/ML
- Battery-first
- Photography

Use-case selection changes result ordering using the evaluation engine's use-case score.

### Structured filters

The filter sheet currently supports:

- Category
  - All
  - Laptops
  - Phones
- Minimum RAM
  - Any
  - 8 GB
  - 16 GB
  - 32 GB
- Minimum storage
  - Any
  - 256 GB
  - 512 GB
  - 1 TB
- Maximum budget
  - Any
  - INR 30,000
  - INR 60,000
  - INR 1,00,000
- Dedicated GPU only

These controls are treated as hard constraints where applicable. A product that does not satisfy a strict requirement is excluded rather than merely ranked lower.

### Search result card

Each product result card currently communicates:

- Product image or local product asset fallback
- Product name
- Product variant/configuration
- Compare selection control
- TITAN Score
- Score band
- Evidence confidence
- Online rating and review count
- Current sample price
- Retailer count
- Availability
- Freshness/verification age
- Top strength
- Top watch-out
- Discount information where available

Tapping the main card opens the product detail page. The Compare control adds or removes the product from the shared comparison list.

### Search state restoration

Search query and category are controlled by the app shell. This is intended to provide the following behavior:

1. User searches or selects a category.
2. User opens a product.
3. User presses Back.
4. The previous Search context remains available instead of resetting to an unrelated result list.

The current repository stores sample data in memory. Full filter persistence and cross-device synchronization remain future backend responsibilities.

---

## 5. Product Catalog in the Current Build

The current sample catalog includes a broader set of products than the original four-product shell.

Representative current sample products include:

### Laptops

- ASUS ROG Strix G16 (2024)
- Lenovo Legion 5 Pro
- Acer Predator Helios Neo
- MSI Katana 15
- MacBook Air M3

### Smartphones

- iPhone 15
- Samsung Galaxy S24
- Google Pixel 8
- OnePlus 12R

### Tablets and accessories

- Samsung Galaxy Tab S9
- Sony WH-1000XM5

The product model supports:

- Stable product ID
- Name
- Variant summary
- Category
- Price in INR
- Retailer count
- TITAN Score
- Evidence confidence
- Online rating and rating count
- Freshness age
- Availability
- Top strength
- Top watch-out
- Optional local image resource
- Original price
- Discount percentage

All current records are local illustrative records and should not be presented as live market truth.

---

## 6. Product Detail Page

### Entry points

A product detail page can be opened from:

- Search result card
- Saved product card
- Compare product card
- Alternative product card

### Top navigation actions

The product detail toolbar currently supports:

- Back
- Add/remove from Compare
- Save/remove from Saved
- Share action where wired by the current implementation

The Back action returns the user to the page from which the product was opened.

### Product image area

The detail page begins with the product image area. The current implementation uses local drawable product assets where available and the TITAN logo as a fallback/sample representation.

The data model already supports image metadata:

- Image URL/reference
- Alt text
- Primary-image flag
- Image source classification

The intended production image gallery will support:

1. Main white-background product image
2. Configuration or rear/side image
3. Ports and connectivity image
4. Display or keyboard image
5. Additional retailer/manufacturer images

Real image fetching is not yet connected to a backend or image-loading service in the current local build.

### Product identity

The identity area shows:

- Category
- Product name
- Variant/configuration
- Availability
- Freshness/verification age
- Sample-data status

The identity model is designed to grow into canonical identity with brand, family, series, model number, SKU, region, RAM, storage, CPU/SoC, GPU, display configuration, connectivity, color, and release generation.

### Canonical 15-Section Architecture & Sequence

The product detail screen (`ProductDetailScreen.kt`) implements the complete 15-section product intelligence sequence specified in the UI/UX baseline:

1. **Top Bar**: Back button, Favorite/Save toggle, and native Share action.
2. **Hero Image Gallery**: High-resolution product hero canvas with 5-dot page indicators.
3. **Product Identity**: Category badge (e.g. `LAPTOP`), full product name, variant string, live availability status pill (`In stock` / `Limited`), and freshness verification timestamp (`Verified today`).
4. **Ratings & Price Header**: Community star rating, review count (`1.2K reviews`), current best online price, discount badge (`↓ 12%`), and strikethrough MRP.
5. **Best Price Online**: Retailer cards (Amazon, Flipkart, Croma) with brand logos, live verified prices, and external "Visit" deep-link actions.
6. **Quick Action Row**: Interactive Compare toggle (active state synchronized with `ProductRepository`), Price Alert trigger, and Share action.
7. **TITAN Score & Intelligence Breakdown**: Global TITAN Score (0–100), rating band badge (`Exceptional`, `Excellent`), evidence confidence %, 8-dimension progress indicators with scores and weights, and algorithmic synthesis verdict.
8. **Key Strengths & Weaknesses**: Dedicated Pros (green `CheckCircle`) and Watch-outs / Trade-offs (amber `Warning`) summarizing empirical findings.
9. **Full Technical Specifications**: Comprehensive specifications sheet across Processor, GPU, Display, RAM, Storage, Battery & Charging, Ports, OS, Dimensions, Weight, Audio, and Warranty.
10. **Benchmark Intelligence**: Standardized lab tests (Geekbench 6, 3DMark TimeSpy, Battery Rundown, Thermal Stability) with score values, percentile comparison bars ("Better than X% of category"), and source platform attribution.
11. **External Reviews & Recurring Sentiment Themes**: Sentiment theme pills (Positive, Mixed, Negative with mention counts) and verified tech publication review cards (TechRadar, Tom's Hardware, PCMag) with ratings and synthesized summaries.
12. **Price History & Market Volatility**: 30-day low, average price, all-time high, and an evidence-backed buy recommendation badge ("Good time to buy — near 30-day low").
13. **Similar Alternatives & Comparisons**: Horizontally scrollable comparison candidate cards featuring alternative thumbnails, TITAN scores, prices, and specific trade-off reasons, with tap-to-navigate support.
14. **Data Provenance & Methodology**: Verification metadata displaying retailer feed count, benchmark test count, review publication count, freshness age, and an editorial independence statement.
15. **Sticky Bottom Action Bar**: Pinned action bar with "Add to Compare" / "In Compare" outlined button and high-visibility "View on Amazon" gradient buy button.

## 7. TITAN Score and Evaluation

### Position in the page

The TITAN Score section appears before online marketplace ratings.

### Score information

The score section displays:

- Global TITAN Score out of 100
- Rating band
- Evidence confidence
- Dimension-level scores
- Progress indicators
- Penalties where applied
- Reasoning and provenance summary

### Evaluation dimensions

The evaluation engine currently uses the canonical dimension model:

- Performance
- UX and Display
- Battery and Efficiency
- Build, Thermals and Reliability
- Features and Capability
- Camera or Creator Capability
- Software and Support
- Value for Money

### Score explanation

The page explains the factors that influence the score and exposes the distinction between:

- Product quality estimate
- Evidence confidence
- Online rating
- Market value

### Evidence penalties

The current engine can apply evidence-backed penalties such as:

- Acoustic or thermal load
- Sustained throttling
- Other explicitly modeled weaknesses

The production version must keep all score inputs, source records, version information, and calculation results reproducible.

---

## 8. Detailed Specifications

The specification area displays the available normalized product facts in rows.

Current sample specification records can include:

- Processor or chipset
- CPU family
- GPU
- RAM or memory
- Storage
- Display size
- Resolution
- Refresh rate
- Brightness
- Battery capacity
- Battery endurance
- Charging
- Camera configuration
- Operating system
- Build material
- Water/dust resistance
- Weight
- Ports
- Connectivity
- Keyboard and trackpad
- Audio
- Upgradeability
- Included accessories

The current local data contains representative specs, not every possible fact for every product. The backend-ready direction is to store every important fact with value, normalized value, source, timestamp, confidence, verification state, and conflict state.

---

## 9. Benchmarks

### Benchmark purpose

Benchmarks provide standardized or source-attributed evidence that supports the TITAN evaluation and lets users compare products beyond marketing claims.

### Current benchmark data model

Each benchmark record supports:

- Benchmark name
- Display value
- Better-than percentage
- Benchmark platform
- Source name
- Source URL
- Observed age

### Supported source classifications

- TITAN Lab benchmark
- Manufacturer disclosed result
- Third-party reviewer
- Community submitted result

### Current benchmark examples

Depending on category, the local sample records cover concepts such as:

- CPU multi-core performance
- GPU sustained performance
- Battery rundown
- Video-loop battery life
- Thermal throttling
- Display or performance behavior

### Intended production benchmark catalog

The future benchmark catalog should support platforms such as:

- Geekbench
- Cinebench
- PCMark
- 3DMark
- CrossMark
- AnTuTu where legally and technically appropriate
- Camera testing platforms
- Battery testing platforms
- Display testing platforms
- TITAN Lab standardized tests

Different benchmark platforms must remain distinguishable. TITAN should not combine incompatible scores into one misleading number.

### Presentation direction

The current detail page presents benchmark rows with platform/source metadata. The intended next presentation layer is a benchmark tab or grouped table with:

- Platform
- Test name
- Score
- Test version
- Test conditions
- Date observed
- Source
- Comparison percentile
- TITAN Lab result where available

---

## 10. Online Ratings and External Reviews

### Online ratings

Online ratings are displayed separately from TITAN Score.

The current model supports:

- Rating value
- Rating count
- Platform/source-specific future expansion

The production experience should show separate platform rows, for example:

| Platform | Rating | Review count | Last observed |
|---|---:|---:|---|
| Amazon | Platform-specific value | Count | Date |
| Flipkart | Platform-specific value | Count | Date |
| Manufacturer/store | Platform-specific value | Count | Date |
| Community/TITAN | Separate first-party value | Count | Date |

The current sample implementation still contains an aggregate online rating in the primary product record, while the external review model supports broader source records.

### External review records

External reviews support:

- Source name
- Source type
- Original source URL
- Optional source rating
- Publication age
- Sentiment
- TITAN-authored summary

Source types include:

- Tech publication
- Professional reviewer
- Verified purchaser
- Community forum

### Review rights and provenance

TITAN should not reproduce copyrighted third-party review text. The intended behavior is:

- Display legally usable metadata
- Show source attribution
- Link to the original article or video
- Display a short TITAN-authored paraphrase
- Extract recurring themes with evidence links
- Keep source date and freshness visible

The app's current sample content is illustrative and uses sample source URLs. Real YouTube and website review feeds require backend ingestion, provider rules, source licensing review, and freshness monitoring.

---

## 11. Strengths and Weaknesses

The product detail page presents product trade-offs using two focused sections:

### Strengths

Examples include:

- Strong sustained performance
- Bright display
- Good build quality
- Strong value
- Fast charging
- Consistent software support

### Weaknesses

Examples include:

- Heavy chassis
- Fan noise
- Limited upgradeability
- Weak low-light camera behavior
- Slow software updates
- Display limitations

These are intended to be evidence-backed summaries, not unsupported marketing language.

Review themes separately show recurring topics and sentiment, such as:

- Build quality
- Battery life
- Value
- Display quality
- Upgradeability
- Camera behavior
- Software updates

---

## 12. Offers and Buying Actions

### Offer information

Each sample offer supports:

- Retailer name
- Price
- Availability
- Verification age
- Offer URL
- Trust level
- Source type
- Optional retailer logo resource

Trust levels are:

- Trusted
- Established
- Unknown
- Caution
- Untrusted

### Offer presentation

The product page shows retailer offers with:

- Retailer identity
- Current sample price
- Availability chip
- Freshness indicator
- Buy action

The app validates external URLs before opening them and only allows `http` or `https` schemes.

### Production requirements

A production offer must additionally include:

- Seller name
- Listed price
- Effective price
- Discount conditions
- Coupon assumptions
- Shipping information
- Location or deliverability state
- Currency
- Source timestamp
- Broken-link state
- Retailer trust evidence

Current sample links are placeholders and must not be interpreted as live purchase destinations.

---

## 13. Compare Tab

### Purpose

Compare is the decision workspace for evaluating multiple products side by side.

### Default recommendations

The repository currently starts with a sample pair selected so the Compare tab is useful immediately:

- ASUS ROG Strix G16
- Lenovo Legion 5 Pro

When one product is selected, Compare can recommend another product from the same category as a second candidate.

Recommendations are intended to consider:

- Same category
- Similar price range
- Similar processor
- Similar GPU
- Similar RAM
- Similar storage
- Similar configuration
- Similar product use case

### Selection rules

- Products can be selected from Search result cards.
- Products can be selected from Product Detail.
- Maximum selection is four products.
- Products can be removed individually.
- All selections can be cleared.
- Additional products can be added from Search.

### Comparison matrix

The current side-by-side comparison includes:

- Product identity cards
- Product category
- TITAN Score
- Evidence confidence
- Online rating
- Price
- Availability
- Top strength
- Top watch-out
- Variant
- Retailer count

The matrix is horizontally scrollable so multiple products can remain comparable on a small phone screen.

### Future comparison depth

The intended full comparison table will compare:

- Every important specification
- Benchmark rows by platform
- Display and battery results
- Price history
- Retailer trust
- Review themes
- Dimension winners
- User-fit score
- Trade-offs
- Evidence coverage
- Confidence differences

---

## 14. Saved Tab

### Purpose

Saved is the personal shortlist area.

### Products tab

Saved Products currently shows local repository-backed saved products. Each saved card displays:

- Saved/favorite control
- Product image
- Product name
- Current sample price
- Open product action
- Remove from saved action
- More-options affordance

### Searches tab

Saved Searches currently displays sample saved queries such as:

- Ryzen 7 laptop under 80000
- Nilgiri X200
- Best camera phone under 30000

Selecting a saved search reopens Search.

### Future saved functionality

The production Saved area should support:

- Score changes
- Price changes
- Availability changes
- Compare shortcut
- Price alert shortcut
- Product-match alert shortcut
- Cloud sync after optional authentication
- Deletion and retention controls

---

## 15. Account Tab

The current fifth tab is Account and is wired to the More/account-style screen.

### Account section

Displays:

- Signed-out state
- Explanation that browsing does not require authentication
- Future sign-in entry point
- Purpose of authentication: sync, saved products, alerts, and history

### Preferences section

Displays:

- Price and match alert toggle
- Location state
- Explanation that location is optional
- Current limitation that prices do not yet include verified delivery estimates

### About section

Displays:

- App version/sprint information
- Local sample-data status
- Explanation that live product data is not connected

### Account roadmap

Future account capabilities include:

- Optional authentication
- Cross-device saved items
- Search history sync
- Price alerts
- Product-match alerts
- Community reviews
- Privacy and deletion controls
- Location permissions and manual pincode/city support

---

## 16. Loading, Empty, and Error Behavior

The project includes shared state composables for loading, error, and empty states.

The intended behavior is:

- Loading: skeleton-style or structured loading surfaces
- Empty: explain what is missing and provide a next action
- Error: explain what failed, whether cached data exists, and whether retry is possible
- Stale: show freshness information instead of presenting old values as real-time truth

Current local screens use honest empty states for unavailable functionality, while Search, Compare, Saved, and Account have progressively become functional local flows.

---

## 17. Visual Design and Interaction System

### Visual direction

The current design aims for:

- Minimal and practical information presentation
- Strong product hierarchy
- Light blank startup background
- TITAN blue/cyan brand accents
- Pink/favorite accents in Saved
- Warm amber for caution/freshness states
- Off-white/light background surfaces
- Dark theme support
- Compact cards and readable spacing
- Small, clear controls for repeated workflows

### Interaction conventions

- Search is available immediately.
- Product cards are tappable.
- Compare uses visible selection controls.
- Save uses familiar favorite/bookmark actions.
- External links are explicit.
- Back is always available on product detail.
- Important score and evidence states are not conveyed only by color.

### Accessibility intentions

The app includes or is designed for:

- Content descriptions
- Semantic product actions
- Scalable Compose text
- Touch-friendly controls
- Screen-reader-friendly labels
- Dark theme support
- Visible text labels alongside icons where useful

### Current visual limitation

Some sample product images are local assets, while other detail image records remain metadata-only or use the TITAN logo fallback. The production app needs a licensed, backend-delivered product image gallery with proper cropping, caching, attribution, and failure states.

---

## 18. Data and Architecture

### Android boundary

The Android app is a client and presentation layer. It should not perform the core aggregation, scraping, review ingestion, price crawling, or AI reasoning workload.

### Current local layers

The project currently includes:

- Native Android application
- Kotlin
- Jetpack Compose
- Material 3
- Single-activity architecture
- Navigation Compose
- Product model layer
- Local sample data
- In-memory ProductRepository
- TITAN evaluation engine
- Shared UI components
- Feature-specific screens

### Product pipeline intended for production

`Source -> Fetch -> Parse -> Normalize -> Validate -> Resolve Identity -> Resolve Conflicts -> Provenance -> Store -> Index -> Evaluate -> Publish`

### Current repository responsibilities

The local `ProductRepository` currently manages:

- Product retrieval
- Search filtering
- TITAN evaluation calls
- Saved product IDs
- Compare selection state
- Price alert state
- Product detail lookup

This is a local prototype boundary for the future API-backed repositories.

---

## 19. Changes Made So Far

The implementation has progressed through these major changes:

### Initial Android shell

- Created the native Android project under `android/`.
- Added Kotlin, Compose, Material 3, navigation, theme, and resources.
- Added Home, Search, Compare, Saved, and Account/More feature areas.
- Added sample data with explicit local/sample labeling.
- Added loading, error, and empty state components.

### Product detail expansion

- Added product detail navigation.
- Added product detail records for sample products.
- Added strengths and weaknesses.
- Added offers and freshness.
- Added specifications.
- Added benchmark records.
- Added review themes.
- Added alternatives.

### Product-intelligence data foundation

- Added product image metadata.
- Added benchmark platform and source metadata.
- Added external review metadata and summaries.
- Added offer URLs, trust levels, and offer source types.
- Added optional local image resource IDs.
- Added compare selection state with a four-product limit.

### Navigation and state fixes

- Moved Search query/category state into the app shell.
- Restored Search context when moving back from product detail.
- Added repository-backed saved state.
- Added repository-backed compare state.
- Added default Compare recommendations.
- Added product-detail entry points from Search, Saved, Compare, and alternatives.

### Home and Search improvements

- Added TITAN LABS logo/wordmark header.
- Added discovery category shortcuts.
- Added popular searches.
- Added recent searches.
- Added promotional/discovery banner.
- Added structured Search filters.
- Added use-case selection.
- Added hard-constraint filtering.
- Added result-card compare controls.
- Added product image presentation and fallbacks.

### Product detail improvements

- Added image-first detail layout.
- Added score dimension table/progress presentation.
- Added score explanation and penalty display.
- Added benchmark source/freshness details.
- Added external review summaries and source actions.
- Added offer BUY actions with URL scheme validation.
- Added Save and Compare toolbar actions.
- Added detailed specification presentation.

### Startup branding

- Added supplied `Logo.png` to Android drawable resources.
- Added TITAN logo to the app header.
- Added TITAN logo to Android 12+ startup splash configuration.
- Set startup background to a clean light blank surface.

---

## 20. Current Build and Test State

The current validation command is:

```powershell
cd "C:\Users\Mustafa\OneDrive\Documents\TITAN Labs\android"
.\gradlew.bat test --no-daemon --console=plain
```

Current result:

```text
BUILD SUCCESSFUL
49 actionable tasks: 13 executed, 36 up-to-date
```

The test task includes debug and release unit-test variants.

The app has also previously passed debug APK assembly through:

```powershell
.\gradlew.bat assembleDebug --no-daemon
```

The current build reports two non-blocking deprecation warnings for older Material icon names. These warnings do not prevent compilation or APK generation.

Expected debug APK location:

`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 21. Current Limitations and Production Gaps

The current app is a strong local product-intelligence prototype, but it is not yet a live marketplace intelligence product.

### Data limitations

- Product data is local and illustrative.
- Several image URLs are sample metadata rather than fetched images.
- Review URLs are sample links.
- Offer URLs are sample links.
- Prices are not live.
- Availability is not live.
- Online ratings are not independently refreshed by platform.
- Benchmark results are illustrative.
- Product identity resolution is not connected to external catalogs.
- Conflicting-source resolution is not connected to ingestion pipelines.

### Platform limitations

- No backend API is connected.
- No database is connected.
- No search index is connected.
- No production authentication is connected.
- No cloud sync is connected.
- No push notification service is connected.
- No real price-alert delivery is connected.
- No live YouTube/review ingestion is connected.
- No production retailer deep-link verification is connected.

### UX limitations

- Some product image areas still use local fallback imagery.
- Product detail image gallery behavior needs full multi-image paging.
- Online ratings need platform-by-platform presentation.
- Benchmark presentation can be expanded into dedicated tabs/charts.
- Compare recommendations need stronger matching by processor, GPU, RAM, price, and use case.
- Saved Searches are currently local/sample records.
- Account sign-in is not implemented.
- Some icon APIs show deprecation warnings.

### Release limitations

- Physical-device UI testing still needs to be performed.
- Emulator and accessibility-service testing should be expanded.
- Network failure states need live API simulation.
- Security testing is not complete because there is no backend yet.
- Real data licensing and source terms must be resolved before publication.

---

## 22. Intended Next Product Stage

The next major implementation stage should convert the current local model into a production-backed product intelligence platform.

Recommended order:

1. Finalize canonical product and variant identity.
2. Add a backend API and PostgreSQL persistence.
3. Add source/provenance records and ingestion jobs.
4. Add licensed product images and image caching.
5. Add platform-specific ratings and review metadata.
6. Add benchmark normalization without collapsing platforms incorrectly.
7. Add verified retailer offers and deep links.
8. Add complete specification catalogs by category.
9. Add persistent saved products and compare lists.
10. Add price alerts and notifications.
11. Add real comparison recommendations.
12. Add community reviews and moderation.
13. Add website clients using shared backend contracts.

The long-term TITAN vision remains larger than the current Android app: the same identity, evidence, provenance, scoring, memory, and governed-AI foundations can later support additional product categories, web clients, enterprise workflows, and broader intelligence services.
