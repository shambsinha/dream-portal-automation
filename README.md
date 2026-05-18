# Dream Portal UI Test Automation Framework

A production-ready, comprehensive UI test automation framework for the Dream Portal application built with **Playwright** and **TypeScript**.

## 🎯 Overview

This is an industry-grade test automation framework implementing:
- **Page Object Model (POM)** for clean separation of concerns
- **Comprehensive logging** for detailed test execution tracking
- **AI-powered validation** with OpenAI integration (optional with mock fallback)
- **Multi-browser support** (Chromium, Firefox, WebKit)
- **HTML & JUnit reporting** with screenshots on failure
- **Cross-browser testing** capabilities

## 📋 Test Coverage

### Test Categories

#### Home Page Tests (6 tests)
- **T001**: Loading animation appears and disappears after ~3 seconds
- **T002**: Main content becomes visible after loading
- **T003**: My Dreams button is visible
- **T004**: Clicking My Dreams button opens two tabs/windows
- **T005**: Handle and switch between multiple tabs
- **T006**: Verify home page content structure

#### Dreams Diary Page Tests (12 tests)
- **T101**: Table exists and loads
- **T102**: Exactly 10 rows exist
- **T103**: Each row contains required 3 columns (Dream Name, Days Ago, Dream Type)
- **T104**: No empty values in any row
- **T105**: Dream types are valid (Good or Bad only)
- **T106**: Verify good dreams count matches expected (6)
- **T107**: Verify bad dreams count matches expected (4)
- **T108**: Verify recurring dreams exist (Flying over mountains, Lost in maze)
- **T109**: Extract and display all dream data
- **T110**: Comprehensive dreams diary validation
- **T111**: AI validation of dream classifications (with fallback)
- **T112**: Verify data consistency across columns

#### Dreams Summary Page Tests (12 tests)
- **T201**: Page loads successfully
- **T202**: Good Dreams count = 6
- **T203**: Bad Dreams count = 4
- **T204**: Total Dreams count = 10
- **T205**: Recurring Dreams count = 2
- **T206**: Recurring dreams list contains: "Flying over mountains", "Lost in maze"
- **T207**: Get and display summary statistics
- **T208**: Get recurring dreams list
- **T209**: Verify all summary counts together
- **T210**: Validate summary data consistency
- **T211**: Cross-check diary data with summary
- **T212**: Print summary report

**Total: 30 comprehensive tests**

## 🏗️ Project Structure

```
dream-portal-ui-test-automation/
├── config/
│   └── config.ts                 # Configuration and constants
├── pages/
│   ├── BasePage.ts               # Base page class with common methods
│   ├── HomePage.ts               # Home page object model
│   ├── DreamsDiaryPage.ts         # Dreams diary page object model
│   └── DreamsSummaryPage.ts       # Dreams summary page object model
├── tests/
│   ├── home.spec.ts              # Home page tests
│   ├── dreams-diary.spec.ts      # Dreams diary tests
│   └── dreams-summary.spec.ts    # Dreams summary tests
├── utils/
│   ├── logger.ts                 # Colored logging utility
│   ├── helpers.ts                # Common test helper methods
│   ├── aiValidator.ts            # AI dream validation utility
│   └── testData.ts               # Test data management
├── test-results/                 # Generated test reports (gitignored)
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dream-portal-ui-test-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install-browsers
   ```

4. **Setup environment variables (optional)**
   ```bash
   cp .env.example .env
   # Edit .env to add your OpenAI API key if you want AI validation
   ```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests on specific browser
```bash
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:webkit    # Safari only
```

### Run tests on all browsers
```bash
npm run test:all-browsers
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/home.spec.ts
```

### Run specific test by name
```bash
npx playwright test --grep "T101"
```

## 📊 Test Reports

After running tests, reports are generated in `test-results/`:

- **HTML Report**: `test-results/html/index.html` - Open in browser for visual report
- **JSON Report**: `test-results/results.json` - Machine-readable format
- **JUnit Report**: `test-results/junit.xml` - For CI/CD integration
- **Screenshots**: Automatically captured on failures
- **Videos**: Recorded on failures

View the HTML report:
```bash
npm run test:report
```

## 🤖 AI Dream Classification Validation

### How It Works

The framework includes **optional AI-powered validation** to:
1. Send each dream name to OpenAI
2. Get AI classification (Good or Bad)
3. Compare with UI value
4. Assert correctness

### With OpenAI API

1. Get your API key from: https://platform.openai.com/api-keys
2. Create `.env` file from `.env.example`
3. Add your API key
4. Enable AI validation:
   ```
   OPENAI_API_KEY=sk-...your-key...
   ENABLE_AI_VALIDATION=true
   ```
5. Run tests with AI validation enabled

### With Mock Fallback (Default)

If:
- API key is not provided
- OpenAI API is unavailable
- `ENABLE_AI_VALIDATION=false`

The framework automatically uses a **mock classifier** that:
- Analyzes dream names for keywords
- Makes intelligent classifications (Good/Bad)
- Works 100% offline
- Requires no API key

Test output will show which mode is being used.

## 📝 Logging

All tests include detailed color-coded logging:

- **BLUE** → Information
- **GREEN** → Success
- **YELLOW** → Warnings
- **RED** → Errors
- **CYAN** → Section headers

Example output:
```
[2024-05-18T10:30:45.123Z] [INFO] Navigating to: https://arjitnigam.github.io/myDreams/
[2024-05-18T10:30:47.456Z] [SUCCESS] Successfully navigated
[2024-05-18T10:30:49.789Z] [INFO] ========== Waiting for Loading Animation to Complete ==========
```

## 🔧 Configuration

Edit `config/config.ts` to customize:

```typescript
export const config = {
  BASE_URL: 'https://arjitnigam.github.io/myDreams/',
  TIMEOUT: 30000,
  EXPECTED_DIARY_ROWS: 10,
  EXPECTED_GOOD_DREAMS: 6,
  EXPECTED_BAD_DREAMS: 4,
  EXPECTED_TOTAL_DREAMS: 10,
  EXPECTED_RECURRING_DREAMS: 2,
  EXPECTED_RECURRING_DREAM_NAMES: ['Flying over mountains', 'Lost in maze'],
  VALID_DREAM_TYPES: ['Good', 'Bad'],
  // ... more options
};
```

## 📚 Page Object Model

### BasePage
Base class providing common methods:
- `navigateTo()` - Navigate to URL
- `click()` - Click element
- `typeText()` - Type text
- `getText()` - Get element text
- `waitForElement()` - Wait for visibility
- `takeScreenshot()` - Capture screenshot
- And many more...

### HomePage
Specific to home page:
- `navigateToHome()` - Go to home
- `waitForLoadingToComplete()` - Wait for loader
- `verifyMainContentVisible()` - Check content
- `verifyMyDreamsButtonVisible()` - Check button
- `clickMyDreamsButton()` - Open tabs
- `getAllTabs()`, `switchToTab()` - Tab handling

### DreamsDiaryPage
Specific to diary page:
- `navigateToDreamsDiary()` - Navigate
- `getAllDreamRows()` - Extract data
- `verifyTableHasTenRows()` - Verify rows
- `verifyDreamTypesAreValid()` - Validate types
- `getGoodDreamCount()`, `getBadDreamCount()` - Count dreams
- `getRecurringDreams()` - Get recurring
- `verifyRecurringDreamsExist()` - Verify recurring

### DreamsSummaryPage
Specific to summary page:
- `navigateToDreamsSummary()` - Navigate
- `getSummaryStats()` - Extract statistics
- `verifyGoodDreamsCount()` - Verify good
- `verifyBadDreamsCount()` - Verify bad
- `verifyTotalDreamsCount()` - Verify total
- `verifyRecurringDreamsCount()` - Verify recurring
- `getRecurringDreamsList()` - Get list
- `verifySummaryCounts()` - Verify all

## 🛠️ Utilities

### Logger (logger.ts)
```typescript
Logger.info('Information message');
Logger.success('Success message');
Logger.error('Error message', error);
Logger.warn('Warning message');
Logger.section('Section Title');
Logger.table(data);
```

### TestHelpers (helpers.ts)
```typescript
TestHelpers.waitForElementVisible(page, selector);
TestHelpers.getTableRows(page, selector);
TestHelpers.handleNewTab(page);
TestHelpers.extractNumber(text);
```

### AIValidator (aiValidator.ts)
```typescript
const validator = new AIValidator();
const result = await validator.classifyDream('Flying over mountains');
const results = await validator.validateMultipleDreams(dreams);
```

## 🐛 Troubleshooting

### Tests timing out
- Increase `TIMEOUT` in `config/config.ts`
- Check internet connection
- Verify website is accessible

### Elements not found
- Check selectors in page objects
- Website HTML might have changed
- Run with `--headed` to see what's happening

### AI validation fails
- Check OpenAI API key is valid
- Check rate limits on API
- Falls back to mock classifier automatically

### Tab switching issues
- Wait for pages to fully load with `waitForPageLoad()`
- Use `switchToTabByUrl()` instead of index

### Tests pass locally but fail in CI
- Ensure Node.js version is consistent
- Install browsers: `npm run install-browsers`
- Set CI environment variable in config

## 📦 Dependencies

### Core
- **@playwright/test**: ^1.40.1 - Browser automation
- **typescript**: ^5.3.3 - Language
- **dotenv**: ^16.3.1 - Environment management

### Optional AI
- **openai**: ^4.24.2 - OpenAI API client
- **axios**: ^1.6.2 - HTTP client

## 🔒 Security

- API keys stored in `.env` (not committed)
- `.gitignore` excludes sensitive files
- No credentials in code

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run install-browsers
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## 🎓 Best Practices

1. **Use Page Objects**: All page interactions through POM classes
2. **Meaningful Assertions**: Clear what each test validates
3. **Detailed Logging**: Easy debugging with console output
4. **No Flaky Tests**: Proper waits and element handling
5. **Parallel Execution**: Tests run in parallel for speed
6. **Screenshot on Failure**: Easy bug reproduction
7. **Keep Selectors Stable**: Avoid brittle CSS selectors

## 🚀 Future Enhancements

- [ ] Performance metrics collection
- [ ] Visual regression testing
- [ ] API testing integration
- [ ] Performance benchmarks
- [ ] Custom reporter plugins
- [ ] Slack notifications
- [ ] Advanced filtering options

## 📞 Support

For issues or questions:
1. Check test output and error messages
2. Enable debug mode: `npm run test:debug`
3. Review page object implementations
4. Check website changes at: https://arjitnigam.github.io/myDreams/

## 📄 License

MIT License - Feel free to use and modify

---

## 🎉 Highlights

✅ **30 comprehensive tests**
✅ **Page Object Model** implementation
✅ **AI-powered validation** with fallback
✅ **Multi-browser support** (Chrome, Firefox, Safari)
✅ **Detailed logging** for debugging
✅ **HTML reports** with screenshots
✅ **Tab/window handling** for multiple pages
✅ **Production-ready** code quality
✅ **GitHub-ready** project structure
✅ **Zero configuration** to get started

---

**Built with ❤️ by QA Automation Team**

