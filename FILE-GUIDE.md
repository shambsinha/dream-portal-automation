# Project Manifest & File Guide

Complete overview of all files in the Dream Portal Test Automation Framework.

## 📁 Directory Structure

### Root Level Files

| File | Purpose | Size |
|------|---------|------|
| `package.json` | NPM dependencies and scripts | Configuration |
| `tsconfig.json` | TypeScript compiler settings | Configuration |
| `playwright.config.ts` | Playwright test configuration | Configuration |
| `.gitignore` | Git ignore rules | Configuration |
| `.env.example` | Environment variables template | Template |
| `START-HERE.md` | Quick start guide | Documentation |
| `SETUP.md` | Detailed setup instructions | Documentation |
| `README.md` | Full documentation | Documentation |
| `TEST-SUITE.md` | All tests explained | Documentation |

---

## 📂 `/pages` - Page Object Model

Contains page object classes for application pages.

| File | Purpose | Class | Key Methods |
|------|---------|-------|------------|
| `BasePage.ts` | Base page class | `BasePage` | `navigateTo()`, `click()`, `getText()`, `waitForElement()`, `takeScreenshot()` |
| `HomePage.ts` | Home page | `HomePage` | `waitForLoadingToComplete()`, `verifyMyDreamsButtonVisible()`, `clickMyDreamsButton()`, `getAllTabs()`, `switchToTab()` |
| `DreamsDiaryPage.ts` | Diary page | `DreamsDiaryPage` | `getAllDreamRows()`, `verifyTableHasTenRows()`, `verifyDreamTypesAreValid()`, `getGoodDreamCount()`, `getRecurringDreams()` |
| `DreamsSummaryPage.ts` | Summary page | `DreamsSummaryPage` | `getSummaryStats()`, `verifyGoodDreamsCount()`, `verifyRecurringDreamsListContains()`, `getRecurringDreamsList()` |

### Page Object Pattern
```
BasePage (Abstract)
├── HomePage
├── DreamsDiaryPage
└── DreamsSummaryPage
```

---

## 🧪 `/tests` - Test Specifications

Contains all test cases organized by feature.

| File | Purpose | Tests | Focus |
|------|---------|-------|-------|
| `home.spec.ts` | Home page tests | 6 tests | Loading, content, button, tabs |
| `dreams-diary.spec.ts` | Diary page tests | 12 tests | Table, data, validation, AI |
| `dreams-summary.spec.ts` | Summary page tests | 12 tests | Stats, counts, consistency |
| `e2e.spec.ts` | End-to-end tests | 5 tests | Journey, performance, data |

### Test IDs
- **T001-T006**: Home page tests
- **T101-T112**: Dreams diary tests
- **T201-T212**: Summary page tests
- **E2E-001-E2E-005**: End-to-end tests

---

## 🛠️ `/utils` - Utility Classes

Reusable utilities and helpers.

| File | Purpose | Class | Key Methods |
|------|---------|-------|------------|
| `logger.ts` | Logging utility | `Logger` | `info()`, `success()`, `error()`, `warn()`, `section()`, `table()`, `debug()` |
| `helpers.ts` | Common helpers | `TestHelpers` | `waitForElementVisible()`, `getTableRows()`, `handleNewTab()`, `takeScreenshot()`, `sleep()`, `extractNumber()` |
| `aiValidator.ts` | AI validation | `AIValidator` | `classifyDream()`, `validateDream()`, `validateMultipleDreams()` |
| `testData.ts` | Test data management | `TestData` | `getDreamByName()`, `getGoodDreams()`, `getRecurringDreams()`, `getDreamCounts()` |

### Utility Features

**Logger** - Colored console output:
```typescript
Logger.info('Information');
Logger.success('✓ Success');
Logger.error('✗ Error');
Logger.warn('Warning');
Logger.section('Section');
```

**TestHelpers** - Common test operations:
```typescript
await TestHelpers.waitForElementVisible(page, selector);
const rows = await TestHelpers.getTableRows(page, 'table');
await TestHelpers.takeScreenshot(page, 'name');
```

**AIValidator** - Dream classification:
```typescript
const validator = new AIValidator();
const result = await validator.classifyDream('Flying');
const results = await validator.validateMultipleDreams(dreams);
```

**TestData** - Test data helpers:
```typescript
const dream = TestData.getDreamByName('Flying');
const goodDreams = TestData.getGoodDreams();
const recurring = TestData.getRecurringDreams();
```

---

## ⚙️ `/config` - Configuration

Configuration and constants.

| File | Purpose |
|------|---------|
| `config.ts` | All configurable values and expected test data |

### Config Values
- Base URL
- Timeouts
- Expected test data (counts, names)
- Valid values
- Locators (CSS selectors)

---

## 🔧 `/`.github/workflows` - CI/CD

GitHub Actions workflows for continuous integration.

| File | Purpose |
|------|---------|
| `tests.yml` | Automated test execution on push/PR |

Runs:
- On every push to main/develop
- On every pull request
- Uploads artifacts (reports, screenshots)

---

## 📊 Generated Files (Not Committed)

These are generated during test runs:

| Directory | Contents |
|-----------|----------|
| `test-results/html/` | HTML test report |
| `test-results/screenshots/` | Screenshots on failure |
| `test-results/videos/` | Video recordings |
| `node_modules/` | NPM dependencies |
| `.playwright/` | Browser cache |

---

## 📄 Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Playwright settings (browsers, timeouts, reporters) |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Project metadata and dependencies |
| `.gitignore` | Files to exclude from git |
| `.env.example` | Template for environment variables |

---

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `START-HERE.md` | Quick start (5 min) | Everyone |
| `SETUP.md` | Detailed setup | Developers |
| `README.md` | Full documentation | Developers |
| `TEST-SUITE.md` | All tests explained | QA Engineers |
| `FILE-GUIDE.md` | This file | Developers |

---

## 🔍 File Statistics

```
Total Files: 50+
Total Tests: 35
Total Lines of Code: ~3000+
Documentation: ~2000 lines
Test Files: 4
Page Objects: 4
Utilities: 4
```

---

## 🎯 Key Features in Each File

### BasePage.ts (100+ lines)
- Navigation
- Element interactions
- Waiting mechanisms
- Screenshots
- Utility methods

### HomePage.ts (150+ lines)
- Loading animation handling
- Button identification
- Tab/window management
- Content verification

### DreamsDiaryPage.ts (300+ lines)
- Table extraction
- Row/column validation
- Dream type verification
- Recurring dream detection

### DreamsSummaryPage.ts (300+ lines)
- Statistics extraction
- Value verification
- Recurring list extraction
- Cross-page comparison

### Logger.ts (50+ lines)
- Color-coded output
- Time stamps
- Table formatting
- Section headers

### Helpers.ts (200+ lines)
- 20+ common helper methods
- Element waiting
- Table operations
- Screenshot capture

### AIValidator.ts (150+ lines)
- OpenAI integration
- Mock fallback
- Batch validation
- Result reporting

### Config.ts (40+ lines)
- All magic numbers
- Expected values
- Selector patterns
- API configuration

---

## 🔄 File Dependencies

```
Tests
  ├── Import Page Objects
  │   ├── HomePage imports BasePage
  │   ├── DreamsDiaryPage imports BasePage
  │   └── DreamsSummaryPage imports BasePage
  ├── Import Utilities
  │   ├── Logger
  │   ├── TestHelpers
  │   ├── AIValidator
  │   └── TestData
  └── Import Config

Page Objects
  ├── BasePage
  │   ├── Logger
  │   └── TestHelpers
  └── Config

Utilities
  └── (No inter-dependencies)
```

---

## 📋 Checklist for Understanding

- [ ] Read START-HERE.md
- [ ] Read SETUP.md
- [ ] Explore /pages directory
- [ ] Explore /tests directory
- [ ] Explore /utils directory
- [ ] Review config/config.ts
- [ ] Read README.md
- [ ] Read TEST-SUITE.md (for details on each test)
- [ ] Run `npm test`
- [ ] View `npm run test:report`

---

## ✨ Key Points

1. **Page Objects** - All page interactions are in `/pages`
2. **Tests** - All test cases are in `/tests`
3. **Utilities** - All helpers are in `/utils`
4. **Config** - All settings are in `config/config.ts`
5. **Documentation** - All docs are markdown files in root

### Adding New Tests
1. Create page object in `/pages` (if needed)
2. Create test file in `/tests`
3. Import page object and utilities
4. Write test using page objects

### Adding New Page Object
1. Extend BasePage
2. Add locators (selectors)
3. Add methods for interactions
4. Use Logger and TestHelpers internally

---

## 🔗 Quick Links

- **Quick Start**: [START-HERE.md](START-HERE.md)
- **Detailed Setup**: [SETUP.md](SETUP.md)
- **Full Docs**: [README.md](README.md)
- **All Tests**: [TEST-SUITE.md](TEST-SUITE.md)
- **This File**: [FILE-GUIDE.md](FILE-GUIDE.md)

---

**This is your roadmap to understanding the project structure!**

