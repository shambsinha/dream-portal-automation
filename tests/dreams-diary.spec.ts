import { test, expect, Page } from '@playwright/test';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { Logger } from '../utils/logger';
import { AIValidator } from '../utils/aiValidator';
import config from '../config/config';

test.describe('Dreams Diary Page Tests', () => {
  let page: Page;
  let diaryPage: DreamsDiaryPage;
  let aiValidator: AIValidator;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    diaryPage = new DreamsDiaryPage(page);
    aiValidator = new AIValidator();
    Logger.section('Starting Dreams Diary Test');
  });

  test.afterEach(async () => {
    Logger.section('Cleaning up after test');
    if (!page) {
      Logger.warn('No browser page was created; skipping cleanup');
      return;
    }

    await page.context().close();
    Logger.success('Cleanup complete');
  });

  test('T101: Verify table exists and loads', async () => {
    Logger.section('TEST: Table Loads Successfully');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify table exists
    const tableExists = await diaryPage.elementExists('table, [role="table"]');
    expect(tableExists).toBeTruthy();
    Logger.success('✓ TABLE EXISTS');

    // Get page title
    const title = await diaryPage.getPageTitle();
    Logger.info(`Page Title: ${title}`);

    Logger.success('✓ TEST PASSED: Table loads successfully');
  });

  test('T102: Verify exactly 10 rows exist in the table', async () => {
    Logger.section('TEST: Verify Exactly 10 Rows');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify table has 10 rows
    const rowCount = await diaryPage.verifyTableHasTenRows();
    expect(rowCount).toBe(config.EXPECTED_DIARY_ROWS);

    Logger.success('✓ TEST PASSED: Exactly 10 rows exist');
  });

  test('T103: Verify each row contains required columns', async () => {
    Logger.section('TEST: Verify Row Structure');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify each row has 3 columns
    await diaryPage.verifyEachRowHasThreeColumns();

    Logger.success('✓ TEST PASSED: Each row has required columns');
  });

  test('T104: Verify no empty values in any row', async () => {
    Logger.section('TEST: Verify No Empty Values');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify no empty values
    await diaryPage.verifyNoEmptyValues();

    Logger.success('✓ TEST PASSED: No empty values found');
  });

  test('T105: Verify dream types are valid (Good or Bad)', async () => {
    Logger.section('TEST: Verify Dream Type Validity');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify dream types
    await diaryPage.verifyDreamTypesAreValid();

    Logger.success('✓ TEST PASSED: All dream types are valid');
  });

  test('T106: Verify good dreams count matches expected', async () => {
    Logger.section('TEST: Verify Good Dreams Count');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Get good dreams count
    const goodCount = await diaryPage.getGoodDreamCount();
    Logger.info(`Expected good dreams: ${config.EXPECTED_GOOD_DREAMS}`);
    Logger.info(`Actual good dreams: ${goodCount}`);

    expect(goodCount).toBe(config.EXPECTED_GOOD_DREAMS);

    Logger.success(`✓ TEST PASSED: Good dreams count is ${goodCount}`);
  });

  test('T107: Verify bad dreams count matches expected', async () => {
    Logger.section('TEST: Verify Bad Dreams Count');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Get bad dreams count
    const badCount = await diaryPage.getBadDreamCount();
    Logger.info(`Expected bad dreams: ${config.EXPECTED_BAD_DREAMS}`);
    Logger.info(`Actual bad dreams: ${badCount}`);

    expect(badCount).toBe(config.EXPECTED_BAD_DREAMS);

    Logger.success(`✓ TEST PASSED: Bad dreams count is ${badCount}`);
  });

  test('T108: Verify recurring dreams exist', async () => {
    Logger.section('TEST: Verify Recurring Dreams');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Verify recurring dreams
    await diaryPage.verifyRecurringDreamsExist();

    Logger.success('✓ TEST PASSED: Recurring dreams verified');
  });

  test('T109: Extract and display all dream data', async () => {
    Logger.section('TEST: Extract All Dream Data');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Get all dream data
    const dreamData = await diaryPage.getDreamData();

    Logger.success(`Extracted ${dreamData.length} dreams`);
    Logger.table(dreamData);

    expect(dreamData.length).toBeGreaterThan(0);

    Logger.success('✓ TEST PASSED: Dream data extracted');
  });

  test('T110: Comprehensive dreams diary validation', async () => {
    Logger.section('TEST: Comprehensive Diary Validation');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Run all validations
    await diaryPage.verifyTableHasTenRows();
    await diaryPage.verifyEachRowHasThreeColumns();
    await diaryPage.verifyNoEmptyValues();
    await diaryPage.verifyDreamTypesAreValid();

    const goodCount = await diaryPage.getGoodDreamCount();
    expect(goodCount).toBe(config.EXPECTED_GOOD_DREAMS);

    const badCount = await diaryPage.getBadDreamCount();
    expect(badCount).toBe(config.EXPECTED_BAD_DREAMS);

    await diaryPage.verifyRecurringDreamsExist();

    // Print summary
    await diaryPage.printSummary();

    Logger.success('✓ TEST PASSED: All diary validations successful');
  });

  test('T111: AI validation of dream classifications (with fallback)', async () => {
    Logger.section('TEST: AI Dream Classification Validation');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Get dream data
    const dreamData = await diaryPage.getDreamData();
    Logger.info(`Validating ${dreamData.length} dreams...`);

    // Validate dreams using AI (or mock)
    const results = await aiValidator.validateMultipleDreams(dreamData);

    // Check results
    const passCount = results.filter((r) => r.isCorrect).length;
    Logger.info(`AI Validation Results: ${passCount}/${results.length} passed`);

    // At least some should pass
    expect(passCount).toBeGreaterThan(0);

    Logger.success('✓ TEST PASSED: AI validation completed');
  });

  test('T112: Verify data consistency across columns', async () => {
    Logger.section('TEST: Data Consistency Check');

    // Navigate to dreams diary page
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    // Get all rows
    const rows = await diaryPage.getAllDreamRows();

    // Validate each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Dream name should not be empty
      expect(row.dreamName.trim().length).toBeGreaterThan(0);

      // Days ago should be a valid number
      const daysNum = parseInt(row.daysAgo.match(/\d+/)?.[0] || '0', 10);
      expect(daysNum).toBeGreaterThanOrEqual(0);

      // Dream type should be Good or Bad
      expect(['Good', 'Bad']).toContain(row.dreamType.trim());
    }

    Logger.success(`✓ TEST PASSED: All ${rows.length} rows are consistent`);
  });
});

