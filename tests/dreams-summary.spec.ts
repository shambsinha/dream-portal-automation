import { test, expect, Page } from '@playwright/test';
import { DreamsSummaryPage } from '../pages/DreamsSummaryPage';
import { DreamsDiaryPage } from '../pages/DreamsDiaryPage';
import { Logger } from '../utils/logger';
import config from '../config/config';

test.describe('Dreams Summary Page Tests', () => {
  let page: Page;
  let summaryPage: DreamsSummaryPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    summaryPage = new DreamsSummaryPage(page);
    Logger.section('Starting Dreams Summary Test');
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

  test('T201: Verify page loads successfully', async () => {
    Logger.section('TEST: Summary Page Loads');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Get page title
    const title = await summaryPage.getPageTitle();
    Logger.info(`Page Title: ${title}`);
    expect(title.length).toBeGreaterThan(0);

    // Get URL
    const url = await summaryPage.getCurrentUrl();
    expect(url).toContain('dreams-total');

    Logger.success('✓ TEST PASSED: Summary page loaded');
  });

  test('T202: Verify Good Dreams count is 6', async () => {
    Logger.section('TEST: Verify Good Dreams Count');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify good dreams count
    await summaryPage.verifyGoodDreamsCount(config.EXPECTED_GOOD_DREAMS);

    Logger.success('✓ TEST PASSED: Good dreams count is correct');
  });

  test('T203: Verify Bad Dreams count is 4', async () => {
    Logger.section('TEST: Verify Bad Dreams Count');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify bad dreams count
    await summaryPage.verifyBadDreamsCount(config.EXPECTED_BAD_DREAMS);

    Logger.success('✓ TEST PASSED: Bad dreams count is correct');
  });

  test('T204: Verify Total Dreams count is 10', async () => {
    Logger.section('TEST: Verify Total Dreams Count');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify total dreams count
    await summaryPage.verifyTotalDreamsCount(config.EXPECTED_TOTAL_DREAMS);

    Logger.success('✓ TEST PASSED: Total dreams count is correct');
  });

  test('T205: Verify Recurring Dreams count is 2', async () => {
    Logger.section('TEST: Verify Recurring Dreams Count');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify recurring dreams count
    await summaryPage.verifyRecurringDreamsCount(config.EXPECTED_RECURRING_DREAMS);

    Logger.success('✓ TEST PASSED: Recurring dreams count is correct');
  });

  test('T206: Verify recurring dreams list contains expected dreams', async () => {
    Logger.section('TEST: Verify Recurring Dreams List');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify recurring dreams list
    await summaryPage.verifyRecurringDreamsListContains(config.EXPECTED_RECURRING_DREAM_NAMES);

    Logger.success('✓ TEST PASSED: Recurring dreams list is correct');
  });

  test('T207: Get and display summary statistics', async () => {
    Logger.section('TEST: Get Summary Statistics');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Get statistics
    const stats = await summaryPage.getSummaryStats();

    Logger.info(`Good Dreams: ${stats.goodDreams}`);
    Logger.info(`Bad Dreams: ${stats.badDreams}`);
    Logger.info(`Total Dreams: ${stats.totalDreams}`);
    Logger.info(`Recurring Dreams: ${stats.recurringDreams}`);

    // Verify all values are present
    expect(stats.goodDreams).toBeGreaterThan(0);
    expect(stats.badDreams).toBeGreaterThan(0);
    expect(stats.totalDreams).toBeGreaterThan(0);

    Logger.success('✓ TEST PASSED: Statistics retrieved');
  });

  test('T208: Get recurring dreams list', async () => {
    Logger.section('TEST: Get Recurring Dreams List');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Get recurring list
    const recurringDreams = await summaryPage.getRecurringDreamsList();

    Logger.info(`Found ${recurringDreams.length} recurring dreams`);
    recurringDreams.forEach((dream, index) => {
      Logger.info(`  ${index + 1}. ${dream}`);
    });

    expect(recurringDreams.length).toBeGreaterThan(0);

    Logger.success('✓ TEST PASSED: Recurring dreams list retrieved');
  });

  test('T209: Verify all summary counts together', async () => {
    Logger.section('TEST: Comprehensive Summary Validation');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Verify all counts
    await summaryPage.verifySummaryCounts();

    Logger.success('✓ TEST PASSED: All summary counts verified');
  });

  test('T210: Validate summary data consistency', async () => {
    Logger.section('TEST: Summary Data Consistency');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Get statistics
    const stats = await summaryPage.getSummaryStats();

    // Verify logical consistency
    expect(stats.goodDreams + stats.badDreams).toBe(stats.totalDreams);
    Logger.success(`✓ Good (${stats.goodDreams}) + Bad (${stats.badDreams}) = Total (${stats.totalDreams})`);

    expect(stats.recurringDreams).toBeLessThanOrEqual(stats.totalDreams);
    Logger.success(`✓ Recurring (${stats.recurringDreams}) <= Total (${stats.totalDreams})`);

    Logger.success('✓ TEST PASSED: Data consistency verified');
  });

  test('T211: Cross-check diary data with summary', async () => {
    Logger.section('TEST: Cross-Check Diary vs Summary');

    // Get diary data
    const diaryPage = new DreamsDiaryPage(page);
    await diaryPage.navigateToDreamsDiary();
    await diaryPage.waitForPageLoad();

    const goodFromDiary = await diaryPage.getGoodDreamCount();
    const badFromDiary = await diaryPage.getBadDreamCount();
    const recurringFromDiary = (await diaryPage.getRecurringDreams()).length;

    Logger.info('From Diary:');
    Logger.info(`  Good Dreams: ${goodFromDiary}`);
    Logger.info(`  Bad Dreams: ${badFromDiary}`);
    Logger.info(`  Recurring Dreams: ${recurringFromDiary}`);

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    const stats = await summaryPage.getSummaryStats();

    Logger.info('From Summary:');
    Logger.info(`  Good Dreams: ${stats.goodDreams}`);
    Logger.info(`  Bad Dreams: ${stats.badDreams}`);
    Logger.info(`  Recurring Dreams: ${stats.recurringDreams}`);

    // Verify consistency
    expect(stats.goodDreams).toBe(goodFromDiary);
    Logger.success('✓ Good dreams count matches');

    expect(stats.badDreams).toBe(badFromDiary);
    Logger.success('✓ Bad dreams count matches');

    expect(stats.recurringDreams).toBe(recurringFromDiary);
    Logger.success('✓ Recurring dreams count matches');

    Logger.success('✓ TEST PASSED: Diary and summary data are consistent');
  });

  test('T212: Print summary report', async () => {
    Logger.section('TEST: Print Summary Report');

    // Navigate to summary page
    await summaryPage.navigateToDreamsSummary();
    await summaryPage.waitForPageLoad();

    // Print summary
    await summaryPage.printSummary();

    Logger.success('✓ TEST PASSED: Summary report printed');
  });
});

