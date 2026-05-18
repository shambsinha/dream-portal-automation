# Dream Portal Test Automation Framework - Setup Guide

## Quick Start (5 minutes)

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd dream-portal-ui-test-automation
npm install
npm run install-browsers
```

### 2. Run Tests
```bash
npm test
```

### 3. View Report
```bash
npm run test:report
```

---

## Detailed Setup

### Prerequisites Check
- Node.js 16+ ✓
- npm 7+ ✓
- Git ✓

### Step-by-Step Installation

#### Step 1: Install Dependencies
```bash
npm install
```

This installs:
- Playwright: Browser automation
- TypeScript: Type-safe code
- Testing library and utilities

#### Step 2: Install Browsers
```bash
npm run install-browsers
```

This downloads and installs:
- Chromium (Chrome engine)
- Firefox
- WebKit (Safari engine)

**Note:** First run is ~500MB, takes 5-10 minutes
Browsers are cached, subsequent runs are much faster

#### Step 3: Setup Environment (Optional)
```bash
cp .env.example .env
```

Edit `.env` to add OpenAI API key if desired:
```
OPENAI_API_KEY=sk-your-key-here
ENABLE_AI_VALIDATION=true
```

If no API key is provided, mock classifier is used automatically.

---

## Running Tests

### All Tests (Default)
```bash
npm test
```

### Specific Test File
```bash
npx playwright test tests/home.spec.ts
```

### Specific Test Case
```bash
npx playwright test --grep "T101"
```

### Browser-Specific
```bash
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:webkit    # Safari only
npm run test:all-browsers  # All three
```

### Different Modes

**Headed Mode** - See the browser:
```bash
npm run test:headed
```

**Debug Mode** - Step through tests:
```bash
npm run test:debug
```

**UI Mode** - Interactive test explorer:
```bash
npm run test:ui
```

---

## Viewing Results

### HTML Report (Recommended)
```bash
npm run test:report
```

Opens live HTML report in browser with:
- Test results
- Screenshots on failure
- Videos of failures
- Full execution timeline

### Report Location
- HTML: `test-results/html/index.html`
- JSON: `test-results/results.json`
- JUnit XML: `test-results/junit.xml`

---

## Troubleshooting

### Tests Won't Run

**Problem:** `Command 'playwright' not found`
```bash
npm install
npm run install-browsers
```

**Problem:** Port already in use
```bash
# Kill the process using the port
# Or wait a few seconds and retry
```

**Problem:** Network timeout
```bash
# Check internet connection
# Increase timeout in config/config.ts:
TIMEOUT=60000
```

### Elements Not Found

**Problem:** Selectors don't match page
```
1. Run with headed mode to see what's happening:
   npm run test:headed
   
2. Check if website HTML changed
   
3. Update selectors in page objects
```

**Problem:** Page elements load slowly
```
# Increase timeout in config/config.ts
LOADING_ANIMATION_TIMEOUT=5000
ACTION_TIMEOUT=10000
```

### AI Validation Fails

**Problem:** OpenAI API returns error
```
- Check API key is valid
- Check rate limits: https://platform.openai.com/account/billing/overview
- Framework automatically falls back to mock classifier
```

### Tests Pass Locally but Fail in CI/CD

**Solutions:**
1. Install browsers: `npm run install-browsers`
2. Use same Node.js version
3. Add more wait time for slower CI machines
4. Check for environment-specific issues

---

## CI/CD Integration

### GitHub Actions
File: `.github/workflows/tests.yml`

Automatic runs on:
- Push to main/develop
- Pull requests

View results in Actions tab.

### Manual CI/CD Setup

Check GitHub while Playwright installs in background. Update your CI config with:

```yaml
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
        with:
          name: test-results
          path: test-results/
```

---

## Project Structure

```
├── config/                 # Configuration
│   └── config.ts          # Settings and constants
├── pages/                 # Page Objects
│   ├── BasePage.ts        # Base class
│   ├── HomePage.ts        # Home page
│   ├── DreamsDiaryPage.ts # Diary page
│   └── DreamsSummaryPage.ts # Summary page
├── tests/                 # Test specs
│   ├── home.spec.ts
│   ├── dreams-diary.spec.ts
│   ├── dreams-summary.spec.ts
│   └── e2e.spec.ts
├── utils/                 # Utilities
│   ├── logger.ts         # Colored logging
│   ├── helpers.ts        # Helper methods
│   ├── aiValidator.ts    # AI validation
│   └── testData.ts       # Test data
├── playwright.config.ts  # Playwright config
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
└── README.md            # Full documentation
```

---

## Customization

### Modify Test Data
Edit `utils/testData.ts`:
```typescript
export const EXPECTED_DIARY_DATA: Dream[] = [
  { name: 'Your Dream', daysAgo: 1, type: 'Good' },
  // ...
];
```

### Change Selectors
Edit page object files, e.g., `pages/HomePage.ts`:
```typescript
readonly MY_DREAMS_BUTTON = 'button:has-text("My Dreams")';
```

### Adjust Timeouts
Edit `config/config.ts`:
```typescript
TIMEOUT: 30000,  // 30 seconds
ACTION_TIMEOUT: 10000,  // 10 seconds
```

---

## Best Practices

1. **Always use Page Objects** - Easier to maintain
2. **Check headed mode** - Debug issues visually
3. **Look at logs** - Detailed color-coded output
4. **Use --debug** - Step through tests
5. **Keep selectors stable** - Avoid brittle tests
6. **Add comments** - Explain complex logic

---

## Getting Help

1. Check the README.md for full documentation
2. Review test output and logs
3. Enable debug mode: `npm run test:debug`
4. Check if website changed: https://arjitnigam.github.io/myDreams/
5. Try in headed mode: `npm run test:headed`

---

## Common Commands Reference

```bash
# Installation
npm install                  # Install dependencies
npm run install-browsers     # Install Playwright browsers

# Testing
npm test                     # Run all tests
npm run test:headed          # Run tests in headed mode
npm run test:debug           # Debug tests
npm run test:ui              # Interactive UI mode

# Browsers
npm run test:chrome          # Chromium only
npm run test:firefox         # Firefox only
npm run test:webkit          # Safari only
npm run test:all-browsers    # All three browsers

# Reports
npm run test:report          # View test report
npm run codegen              # Code generator for writing tests

# Search tests by name
npx playwright test --grep "T202"
```

---

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run install-browsers`
3. ✅ Run `npm test` to verify installation
4. ✅ Open `npm run test:report` to see results
5. ✅ Read README.md for full documentation
6. ✅ Start writing tests!

---

**Built with ❤️ by QA Automation Team**

For issues or questions, refer to the full README.md documentation.

