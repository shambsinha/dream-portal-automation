# START HERE 👈

Welcome to the **Dream Portal UI Test Automation Framework**! This is a production-ready, comprehensive testing solution. Let's get you up and running in 5 minutes.

## ⚡ Quick Start (5 minutes)

### 1️⃣ Installation
```bash
npm install
npm run install-browsers
```

### 2️⃣ Run Tests
```bash
npm test
```

### 3️⃣ View Results
```bash
npm run test:report
```

**Done! 🎉** Your first test run is complete.

---

## 📚 Documentation Guide

### New to This Framework?
Read in this order:

1. **This file** ← You are here
2. **[SETUP.md](SETUP.md)** - Detailed setup instructions
3. **[README.md](README.md)** - Complete documentation
4. **[TEST-SUITE.md](TEST-SUITE.md)** - All 35 tests explained

### Want to Run Tests?
```bash
npm test              # All tests
npm run test:headed   # See browser
npm run test:debug    # Step through
npm run test:ui       # Interactive mode
```

### Want to View Results?
```bash
npm run test:report
```

### Want to Add Tests?
See "Writing Tests" section below.

---

## 📂 Project Structure

```
📁 pages/              # Page Objects (POM)
  ├── BasePage.ts      # Base functionality
  ├── HomePage.ts      # Home page
  ├── DreamsDiaryPage.ts
  └── DreamsSummaryPage.ts

📁 tests/              # Test Files
  ├── home.spec.ts
  ├── dreams-diary.spec.ts
  ├── dreams-summary.spec.ts
  └── e2e.spec.ts

📁 utils/              # Helper Utilities
  ├── logger.ts        # Colored logging
  ├── helpers.ts       # Common methods
  ├── aiValidator.ts   # AI validation
  └── testData.ts      # Test data

📁 config/
  └── config.ts        # Settings

📄 playwright.config.ts  # Playwright settings
📄 tsconfig.json         # TypeScript settings
📄 package.json          # Dependencies
```

---

## 🧪 What's Tested?

### ✅ Home Page (6 tests)
- Loading animation
- Content visibility
- Button functionality
- Tab handling

### ✅ Dreams Diary (12 tests)
- Table structure (10 rows, 3 columns)
- Data validation
- Dream types (Good/Bad)
- Recurring dreams
- **AI classification** (optional)

### ✅ Summary Page (12 tests)
- Statistics validation
- Good/Bad counts
- Recurring dreams list
- Cross-page consistency

### ✅ End-to-End (5 tests)
- Complete user journey
- Performance metrics
- Data integrity
- Multi-browser testing

**Total: 35 comprehensive tests**

---

## 🚀 Common Commands

| Command | What it does |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Tests with visible browser |
| `npm run test:debug` | Debug mode (step through) |
| `npm run test:ui` | Interactive test explorer |
| `npm run test:chrome` | Chrome only |
| `npm run test:firefox` | Firefox only |
| `npm run test:webkit` | Safari only |
| `npm run test:report` | View HTML report |
| `npm run install-browsers` | Install Playwright browsers |

### Run Specific Tests
```bash
# By test file
npx playwright test tests/home.spec.ts

# By test name
npx playwright test --grep "T102"

# By category
npx playwright test --grep "Diary"
```

---

## 🤖 AI Dream Validation

### Default: Mock Classifier ✓
Works **100% offline**, no API key needed
- Analyzes dream names for keywords
- Makes intelligent classifications
- Works automatically

### With OpenAI API (Optional)
```bash
# 1. Create .env file
cp .env.example .env

# 2. Add your API key (from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-key-here
ENABLE_AI_VALIDATION=true

# 3. Tests will use real AI
npm test
```

**No API key?** Mock classifier is used automatically. You lose nothing!

---

## 📊 Test Reports

After running tests:

### View in Browser
```bash
npm run test:report
```

### Files Generated
- `test-results/html/index.html` - Click through results
- `test-results/results.json` - Machine-readable
- `test-results/junit.xml` - For CI/CD

### What You See
- ✅ Pass/Fail status
- 📸 Screenshots on failure
- 🎥 Video recordings
- ⏱️ Execution timeline

---

## ✍️ Writing Tests

### Simple Test Example
```typescript
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { Logger } from '../utils/logger';

test('My Test', async ({ browser }) => {
  const page = await browser.newPage();
  const homePage = new HomePage(page);
  
  // Navigate
  await homePage.navigateToHome();
  Logger.info('Page loaded');
  
  // Assert
  const visible = await homePage.isElementVisible('button');
  expect(visible).toBeTruthy();
  
  // Cleanup
  await page.close();
});
```

### Using Page Objects
```typescript
const homePage = new HomePage(page);
await homePage.navigateToHome();
await homePage.waitForPageFullyLoaded();
await homePage.verifyMyDreamsButtonVisible();
```

### Using Logger
```typescript
Logger.section('Test section');
Logger.info('Information');
Logger.success('✓ Test passed');
Logger.error('✗ Test failed', error);
Logger.warn('Warning message');
Logger.debug('Debug info');
```

### Using Helpers
```typescript
import { TestHelpers } from '../utils/helpers';

await TestHelpers.waitForElementVisible(page, selector);
const text = await TestHelpers.getElementText(page, selector);
await TestHelpers.takeScreenshot(page, 'my-screenshot');
```

---

## 🛠️ Troubleshooting

### ❌ Tests won't run
```bash
# Install dependencies
npm install

# Install browsers
npm run install-browsers
```

### ❌ Elements not found
```bash
# Run in headed mode to see what's happening
npm run test:headed

# Check if website changed
# Try with selectors from browser DevTools
```

### ❌ Timeout errors
```typescript
// Increase timeout in config/config.ts
TIMEOUT: 60000  // 60 seconds
```

### ❌ AI validation errors
Framework automatically uses mock classifier. Check logs:
```
[INFO] AI Validation disabled or API key not configured.
       Using mock classifier.
```

---

## 📚 Deep Dive

Learn more:
- **Page Objects**: `/pages` folder
- **Test Examples**: `/tests` folder
- **Utilities**: `/utils` folder
- **Configuration**: `/config/config.ts`

Check [README.md](README.md) for complete documentation.

---

## 🎯 Next Steps

### Now:
- [ ] Run `npm install`
- [ ] Run `npm run install-browsers`
- [ ] Run `npm test`
- [ ] Check `npm run test:report`

### Then:
- [ ] Read [SETUP.md](SETUP.md) for detailed info
- [ ] Read [README.md](README.md) for full documentation
- [ ] Review [TEST-SUITE.md](TEST-SUITE.md) for test details
- [ ] Write your first test
- [ ] Push to GitHub!

### Advanced:
- [ ] Setup CI/CD with GitHub Actions (.github/workflows/tests.yml)
- [ ] Add more test cases
- [ ] Integrate with your build system
- [ ] Setup Slack notifications

---

## 📞 Need Help?

1. Check the logs (very detailed!)
2. Run with `npm run test:debug`
3. View tests in headed mode: `npm run test:headed`
4. Read the full [README.md](README.md)
5. Check test files for examples

---

## 🎉 You're Ready!

Everything is set up. Just run:
```bash
npm test
```

Then view results:
```bash
npm run test:report
```

**That's it!** 🚀

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| [START-HERE.md](START-HERE.md) | Quick start (this file) |
| [SETUP.md](SETUP.md) | Detailed setup guide |
| [README.md](README.md) | Complete documentation |
| [TEST-SUITE.md](TEST-SUITE.md) | All 35 tests explained |
| [.env.example](.env.example) | Environment template |

---

**Built with ❤️ by QA Automation Team**

Ready to go? Run `npm test` now! 🚀

