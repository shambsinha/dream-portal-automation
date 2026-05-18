# Test Suite Overview

## Summary

This test automation framework includes **35 comprehensive tests** across 4 test suites:

| Suite | Tests | Focus | Status |
|-------|-------|-------|--------|
| Home Page | 6 | Loading, Content, Button, Tabs | ✅ |
| Dreams Diary | 12 | Table, Rows, Columns, Types, AI | ✅ |
| Summary Page | 12 | Stats, Counts, Recurring, Cross-check | ✅ |
| End-to-End | 5 | User Journey, Performance, Data | ✅ |

---

## Test Details

### Home Page Tests (6 tests)

#### T001: Loading Animation
- **Objective**: Verify loading animation appears and disappears
- **Steps**:
  1. Navigate to home page
  2. Verify loading spinner appears
  3. Wait ~3 seconds
  4. Verify loading spinner disappears
- **Expected Result**: Loading animation appears then vanishes
- **Status**: ✅ Active

#### T002: Main Content Visibility
- **Objective**: Verify main content becomes visible after loading
- **Steps**:
  1. Navigate to home page
  2. Wait for loading to complete
  3. Check main content is visible
- **Expected Result**: Page content is visible
- **Status**: ✅ Active

#### T003: My Dreams Button
- **Objective**: Verify "My Dreams" button is visible
- **Steps**:
  1. Navigate to home page
  2. Wait for page to fully load
  3. Check My Dreams button exists and is visible
- **Expected Result**: Button is clickable
- **Status**: ✅ Active

#### T004: Open Multiple Tabs
- **Objective**: Verify clicking My Dreams button opens two tabs
- **Steps**:
  1. Navigate to home page
  2. Click My Dreams button
  3. Verify new pages open
  4. Check for dreams-diary.html and dreams-total.html
- **Expected Result**: At least 3 pages open (original + 2 new)
- **Status**: ✅ Active

#### T005: Tab Switching
- **Objective**: Handle and switch between multiple tabs
- **Steps**:
  1. Click My Dreams button to open tabs
  2. Switch to diary tab
  3. Verify URL contains "dreams-diary"
  4. Switch to summary tab
  5. Verify URL contains "dreams-total"
- **Expected Result**: Can switch between all tabs successfully
- **Status**: ✅ Active

#### T006: Page Structure
- **Objective**: Verify home page content structure
- **Steps**:
  1. Navigate to home page
  2. Get page title
  3. Get current URL
  4. Verify both are valid
- **Expected Result**: Page has valid title and URL
- **Status**: ✅ Active

---

### Dreams Diary Page Tests (12 tests)

#### T101: Table Loads
- **Objective**: Verify table exists and loads
- **Prerequisites**: Navigate to dreams-diary.html
- **Expected Result**: Table element found and visible
- **Status**: ✅ Active

#### T102: Exactly 10 Rows
- **Objective**: Verify exactly 10 rows exist in the table
- **Steps**:
  1. Navigate to dreams diary page
  2. Extract all table rows
  3. Count rows
- **Expected Result**: Exactly 10 rows
- **Status**: ✅ Active
- **Note**: Critical test for data integrity

#### T103: Three Columns
- **Objective**: Verify each row contains required 3 columns
- **Columns Required**:
  1. Dream Name
  2. Days Ago
  3. Dream Type
- **Expected Result**: Every row has exactly 3 columns with values
- **Status**: ✅ Active

#### T104: No Empty Values
- **Objective**: Verify no empty values in any row
- **Validation**:
  - Dream Name: Not empty
  - Days Ago: Not empty
  - Dream Type: Not empty
- **Expected Result**: All cells have content
- **Status**: ✅ Active

#### T105: Valid Dream Types
- **Objective**: Verify dream types are valid (Good or Bad)
- **Valid Values**: ["Good", "Bad"]
- **Expected Result**: All dream types match valid values
- **Status**: ✅ Active
- **Error Handling**: Fails if invalid type found

#### T106: Good Dreams Count
- **Objective**: Verify good dreams count = 6
- **Expected Result**: Exactly 6 "Good" dreams
- **Status**: ✅ Active

#### T107: Bad Dreams Count
- **Objective**: Verify bad dreams count = 4
- **Expected Result**: Exactly 4 "Bad" dreams
- **Status**: ✅ Active

#### T108: Recurring Dreams
- **Objective**: Verify expected recurring dreams exist
- **Expected Recurring**:
  1. "Flying over mountains"
  2. "Lost in maze"
- **Expected Result**: Both found in diary
- **Status**: ✅ Active

#### T109: Extract Dream Data
- **Objective**: Extract and display all dream data
- **Output**: Table of all dreams with names and types
- **Expected Result**: 10 dreams extracted successfully
- **Status**: ✅ Active

#### T110: Comprehensive Validation
- **Objective**: Run all diary validations together
- **Validations**:
  - 10 rows
  - 3 columns
  - No empty values
  - Valid types
  - Correct counts
  - Recurring dreams exist
- **Expected Result**: All validations pass
- **Status**: ✅ Active

#### T111: AI Dream Classification
- **Objective**: Validate dream classifications using AI (or mock)
- **Process**:
  1. Extract all dreams
  2. Send each to OpenAI (or mock)
  3. Get AI classification
  4. Compare with UI value
  5. Report accuracy
- **Expected Result**: AI validation completes (mock used if no API)
- **Status**: ✅ Active
- **Note**: Uses mock classifier by default

#### T112: Data Consistency
- **Objective**: Verify data consistency across columns
- **Validations**:
  - Dream name length > 0
  - Days ago is valid number >= 0
  - Dream type is "Good" or "Bad"
- **Expected Result**: All 10 rows are consistent
- **Status**: ✅ Active

---

### Dreams Summary Page Tests (12 tests)

#### T201: Page Loads
- **Objective**: Verify summary page loads successfully
- **Expected Result**: Page loads with valid title and URL
- **Status**: ✅ Active

#### T202: Good Dreams = 6
- **Objective**: Verify good dreams count
- **Expected Value**: 6
- **Status**: ✅ Active

#### T203: Bad Dreams = 4
- **Objective**: Verify bad dreams count
- **Expected Value**: 4
- **Status**: ✅ Active

#### T204: Total Dreams = 10
- **Objective**: Verify total dreams count
- **Expected Value**: 10
- **Status**: ✅ Active

#### T205: Recurring Dreams = 2
- **Objective**: Verify recurring dreams count
- **Expected Value**: 2
- **Status**: ✅ Active

#### T206: Recurring Dreams Names
- **Objective**: Verify recurring dreams list
- **Expected Names**:
  1. "Flying over mountains"
  2. "Lost in maze"
- **Status**: ✅ Active

#### T207: Get Statistics
- **Objective**: Extract and display summary statistics
- **Output**: All summary values logged
- **Expected Result**: All stats retrieved successfully
- **Status**: ✅ Active

#### T208: Get Recurring List
- **Objective**: Extract recurring dreams list
- **Expected Result**: List of recurring dreams
- **Status**: ✅ Active

#### T209: Verify All Counts
- **Objective**: Verify all summary counts together
- **Expected Result**: All count assertions pass
- **Status**: ✅ Active

#### T210: Data Consistency
- **Objective**: Validate summary data consistency
- **Validations**:
  - Good + Bad = Total
  - Recurring <= Total
- **Expected Result**: Math checks out
- **Status**: ✅ Active

#### T211: Cross-Check with Diary
- **Objective**: Cross-verify diary data matches summary
- **Process**:
  1. Get counts from diary page
  2. Get counts from summary page
  3. Compare all values
- **Expected Result**: All values match between pages
- **Status**: ✅ Active
- **Note**: Best test for data integrity

#### T212: Summary Report
- **Objective**: Print summary report
- **Output**: Formatted summary of all values
- **Status**: ✅ Active

---

### End-to-End Integration Tests (5 tests)

#### E2E-001: Complete User Journey
- **Objective**: Test complete flow: Home > Diary > Summary
- **Scenario**:
  1. Navigate to home page
  2. Go to diary page
  3. Validate diary data
  4. Go to summary page
  5. Validate summary stats
  6. Cross-verify all data
- **Expected Result**: Complete journey succeeds
- **Status**: ✅ Active

#### E2E-002: Tab Handling
- **Objective**: Test tab opening and switching from home page
- **Expected Result**: Can open and switch between tabs
- **Status**: ✅ Active

#### E2E-003: Multi-Browser Test
- **Objective**: Validate tests run on all browsers
- **Browsers**: Chrome, Firefox, Safari
- **Expected Result**: All tests pass on all browsers
- **Status**: ✅ Active

#### E2E-004: Performance Check
- **Objective**: Measure page load times
- **Metrics**:
  - Home page load time
  - Diary page load time
  - Summary page load time
- **Expected Result**: Load times within acceptable range
- **Status**: ✅ Active

#### E2E-005: Data Integrity
- **Objective**: Verify data doesn't change between page navigations
- **Process**:
  1. Get diary data
  2. Navigate to summary
  3. Navigate back to diary
  4. Verify data matches
- **Expected Result**: Data is consistent
- **Status**: ✅ Active

---

## Test Execution Summary

### Quick Run
```bash
npm test
```

### By Browser
```bash
npm run test:chrome    # Chromium
npm run test:firefox   # Firefox
npm run test:webkit    # Safari
```

### By Category
```bash
npx playwright test tests/home.spec.ts
npx playwright test tests/dreams-diary.spec.ts
npx playwright test tests/dreams-summary.spec.ts
npx playwright test tests/e2e.spec.ts
```

### By Test Name
```bash
npx playwright test --grep "T102"  # Specific test
npx playwright test --grep "Recurring"  # Multiple tests
```

---

## Expected Results

### All Tests Pass When:
- ✅ Website is accessible at https://arjitnigam.github.io/myDreams/
- ✅ Home page loads with proper animation
- ✅ Diary has exactly 10 rows with 3 columns each
- ✅ All dream types are "Good" or "Bad"
- ✅ 6 good dreams and 4 bad dreams
- ✅ 2 recurring dreams: "Flying over mountains" and "Lost in maze"
- ✅ Summary page shows correct statistics
- ✅ All values are consistent across pages

### Test Failures Indicate:
- ❌ Website HTML changed
- ❌ Data values changed
- ❌ Selectors broken
- ❌ Page layout changed
- ❌ Missing elements

---

## Reporting

All test runs generate:

1. **HTML Report**: `test-results/html/index.html`
   - Visual test results
   - Screenshots on failure
   - Video clips
   - Execution timeline

2. **JSON Report**: `test-results/results.json`
   - Machine-readable format
   - For CI/CD integration

3. **JUnit XML**: `test-results/junit.xml`
   - Standard test format
   - For build systems

View report:
```bash
npm run test:report
```

---

## Notes

- Tests are independent and can run in parallel
- Tests handle multiple tabs and windows
- AI validation falls back to mock if API unavailable
- All tests include detailed logging
- Screenshots captured on failure
- Video recordings of failures available

---

**Total Test Count: 35 tests**
**Estimated Run Time: 5-10 minutes**
**Success Rate Target: 100%**

